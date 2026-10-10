"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  X,
  Send,
  RotateCcw,
  GitCompareArrows,
  ArrowUpRight,
  BookOpen,
  MapPin,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { SafeImage } from "../SafeImage";

interface VehicleCard {
  vehicle: { slug: string; brand: string; model: string; image: string };
  price: string;
  reason: string;
}
interface ProductCard {
  slug: string;
  name: string;
  brand: string;
  category: string;
  priceNPR?: number | null;
  image: string;
}
interface ArticleCard {
  slug: string;
  kind: string;
  title: string;
  category: string;
}
interface StationCard {
  id: string;
  name: string;
  city: string;
  power: string;
}
interface MsgLink {
  label: string;
  href: string;
}
interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  vehicles?: VehicleCard[];
  products?: ProductCard[];
  articles?: ArticleCard[];
  stations?: StationCard[];
  links?: MsgLink[];
  lead?: { vehicle: string; type: string } | null;
}

const QUICK_ACTIONS = [
  "Find an EV for my budget",
  "Compare two vehicles",
  "Explore electric scooters",
  "Understand EV charging",
  "Find an EV for family use",
  "Talk to the EasyEV team",
];

const WELCOME: Message = {
  id: 0,
  role: "assistant",
  text: "Hi! I'm your EasyEV assistant. Looking for an EV, comparing models, or need help finding something on our website? Let's make it easy.",
};

function pageContext(pathname: string) {
  let search = "";
  try {
    search = window.location.search;
  } catch {
    search = "";
  }
  const ctx: { path: string; vehicleSlug?: string; productSlug?: string; compareSlugs?: string[] } = {
    path: pathname + search,
  };
  const evMatch = pathname.match(/^\/evs\/([^/]+)/);
  if (evMatch) ctx.vehicleSlug = decodeURIComponent(evMatch[1]);
  const pMatch = pathname.match(/^\/products\/([^/]+)/);
  if (pMatch) ctx.productSlug = decodeURIComponent(pMatch[1]);
  if (pathname === "/compare") {
    const params = new URLSearchParams(search);
    const vs = params.get("vs");
    const add = params.get("add");
    const slugs = [...(vs ? vs.split(",") : []), ...(add ? [add] : [])].filter(Boolean);
    if (slugs.length) ctx.compareSlugs = slugs;
  }
  return ctx;
}

function contextNudge(pathname: string): string | null {
  if (/^\/evs\/[^/]+/.test(pathname))
    return "Want help understanding this vehicle's range, charging, or specifications?";
  if (pathname === "/compare")
    return "Would you like me to explain the main differences between these models?";
  if (/^\/products\/[^/]+/.test(pathname))
    return "Need help understanding compatibility or requesting a quotation?";
  if (pathname === "/evs" || pathname === "/used-evs" || pathname === "/upcoming-evs")
    return "Tell me your budget and the kind of vehicle you're looking for.";
  if (pathname.startsWith("/charging"))
    return "Ask me anything about home vs public charging, connectors, or stations.";
  return null;
}

let nextId = 1;

