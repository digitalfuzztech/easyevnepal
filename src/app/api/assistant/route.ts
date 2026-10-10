import { NextResponse } from "next/server";
import {
  siteSearch,
  searchVehicles,
  searchProducts,
  searchArticles,
  searchStations,
  searchPages,
  parseBudget,
  parseCategory,
  findVehiclesByNames,
  countFullWordMatches,
} from "@/lib/siteSearch";
import { formatPriceRange } from "@/lib/format";

/**
 * POST /api/assistant
 * Body: { message: string (≤1000 chars), history?: {role:'user'|'assistant', text:string}[] (≤10),
 *         context?: { path?: string, vehicleSlug?: string, productSlug?: string, compareSlugs?: string[] } }
 * Returns: { reply, mode: 'ai'|'local', vehicles[], products[], articles[], stations[], links[], lead }
 *
 * AI integration boundary: if OPENAI_API_KEY (+ optional OPENAI_MODEL) is configured,
 * the server grounds an OpenAI chat completion in retrieved catalog facts. Otherwise —
 * and on any AI failure — it falls back to the deterministic local composer below.
 * No secrets are ever sent to the browser. Only top-k retrieved facts leave the server.
 */

export interface AssistantContext {
  path?: string;
  vehicleSlug?: string;
  productSlug?: string;
  compareSlugs?: string[];
}

interface ChatMsg {
  role: "user" | "assistant";
  text: string;
}

// Simple in-memory per-IP rate limit (best-effort; use a store like Upstash in production).
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_HITS = 20;

function limited(ip: string): boolean {
  const now = Date.now();
  const arr = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  HITS.set(ip, arr);
  return arr.length > MAX_HITS;
}

const GREET = /^(hi|hello|hey|namaste|namaskar|good (morning|afternoon|evening))\b/;
const COMPARE_INTENT = /(compar|versus|\bvs\b|difference|differences|which (one|is) better|better between)/;
const BUDGET_INTENT = /(lakh|crore|\bbudget\b|under|below|cheap|affordable|price|premium)/;
const CONTACT_INTENT = /(contact|talk to|human|team|call|phone|quotation|quote|test.?drive|buying assistance|alert me|notify|book)/;
const CHARGING_INFO = /(charging|charge|connector|plug|station|range anxiety|road.?trip|pokhara|highway|battery|warranty)/;
const USED_INTENT = /(used|second.?hand|pre.?owned|old ev|resale)/;
const UPCOMING_INTENT = /(upcoming|coming soon|launch|future|new model)/;
const SCOOTER_INTENT = /(scoot|scooty|bike\b|motorbike|two.?wheeler)/;
const FAMILY_INTENT = /(family|spacious|7.?seater|kids|practical)/;

function vehicleName(v: { brand: string; model: string }) {
  return `${v.brand} ${v.model}`;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return NextResponse.json(
      { error: "You are sending messages a bit too fast. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  let body: { message?: unknown; history?: unknown; context?: AssistantContext };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Could not read your message. Please try again." }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim().slice(0, 1000) : "";
  if (!message) return NextResponse.json({ error: "Please type a message first." }, { status: 400 });

  const history: ChatMsg[] = Array.isArray(body.history)
    ? body.history
        .filter(
          (m): m is ChatMsg =>
            !!m && typeof (m as ChatMsg).text === "string" &&
            ((m as ChatMsg).role === "user" || (m as ChatMsg).role === "assistant")
        )
        .slice(-10)
        .map((m) => ({ role: m.role, text: m.text.slice(0, 1000) }))
    : [];

  const context: AssistantContext =
    body.context && typeof body.context === "object" ? body.context : {};

  // 1. Retrieve relevant facts (small top-k sets only).
  const local = composeLocal(message, context);

  // 2. Optional server-side AI grounding.
  if (process.env.OPENAI_API_KEY) {
    try {
      const ai = await groundedAI(message, history, context, local);
      if (ai) return NextResponse.json({ ...local, reply: ai, mode: "ai" });
    } catch (e) {
      console.error("assistant AI failed, using local fallback", e);
    }
  }

  return NextResponse.json({ ...local, mode: "local" });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    contract: "POST { message, history?, context? }",
    aiConfigured: !!process.env.OPENAI_API_KEY,
    aiEnv: ["OPENAI_API_KEY (required for AI mode)", "OPENAI_MODEL (optional, default gpt-4o-mini)"],
    note: "Without OPENAI_API_KEY the assistant uses deterministic site search (local mode).",
  });
}

// ---------------------------------------------------------------------------
// Deterministic local composer (always available)
// ---------------------------------------------------------------------------

