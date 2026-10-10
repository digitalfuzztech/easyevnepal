import { VEHICLES, type Vehicle } from "@/data/vehicles";
import { PRODUCTS, type Product } from "@/data/products";
import { ARTICLES, type Article } from "@/data/articles";
import { STATIONS, type Station } from "@/data/stations";
import { formatPriceRange } from "./format";

export interface PageEntry {
  href: string;
  title: string;
  keywords: string[];
}

export const SITE_PAGES: PageEntry[] = [
  { href: "/evs", title: "Explore all EVs", keywords: ["ev", "electric vehicles", "cars", "catalog", "browse", "list", "discover", "models"] },
  { href: "/compare", title: "Compare vehicles", keywords: ["compare", "comparison", "versus", "vs", "difference", "differences"] },
  { href: "/used-evs", title: "Used EVs", keywords: ["used", "second hand", "pre-owned", "preowned", "old", "resale"] },
  { href: "/upcoming-evs", title: "Upcoming EVs", keywords: ["upcoming", "coming soon", "launch", "launches", "future", "new models", "alert"] },
  { href: "/charging", title: "EV charging guide", keywords: ["charging", "charge", "charger", "home charging", "public charging", "connector", "plug", "battery charge"] },
  { href: "/charging-stations", title: "Charging stations", keywords: ["stations", "station", "where to charge", "charging points", "map", "kathmandu", "pokhara"] },
  { href: "/guides/ev-road-trips", title: "EV road-trip guide", keywords: ["road trip", "trip", "pokhara", "highway", "travel", "tour"] },
  { href: "/products", title: "Chargers & accessories", keywords: ["products", "accessories", "charger", "chargers", "adapter", "cable", "mats", "dashcam", "store", "shop"] },
  { href: "/guides", title: "Buying guides", keywords: ["guides", "guide", "buying", "advice", "how to", "learn", "help"] },
  { href: "/news", title: "EV news", keywords: ["news", "market", "updates", "launches"] },
  { href: "/inquire", title: "Contact / inquire", keywords: ["contact", "inquire", "inquiry", "talk", "team", "call", "phone", "quotation", "quote", "test drive", "assistance", "help", "human"] },
  { href: "/about", title: "About EasyEVNepal", keywords: ["about", "who", "company"] },
];

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function scoreHaystack(needles: string[], hay: string): number {
  const padded = ` ${hay} `;
  let score = 0;
  for (const n of needles) {
    if (!n) continue;
    if (hay === n) score += 6;
    else if (padded.includes(` ${n} `)) score += 3;
    else if (hay.includes(n)) score += 1;
  }
  return score;
}

/** Count distinct query words (len > 2) appearing as full words in any of the texts. */
export function countFullWordMatches(query: string, texts: string[]): number {
  const words = norm(query).split(" ").filter((w) => w.length > 2);
  const padded = texts.map((t) => ` ${norm(t)} `);
  let count = 0;
  for (const w of words) {
    if (padded.some((p) => p.includes(` ${w} `))) count++;
  }
  return count;
}

/** Parse budget hints like "under 40 lakh", "below 30L", "40-60 lakh", "60 lakh+", "1 crore". */
export function parseBudget(text: string): { max?: number; min?: number } {
  const t = text.toLowerCase().replace(/,/g, "");
  const LAKH = 100000;
  const CRORE = 10000000;
  const num = (s: string) => parseFloat(s);

  const range = t.match(/(\d+(?:\.\d+)?)\s*[-–to]+\s*(\d+(?:\.\d+)?)\s*(lakh|lakhs|l|cro?re?s?)?/);
  if (range) {
    const unit = range[3]?.startsWith("c") ? CRORE : LAKH;
    if (range[3] || /lakh|crore|l\b/.test(t)) return { min: num(range[1]) * unit, max: num(range[2]) * unit };
  }
  const under = t.match(/(under|below|less than|max|budget|upto|up to)\s*(\d+(?:\.\d+)?)\s*(lakh|lakhs|lakh?s?|crore|crores|cr|l)?/);
  if (under) {
    const unit = under[3]?.startsWith("c") ? CRORE : LAKH;
    return { max: num(under[2]) * unit };
  }
  const plus = t.match(/(\d+(?:\.\d+)?)\s*(lakh|lakhs|crore|crores|cr|l)\s*(\+|plus|above|over|onwards)/);
  if (plus) {
    const unit = plus[2].startsWith("c") ? CRORE : LAKH;
    return { min: num(plus[1]) * unit };
  }
  const bare = t.match(/(\d+(?:\.\d+)?)\s*(lakh|lakhs|crore|crores|cr)\b/);
  if (bare && /(budget|around|about|near)/.test(t)) {
    const unit = bare[2].startsWith("c") ? CRORE : LAKH;
    return { max: num(bare[1]) * unit };
  }
  return {};
}

const CATEGORY_ALIASES: { cat: Vehicle["category"]; words: string[] }[] = [
  { cat: "SUV", words: ["suv", "suvs", "crossover", "4x4", "jeep"] },
  { cat: "Hatchback", words: ["hatchback", "hatch", "small car", "city car"] },
  { cat: "Sedan", words: ["sedan", "saloon", "sedans"] },
  { cat: "Scooter", words: ["scooter", "scooters", "scooty", "e-scooter", "vespa"] },
  { cat: "Motorcycle", words: ["motorcycle", "motorbike", "bike", "bikes"] },
  { cat: "Commercial", words: ["commercial", "van", "fleet", "pickup", "truck", "cargo"] },
  { cat: "MPV", words: ["mpv", "muv", "7 seater", "seven seater", "family van"] },
];