export function AssistantWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sendingRef = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nudge = contextNudge(pathname ?? "");

  // Auto-scroll to latest message
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open, sending]);

  // Focus input on open; Escape closes
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      window.addEventListener("keydown", onKey);
      return () => {
        window.removeEventListener("keydown", onKey);
        clearTimeout(t);
      };
    } else {
      launcherRef.current?.focus();
    }
  }, [open ]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim().slice(0, 1000);
      if (!text || sendingRef.current) return;
      sendingRef.current = true;
      setSending(true);
      setError(null);
      const userMsg: Message = { id: nextId++, role: "user", text };
      const history = [...messages, userMsg]
        .slice(-11)
        .map((m) => ({ role: m.role, text: m.text }));
      setMessages((ms) => [...ms, userMsg]);
      setInput("");
      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            history,
            context: typeof window !== "undefined" ? pageContext(window.location.pathname) : { path: pathname },
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "The assistant is having trouble right now.");
        const reply: Message = {
          id: nextId++,
          role: "assistant",
          text: data.reply || "I found some options below — take a look.",
          vehicles: data.vehicles,
          products: data.products,
          articles: data.articles,
          stations: data.stations,
          links: data.links,
          lead: data.lead,
        };
        setMessages((ms) => [...ms, reply]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      } finally {
        sendingRef.current = false;
        setSending(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [messages, pathname]
  );

  function reset() {
    setMessages([WELCOME]);
    setError(null);
    setInput("");
    inputRef.current?.focus();
  }

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          ref={launcherRef}
          onClick={() => setOpen(true)}
          aria-label="Open EasyEV Assistant"
          className="btn-press fixed bottom-5 right-5 z-40 grid h-16 w-16 place-items-center rounded-full bg-navy text-white shadow-lift ring-4 ring-skyvivid/40 transition hover:bg-deep focus-visible:ring-skyvivid sm:h-[72px] sm:w-[72px]"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
          <span className="animate-assist-float grid place-items-center" aria-hidden>
            <MessageCircle size={32} strokeWidth={2.25} fill="currentColor" className="text-white" />
          </span>
          <span className="absolute inset-0 rounded-full ring-2 ring-white/25" aria-hidden />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="EasyEV Assistant"
          className="animate-pop fixed z-[55] flex flex-col overflow-hidden border border-cardline bg-white shadow-lift inset-x-3 bottom-3 max-h-[80dvh] rounded-[1.5rem] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[620px] sm:max-h-[82dvh] sm:w-[400px] sm:rounded-[1.75rem]"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-deep px-4 py-3.5 text-white">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-skyvivid text-deep">
              <Bot size={22} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] font-extrabold leading-tight">EasyEV Assistant</p>
              <p className="flex items-center gap-1.5 text-[12px] text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-ocean" /> Answers from EasyEVNepal site data
              </p>
            </div>
            <button
              onClick={reset}
              aria-label="Start new conversation"
              title="Start new conversation"
              className="btn-press grid h-9 w-9 place-items-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
            >
              <RotateCcw size={17} />
            </button>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="btn-press grid h-9 w-9 place-items-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X size={19} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="chat-scroll flex-1 overflow-y-auto bg-ivory px-3.5 py-4" aria-live="polite">
            <div className="space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`animate-chat-in ${m.role === "user" ? "flex justify-end" : "flex justify-start"}`}>
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-md bg-deep font-medium text-white"
                        : "rounded-bl-md border border-cardline bg-white text-ink shadow-soft"
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                    {m.role === "assistant" && <AssistantExtras msg={m} />}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start" aria-label="Assistant is typing">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-cardline bg-white px-4 py-3 shadow-soft">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="typing-dot h-2 w-2 rounded-full bg-brand" />
                    ))}
                  </div>
                </div>
              )}
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-[13px] font-medium text-red-700" role="alert">
                  {error}{" "}
                  <button onClick={() => input && send(input)} className="font-bold underline underline-offset-2">
                    Retry
                  </button>
                </div>
              )}
            </div>

            {/* Context nudge (first turn only) */}
            {messages.length === 1 && nudge && (
              <button
                onClick={() => send(nudge)}
                className="btn-press mt-3 w-full rounded-2xl border-[1.5px] border-dashed border-brand/30 bg-palesky/60 p-3 text-left text-[13px] font-semibold text-brand hover:bg-palesky"
              >
                {nudge}
              </button>
            )}
          </div>

          {/* Quick actions */}
          <div className="border-t border-cardline bg-white px-3 pt-2.5">
            <div className="rail-scroll flex gap-2 overflow-x-auto pb-2.5">
              {QUICK_ACTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  disabled={sending}
                  className="btn-press shrink-0 rounded-full border-[1.5px] border-strongline bg-tint/70 px-3.5 py-1.5 text-[12px] font-bold text-brand transition hover:border-ocean hover:bg-palesky disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form
            className="flex items-end gap-2 bg-white p-3 pt-1"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <label htmlFor="eva-input" className="sr-only">
              Message EasyEV Assistant
            </label>
            <textarea
              id="eva-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              maxLength={1000}
              placeholder="Ask about EVs, budgets, charging…"
              className="max-h-28 min-h-[44px] flex-1 resize-none rounded-2xl border-[1.5px] border-strongline bg-white px-4 py-2.5 text-[13.5px] outline-none transition placeholder:text-muted focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send message"
              className="btn-press grid h-11 w-11 shrink-0 place-items-center rounded-full bg-deep text-white transition hover:bg-brand disabled:opacity-40"
            >
              <Send size={17} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function AssistantExtras({ msg }: { msg: Message }) {
  return (
    <div className="mt-2.5 space-y-2">
      {msg.vehicles?.map((h) => (
        <div key={h.vehicle.slug} className="flex gap-2.5 rounded-2xl border border-cardline bg-ivory p-2.5">
          <SafeImage
            src={h.vehicle.image}
            alt={`${h.vehicle.brand} ${h.vehicle.model}`}
            className="h-14 w-20 shrink-0 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-extrabold text-ink">
              {h.vehicle.brand} {h.vehicle.model}
            </p>
            <p className="tnum text-[12px] font-bold text-brand">{h.price}</p>
            <p className="truncate text-[11.5px] text-muted">{h.reason}</p>
            <div className="mt-1 flex gap-2 text-[11.5px] font-bold">
              <Link href={`/evs/${h.vehicle.slug}`} className="text-brand hover:underline">
                Details
              </Link>
              <Link href={`/compare?add=${h.vehicle.slug}`} className="inline-flex items-center gap-0.5 text-brand hover:underline">
                <GitCompareArrows size={11} /> Compare
              </Link>
              <Link href={`/inquire?vehicle=${h.vehicle.slug}`} className="text-brand hover:underline">
                Inquire
              </Link>
            </div>
          </div>
        </div>
      ))}
      {msg.products?.map((p) => (
        <Link
          key={p.slug}
          href={`/products/${p.slug}`}
          className="flex items-center gap-2.5 rounded-2xl border border-cardline bg-ivory p-2.5 transition hover:border-ocean"
        >
          <SafeImage src={p.image} alt={p.name} className="h-11 w-14 shrink-0 rounded-lg object-cover" />
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-extrabold text-ink">{p.name}</span>
            <span className="tnum block text-[12px] font-bold text-brand">
              {p.priceNPR ? `Rs. ${p.priceNPR.toLocaleString("en-IN")}` : "Price on request"}
            </span>
          </span>
          <ArrowUpRight size={15} className="ml-auto shrink-0 text-muted" />
        </Link>
      ))}
      {msg.articles?.map((a) => (
        <Link
          key={a.slug}
          href={`/${a.kind === "news" ? "news" : "guides"}/${a.slug}`}
          className="flex items-center gap-2 rounded-2xl border border-cardline bg-ivory p-2.5 text-[12.5px] font-bold text-ink transition hover:border-ocean hover:text-brand"
        >
          <BookOpen size={15} className="shrink-0 text-ocean" />
          <span className="clamp-2">{a.title}</span>
        </Link>
      ))}
      {msg.stations?.map((s) => (
        <div key={s.id} className="flex items-center gap-2 rounded-2xl border border-cardline bg-ivory p-2.5 text-[12.5px]">
          <MapPin size={15} className="shrink-0 text-brand" />
          <span>
            <span className="block font-bold text-ink">{s.name}</span>
            <span className="block text-muted">{s.city} · {s.power}</span>
          </span>
        </div>
      ))}
      {msg.lead && (
        <Link
          href={`/inquire?vehicle=${encodeURIComponent(msg.lead.vehicle)}&type=${encodeURIComponent(msg.lead.type)}`}
          className="btn-press flex items-center justify-center gap-1.5 rounded-2xl bg-deep py-2.5 text-[13px] font-bold text-white"
        >
          Open inquiry form <ArrowUpRight size={14} />
        </Link>
      )}
      {msg.links && msg.links.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {msg.links.map((l) => (
            <Link
              key={l.href + l.label}
              href={l.href}
              className="btn-press inline-flex items-center gap-1 rounded-full bg-palesky px-3 py-1.5 text-[12px] font-bold text-deep transition hover:bg-lightblue"
            >
              {l.label} <ChevronDown size={12} className="-rotate-90" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