interface LocalOut {
  reply: string;
  vehicles: ReturnType<typeof searchVehicles>;
  products: ReturnType<typeof searchProducts>;
  articles: ReturnType<typeof searchArticles>;
  stations: ReturnType<typeof searchStations>;
  links: { label: string; href: string }[];
  lead: { vehicle: string; type: string } | null;
}

function empty(): LocalOut {
  return { reply: "", vehicles: [], products: [], articles: [], stations: [], links: [], lead: null };
}

function contextHint(context: AssistantContext): string {
  if (context.vehicleSlug) return " I can see you are viewing a vehicle page — ask me about its range, charging, or specs.";
  if (context.productSlug) return " I can see you are viewing a product — ask me about compatibility or requesting a quotation.";
  if (context.compareSlugs && context.compareSlugs.length >= 2)
    return " I can see your comparison — ask me to explain the main differences.";
  return "";
}

function composeLocal(message: string, context: AssistantContext): LocalOut {
  const out = empty();
  const t = message.toLowerCase();

  // — Greeting / opener —
  if (GREET.test(t) && message.trim().split(/\s+/).length <= 4) {
    out.reply =
      "Hi! I'm your EasyEV assistant. I can search our actual EV catalog, explain charging, or point you to the right guide." +
      contextHint(context) +
      " What are you looking for today — a vehicle within a budget, a comparison, or charging help?";
    out.links = [
      { label: "Browse all EVs", href: "/evs" },
      { label: "Compare vehicles", href: "/compare" },
      { label: "Charging guide", href: "/charging" },
    ];
    return out;
  }

  // — Comparison assistance (uses real catalog + existing /compare?vs= format) —
  if (COMPARE_INTENT.test(t)) {
    const named = findVehiclesByNames(message);
    if (named.length >= 2) {
      const picks = named.slice(0, 3);
      const rows = [
        ["Indicative price", picks.map((v) => (v.priceMinNPR == null && v.priceMaxNPR == null ? "On request" : formatPriceRange(v.priceMinNPR, v.priceMaxNPR)))],
        ["Claimed range", picks.map((v) => (v.rangeKm ? `${v.rangeKm} km (${v.rangeSource})` : "Not published"))],
        ["Battery", picks.map((v) => (v.batteryKwh ? `${v.batteryKwh} kWh` : "Not published"))],
        ["Clearance", picks.map((v) => (v.groundClearanceMm ? `${v.groundClearanceMm} mm` : "Not published"))],
      ];
      const diffs = rows
        .filter(([, vals]) => new Set(vals).size > 1)
        .map(([label, vals]) => `${label}: ${picks.map((v, i) => `${vehicleName(v)} — ${vals[i]}`).join("; ")}`);
      out.reply =
        `Here's a factual snapshot from our catalog (indicative prices, claims as published):\n` +
        (diffs.length ? diffs.map((d) => `• ${d}`).join("\n") : "• These models look very close on published figures — open the full table to inspect row by row.") +
        `\n\nFigures marked as claims or lab-cycle values are not guaranteed real-world distances.`;
      out.vehicles = picks.map((v) => ({
        vehicle: v,
        price: formatPriceRange(v.priceMinNPR, v.priceMaxNPR),
        reason: `${v.rangeKm ?? "—"} km claimed · ${v.batteryKwh ?? "—"} kWh`,
      }));
      const vs = picks.map((v) => v.slug).join(",");
      out.links = [{ label: `Open full comparison`, href: `/compare?vs=${vs}` }];
      return out;
    }
    if (named.length === 1) {
      out.reply = `I found ${vehicleName(named[0])} in our catalog. Which second vehicle should I compare it with? (e.g. "compare ${vehicleName(named[0])} and BYD Atto 3")`;
      out.vehicles = searchVehicles(vehicleName(named[0]), { limit: 1 });
      return out;
    }
    out.reply =
      "I can compare any two vehicles from our catalog with real figures. Tell me which two — for example, “compare Nexon EV and Atto 3”.";
    out.links = [{ label: "Open comparison tool", href: "/compare" }];
    return out;
  }

  // — Contact / lead handoff (no auto-submit; deep link with context) —
  if (CONTACT_INTENT.test(t)) {
    const named = findVehiclesByNames(message);
    const vehicle = named[0] ? vehicleName(named[0]) : context.vehicleSlug ?? "";
    const type = /test.?drive/.test(t)
      ? "Test-drive request"
      : /quote|quotation|price/.test(t)
        ? "Price quotation"
        : /alert|notify|upcoming|launch/.test(t)
          ? "Upcoming vehicle alert"
          : "General EV advice";
    out.reply =
      `Happy to connect you with the team. Tap below to open the inquiry form — ` +
      `${vehicle ? `I've pre-filled “${vehicle}” and “${type}”.` : `you can pick the inquiry type on the form.`} ` +
      `Nothing is submitted until you confirm it there.`;
    out.lead = { vehicle, type };
    out.links = [
      {
        label: "Open inquiry form",
        href: `/inquire?vehicle=${encodeURIComponent(vehicle)}&type=${encodeURIComponent(type)}`,
      },
    ];
    if (named[0]) out.vehicles = searchVehicles(vehicleName(named[0]), { limit: 1 });
    return out;
  }

  // — Used / upcoming shortcuts —
  if (USED_INTENT.test(t)) {
    out.reply =
      "Our used-EV section lists pre-owned vehicles with honest labels: seller-provided vs dealer-verified, plus battery-health notes where given. Stock here is demonstration data — always inspect before paying an advance.";
    out.links = [{ label: "Browse used EVs", href: "/used-evs" }];
    return out;
  }
  if (UPCOMING_INTENT.test(t)) {
    out.reply =
      "Our upcoming page separates confirmed announcements from estimates. You can register a launch alert for any model — it opens the inquiry form with the alert type pre-filled.";
    out.links = [{ label: "See upcoming models", href: "/upcoming-evs" }];
    return out;
  }

  // — Products / chargers (explicit shopping intent wins over general charging info) —
  const wantsProducts = /(products?|accessories|adapters?|wallbox|dashcams?|mats|inflator|buy|shop|store|show me chargers?|chargers? for|portable charger)/.test(t);
  if (wantsProducts) {
    const products = searchProducts(message);
    if (products.length) {
      out.products = products;
      out.reply =
        `I found ${products.length} relevant item${products.length > 1 ? "s" : ""} in our products shelf. Tap one for specs and compatibility, then request availability — there's no checkout, just a quotation request.`;
      out.links = [{ label: "All products", href: "/products" }];
      return out;
    }
  }

  // — Budget / finder workflow —
  const budget = parseBudget(message);
  const category = parseCategory(message);
  if (
    BUDGET_INTENT.test(t) ||
    SCOOTER_INTENT.test(t) ||
    FAMILY_INTENT.test(t) ||
    category ||
    budget.max ||
    budget.min ||
    /find|show|looking|suggest|recommend|available|options|models/i.test(t)
  ) {
    const cat = category ?? (SCOOTER_INTENT.test(t) ? "Scooter" : FAMILY_INTENT.test(t) ? "SUV" : null);
    const hits = searchVehicles(message, { ...budget, category: cat, limit: 4 });
    if (hits.length) {
      const bits: string[] = [];
      if (budget.max) bits.push(`up to Rs. ${(budget.max / 100000).toFixed(budget.max % 100000 ? 1 : 0)} Lakh`);
      if (budget.min && !budget.max) bits.push(`from Rs. ${(budget.min / 100000).toFixed(0)} Lakh`);
      if (cat) bits.push(cat === "Scooter" ? "scooters" : cat === "SUV" ? "SUVs" : cat.toLowerCase() + "s");
      out.vehicles = hits;
      out.reply =
        `Based on our catalog${bits.length ? ` (${bits.join(", ")})` : ""}, here ${hits.length === 1 ? "is the closest match" : `are the top ${hits.length} matches`}. ` +
        `Prices are indicative and range figures are claims — tap any card for the full story. Want me to narrow further by city use, family space, or longer trips?`;
      const params = new URLSearchParams();
      if (cat) params.set("category", cat);
      if (budget.max) params.set("budget", String(budget.max));
      if (budget.min) params.set("min", String(budget.min));
      out.links = [{ label: "See all matches in catalog", href: `/evs?${params.toString()}` }];
      return out;
    }
    out.reply =
      `I couldn't find a catalog match for that combination. Our demo inventory is small — try a wider budget, or tell me the category (SUV, hatchback, scooter) and I'll show the closest options.` +
      contextHint(context);
    out.links = [
      { label: "Browse all EVs", href: "/evs" },
      { label: "Talk to the team", href: "/inquire" },
    ];
    return out;
  }

  // — Charging / stations / road trips —
  if (CHARGING_INFO.test(t)) {
    const articles = searchArticles(message);
    const stations = searchStations(message);
    const pages = searchPages(message);
    out.articles = articles.slice(0, 2);
    out.stations = stations.slice(0, 2);
    out.reply =
      `Here's what we have on that: our charging guide covers home vs public, connectors and speeds; ` +
      `the stations page lists valley & highway points (no live status — always call ahead).` +
      (articles.length ? ` I've linked the most relevant guide${articles.length > 1 ? "s" : ""} below.` : "");
    out.links = [
      { label: "Charging guide", href: "/charging" },
      { label: "Station list", href: "/charging-stations" },
      ...pages
        .filter((p) => p.href !== "/charging" && p.href !== "/charging-stations")
        .slice(0, 2)
        .map((p) => ({ label: p.title, href: p.href })),
    ].slice(0, 4);
    return out;
  }

  // — General site search fallback (requires at least one full-word match) —
  const r = siteSearch(message);
  const hayTexts = [
    ...r.vehicles.map((h) => `${h.vehicle.brand} ${h.vehicle.model} ${h.vehicle.category}`),
    ...r.products.map((p) => `${p.name} ${p.brand} ${p.category}`),
    ...r.articles.map((a) => `${a.title} ${a.excerpt} ${a.category}`),
    ...r.pages.map((p) => `${p.title} ${p.keywords.join(" ")}`),
  ];
  if (countFullWordMatches(message, hayTexts) === 0) {
    out.reply =
      `I'm not sure about that one — I only answer from EasyEVNepal's catalog, guides and pages, and I won't guess. ` +
      `Try asking for an EV by budget (e.g. “SUVs under 40 lakh”), a comparison (“compare Nexon EV and Atto 3”), charging help, or tap below to reach the team.` +
      contextHint(context);
    out.links = [
      { label: "Browse all EVs", href: "/evs" },
      { label: "Talk to the team", href: "/inquire" },
    ];
    return out;
  }
  const parts: string[] = [];
  if (r.vehicles.length) {
    out.vehicles = r.vehicles;
    parts.push(`${r.vehicles.length} vehicle${r.vehicles.length > 1 ? "s" : ""}`);
  }
  if (r.products.length) {
    out.products = r.products.slice(0, 2);
    parts.push(`${out.products.length} product${out.products.length > 1 ? "s" : ""}`);
  }
  if (r.articles.length) {
    out.articles = r.articles.slice(0, 2);
    parts.push(`${out.articles.length} guide${out.articles.length > 1 ? "s" : ""}`);
  }
  if (r.pages.length) out.links = r.pages.map((p) => ({ label: p.title, href: p.href }));
  if (parts.length) {
    out.reply =
      `I found ${parts.join(", ")} in our site data that look relevant. They're linked below with real pages — take a look, or tell me your budget and vehicle type and I'll narrow it down.`;
    return out;
  }
  out.reply =
    `I'm not sure about that one — I only answer from EasyEVNepal's catalog, guides and pages, and I won't guess. ` +
    `Try asking for an EV by budget (e.g. “SUVs under 40 lakh”), a comparison (“compare Nexon EV and Atto 3”), charging help, or tap below to reach the team.` +
    contextHint(context);
  out.links = [
    { label: "Browse all EVs", href: "/evs" },
    { label: "Talk to the team", href: "/inquire" },
  ];
  return out;
}