export function parseCategory(text: string): Vehicle["category"] | null {
  const t = " " + norm(text) + " ";
  for (const { cat, words } of CATEGORY_ALIASES) {
    if (words.some((w) => t.includes(w))) return cat;
  }
  if (t.includes(" car ") || t.includes(" cars ") || t.includes(" ev ")) return null;
  return null;
}

export interface VehicleHit {
  vehicle: Vehicle;
  price: string;
  reason: string;
}

export function searchVehicles(
  query: string,
  opts?: { max?: number; min?: number; category?: Vehicle["category"] | null; limit?: number }
): VehicleHit[] {
  const limit = opts?.limit ?? 4;
  const words = norm(query).split(" ").filter((w) => w.length > 1);
  const scored = VEHICLES.map((v) => {
    const hay = norm(`${v.brand} ${v.model} ${v.category} ${v.bodyType} ${v.tagline}`);
    let s = scoreHaystack(words, hay);
    // Brand/model exact bonus
    if (words.some((w) => norm(v.brand) === w)) s += 8;
    if (words.some((w) => norm(v.model).split(" ").includes(w))) s += 6;
    return { v, s };
  });

  let list = scored.filter((x) => x.s > 0).sort((a, b) => b.s - a.s).map((x) => x.v);
  // If no textual hit but filters exist, start from full catalog
  if (list.length === 0 && (opts?.max || opts?.min || opts?.category)) list = [...VEHICLES];

  if (opts?.category) list = list.filter((v) => v.category === opts.category);
  if (opts?.max) list = list.filter((v) => v.priceMinNPR != null && v.priceMinNPR <= opts.max!);
  if (opts?.min) list = list.filter((v) => v.priceMaxNPR != null && v.priceMaxNPR >= opts.min!);

  // When only filters were given, order by price ascending for budget queries
  if (words.length === 0 || scored.every((x) => x.s === 0)) {
    list.sort((a, b) => (a.priceMinNPR ?? Infinity) - (b.priceMinNPR ?? Infinity));
  }

  return list.slice(0, limit).map((v) => ({
    vehicle: v,
    price: formatPriceRange(v.priceMinNPR, v.priceMaxNPR),
    reason: [
      v.rangeKm ? `${v.rangeKm} km claimed` : null,
      v.batteryKwh ? `${v.batteryKwh} kWh` : null,
      v.category,
    ]
      .filter(Boolean)
      .join(" · "),
  }));
}

/** Find vehicles explicitly named in free text (brand and/or model mentions). */
export function findVehiclesByNames(text: string): Vehicle[] {
  const t = norm(text);
  const hits: { v: Vehicle; s: number }[] = [];
  for (const v of VEHICLES) {
    const b = norm(v.brand);
    const m = norm(v.model);
    const hasBrand = t.includes(b);
    // model may be multi-word ("atto 3", "nexon ev"); check compact + full
    const compact = m.replace(/\s+/g, "");
    const hasModel = t.includes(m) || (compact.length > 3 && t.replace(/\s+/g, "").includes(compact));
    if (hasBrand && hasModel) hits.push({ v, s: 10 });
    else if (hasModel) hits.push({ v, s: 6 });
    else if (hasBrand && ["compare", "vs", "versus", "and", "difference", "between"].some((w) => t.includes(w))) {
      // brand-only counts when comparison intent is present
      hits.push({ v, s: 3 });
    }
  }
  // De-dupe by brand when only brand matched multiple models: keep best model match
  hits.sort((a, b) => b.s - a.s);
  return hits.map((h) => h.v);
}

export function searchProducts(query: string, limit = 3): Product[] {
  const words = norm(query).split(" ").filter((w) => w.length > 1);
  return PRODUCTS.map((p) => ({
    p,
    s: scoreHaystack(words, norm(`${p.name} ${p.brand} ${p.category} ${p.blurb}`)),
  }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.p);
}

export function searchArticles(query: string, limit = 3): Article[] {
  const words = norm(query).split(" ").filter((w) => w.length > 1);
  return ARTICLES.map((a) => ({
    a,
    s:
      scoreHaystack(words, norm(`${a.title} ${a.excerpt} ${a.category}`)) +
      (a.kind === "guide" && /guide|how|buying|charging|battery|trip/i.test(query) ? 2 : 0),
  }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.a);
}

export function searchStations(query: string, limit = 3): Station[] {
  const words = norm(query).split(" ").filter((w) => w.length > 1);
  return STATIONS.map((s) => ({
    s,
    score: scoreHaystack(words, norm(`${s.name} ${s.city} ${s.area} ${s.connectors.join(" ")}`)),
  }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.s);
}

export function searchPages(query: string, limit = 3): PageEntry[] {
  const words = norm(query).split(" ").filter((w) => w.length > 1);
  return SITE_PAGES.map((p) => ({
    p,
    s: scoreHaystack(words, norm(`${p.title} ${p.keywords.join(" ")}`)),
  }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.p);
}

export interface SiteSearchResult {
  vehicles: VehicleHit[];
  products: Product[];
  articles: Article[];
  stations: Station[];
  pages: PageEntry[];
}

export function siteSearch(query: string): SiteSearchResult {
  const budget = parseBudget(query);
  const category = parseCategory(query);
  return {
    vehicles: searchVehicles(query, { ...budget, category, limit: 4 }),
    products: searchProducts(query),
    articles: searchArticles(query),
    stations: searchStations(query),
    pages: searchPages(query),
  };
}