// ---------------------------------------------------------------------------
// Optional OpenAI grounding (server-side only)
// ---------------------------------------------------------------------------

async function groundedAI(
  message: string,
  history: ChatMsg[],
  context: AssistantContext,
  local: LocalOut
): Promise<string | null> {
  const facts = {
    vehicles: local.vehicles.slice(0, 4).map((h) => ({
      name: `${h.vehicle.brand} ${h.vehicle.model}`,
      price: h.price,
      range: h.vehicle.rangeKm ? `${h.vehicle.rangeKm} km (${h.vehicle.rangeSource})` : "not published",
      battery: h.vehicle.batteryKwh ? `${h.vehicle.batteryKwh} kWh` : "not published",
      category: h.vehicle.category,
      slug: h.vehicle.slug,
    })),
    products: local.products.slice(0, 2).map((p) => ({ name: p.name, category: p.category, slug: p.slug })),
    articles: local.articles.slice(0, 2).map((a) => ({ title: a.title, kind: a.kind, slug: a.slug })),
    context,
    localReply: local.reply,
  };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: ctrl.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.3,
        max_tokens: 400,
        messages: [
          {
            role: "system",
            content:
              "You are the EasyEV Assistant for EasyEVNepal, an EV discovery site. " +
              "Answer ONLY from the retrieved site facts provided. Never invent prices, specs, availability, contact details, or policies. " +
              "If a fact is missing, say it is not published. Keep replies under 120 words, friendly, with at most one follow-up question. " +
              "Prices are indicative; range figures are claims, never guarantees. Do not claim to be human.",
          },
          ...history.slice(-6).map((m) => ({ role: m.role, content: m.text })),
          {
            role: "user",
            content: `Question: ${message}\nRetrieved site facts: ${JSON.stringify(facts)}`,
          },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return text || null;
  } finally {
    clearTimeout(timer);
  }
}
