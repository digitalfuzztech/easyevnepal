import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BatteryCharging,
  Zap,
  MapPin,
  Compass,
  Scale,
  Wallet,
  PlugZap,
  BookOpen,
  ShieldCheck,
  Search,
  ChevronRight,
  Sparkles,
  Gauge,
} from "lucide-react";
import { VEHICLES, UPCOMING } from "@/data/vehicles";
import { PRODUCTS } from "@/data/products";
import { ARTICLES } from "@/data/articles";
import { formatPriceRange } from "@/lib/format";
import { SafeImage } from "@/components/SafeImage";
import { SectionHeading } from "@/components/ui";
import { VehicleCard, FeaturedVehicleCard } from "@/components/VehicleCard";
import { LeadForm } from "@/components/LeadForm";

const HERO_IMG =
  "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1800&q=80";

function QuickDiscovery() {
  return (
    <div className="rounded-[1.75rem] border border-cardline bg-white p-5 shadow-lift sm:p-6">
      <form action="/evs" method="GET" className="grid items-stretch gap-3 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
        <label className="flex min-h-[52px] items-center gap-2 rounded-2xl border-[1.5px] border-strongline bg-tint px-4 py-3 text-ink transition focus-within:border-brand focus-within:bg-white focus-within:ring-4 focus-within:ring-brand/15 hover:border-brand/50">
          <Search size={17} className="shrink-0 text-brand" aria-hidden />
          <span className="sr-only">Search brand or model</span>
          <input
            name="q"
            placeholder="Search brand or model — try BYD, Nexon…"
            autoComplete="off"
            className="h-full w-full bg-transparent text-[14px] font-medium text-ink outline-none placeholder:text-muted"
          />
        </label>
        <label className="block min-h-[52px] rounded-2xl border-[1.5px] border-strongline bg-tint px-4 py-1 text-ink transition focus-within:border-brand focus-within:bg-white focus-within:ring-4 focus-within:ring-brand/15 hover:border-brand/50">
          <span className="block pt-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-muted">Category</span>
          <span className="sr-only">Category</span>
          <select name="category" defaultValue="" aria-label="Category" className="select-caret w-full bg-transparent pb-1.5 text-[14px] font-bold text-ink outline-none">
            <option value="">All categories</option>
            <option>SUV</option>
            <option>Hatchback</option>
            <option>Sedan</option>
            <option>Scooter</option>
            <option>Motorcycle</option>
            <option>Commercial</option>
          </select>
        </label>
        <label className="block min-h-[52px] rounded-2xl border-[1.5px] border-strongline bg-tint px-4 py-1 text-ink transition focus-within:border-brand focus-within:bg-white focus-within:ring-4 focus-within:ring-brand/15 hover:border-brand/50">
          <span className="block pt-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-muted">Budget</span>
          <span className="sr-only">Budget</span>
          <select name="budget" defaultValue="" aria-label="Budget" className="select-caret w-full bg-transparent pb-1.5 text-[14px] font-bold text-ink outline-none">
            <option value="">Any budget</option>
            <option value="2000000">Under Rs. 20 Lakh</option>
            <option value="3000000">Under Rs. 30 Lakh</option>
            <option value="4000000">Under Rs. 40 Lakh</option>
            <option value="6000000">Under Rs. 60 Lakh</option>
          </select>
        </label>
        <button
          type="submit"
          className="btn-press min-h-[52px] rounded-2xl bg-brand px-7 py-3 text-[14px] font-bold text-white shadow-soft hover:bg-deep"
        >
          Search EVs
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {[
          ["Under Rs. 20 Lakh", "/evs?budget=2000000"],
          ["Under Rs. 30 Lakh", "/evs?budget=3000000"],
          ["Under Rs. 40 Lakh", "/evs?budget=4000000"],
          ["Premium EVs", "/evs?min=6000000"],
        ].map(([label, href]) => (
          <Link
            key={label}
            href={href}
            className="btn-press rounded-full border-[1.5px] border-line bg-white px-4 py-1.5 text-[12.5px] font-bold text-brand hover:border-ocean hover:bg-palesky"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const featured = VEHICLES.filter((v) => v.featured);
  const rest = VEHICLES.filter((v) => !v.featured).slice(0, 6);
  const comparePair = [VEHICLES[0], VEHICLES[1], VEHICLES[2]];
  const guides = ARTICLES.filter((a) => a.kind === "guide").slice(0, 3);
  const news = ARTICLES.find((a) => a.kind === "news");

  const categories = [
    { name: "Electric SUVs", href: "/evs?category=SUV", img: "photo-1568605117036-5fe5e7bab0b7", count: VEHICLES.filter((v) => v.category === "SUV").length, tint: "from-deep/90", chip: "bg-skyvivid text-deep" },
    { name: "Hatchbacks & Sedans", href: "/evs?category=Hatchback", img: "photo-1549317661-bd32c8ce0db2", count: VEHICLES.filter((v) => v.category === "Hatchback" || v.category === "Sedan").length, tint: "from-deep/90", chip: "bg-white text-deep" },
    { name: "Scooters & Bikes", href: "/evs?category=Scooter", img: "photo-1558981403-c5f9899a28bc", count: VEHICLES.filter((v) => v.category === "Scooter").length, tint: "from-brand/90", chip: "bg-skyvivid text-deep" },
    { name: "Used EVs", href: "/used-evs", img: "photo-1449965408869-eaa3f722e40d", count: 3, tint: "from-ink/90", chip: "bg-white text-ink" },
    { name: "Upcoming", href: "/upcoming-evs", img: "photo-1617704548623-340376564e68", count: UPCOMING.length, tint: "from-purple-900/85", chip: "bg-white text-purple-900" },
    { name: "Chargers & Accessories", href: "/products", img: "photo-1593941707882-a5bba14938c7", count: PRODUCTS.length, tint: "from-sky-900/80", chip: "bg-skyvivid text-deep" },
  ];

  return (
    <>
      {/* ————— HERO: midnight-navy brand moment with palesky glow + vehicle star ————— */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0" aria-hidden>
          <SafeImage src={HERO_IMG} alt="" eager className="h-full w-full object-cover object-center opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/55 to-deep/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-navy/20" />
          <div className="absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-skyvivid/20 blur-[110px]" />
          <div className="absolute -right-16 -top-10 h-80 w-80 rounded-full bg-brand/25 blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 h-56 w-56 rounded-full bg-skyvivid/10 blur-[90px]" />
        </div>
        <div className="relative mx-auto max-w-shell px-4 pb-10 pt-14 sm:px-6 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:pb-20 lg:pt-20">
          <div className="max-w-2xl">
            <p className="hero-line inline-flex items-center gap-2 rounded-full border border-skyvivid/40 bg-white/[0.07] px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-skyvivid backdrop-blur" style={{ "--d": "0ms" } as React.CSSProperties}>
              <Zap size={13} /> The next drive starts here
            </p>
            <h1 className="hero-line font-display mt-5 text-balance text-[2.8rem] font-semibold leading-[0.98] tracking-tight sm:text-6xl lg:text-[5.2rem]" style={{ "--d": "90ms" } as React.CSSProperties}>
              Find your kind
              <br />
              of <span className="italic text-skyvivid">electric.</span>
            </h1>
            <p className="hero-line mt-5 max-w-xl text-[15.5px] leading-relaxed text-white/75 sm:text-lg" style={{ "--d": "180ms" } as React.CSSProperties}>
              Explore electric vehicles, compare the details that matter, and discover a
              smarter way to move across Nepal.
            </p>
            <div className="hero-line mt-7 flex flex-wrap gap-3" style={{ "--d": "260ms" } as React.CSSProperties}>
              <Link
                href="/evs"
                className="btn-press inline-flex items-center gap-2 rounded-full bg-skyvivid px-7 py-3.5 text-[15px] font-extrabold text-navy shadow-glow transition hover:bg-white"
              >
                Explore EVs <ArrowRight size={17} />
              </Link>
              <Link
                href="/inquire"
                className="btn-press rounded-full border border-white/30 bg-white/[0.06] px-7 py-3.5 text-[15px] font-bold text-white backdrop-blur hover:bg-white/15"
              >
                Find my EV
              </Link>
            </div>
            <dl className="hero-line mt-9 flex flex-wrap gap-x-8 gap-y-3 text-[13px]" style={{ "--d": "340ms" } as React.CSSProperties}>
              {[
                [`${VEHICLES.length}+ models`, "tracked"],
                ["Real specs", "no invented range"],
                ["Human help", "on request"],
              ].map(([a, b]) => (
                <div key={a} className="flex items-center gap-2">
                  <span className="tnum font-extrabold text-skyvivid">{a}</span>
                  <span className="text-white/60">{b}</span>
                </div>
              ))}
            </dl>
          </div>
          {/* Vehicle star card (desktop) */}
          <div className="hero-line mt-10 hidden lg:block" style={{ "--d": "220ms" } as React.CSSProperties}>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 shadow-lift">
              <SafeImage src={HERO_IMG} alt="Premium electric SUV" eager className="aspect-[4/3.4] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-transparent to-transparent" />
              <div className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-3">
                <div className="rounded-2xl bg-white/95 px-4 py-3 shadow-card backdrop-blur">
                  <p className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-ocean">Featured · BYD</p>
                  <p className="font-display text-lg font-semibold leading-tight text-ink">Atto 3</p>
                  <p className="tnum text-[13px] font-extrabold text-deep">{formatPriceRange(5690000, 6690000)}</p>
                </div>
                <Link href="/evs/byd-atto-3" className="btn-press grid h-12 w-12 place-items-center rounded-full bg-skyvivid text-deep" aria-label="View BYD Atto 3">
                  <ArrowUpRight size={20} />
                </Link>
              </div>
              <div className="absolute left-5 top-5 flex gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-navy/70 px-3 py-1.5 text-[11.5px] font-bold text-white backdrop-blur">
                  <Gauge size={12} /> 420 km claimed
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-navy/70 px-3 py-1.5 text-[11.5px] font-bold text-white backdrop-blur">
                  <BatteryCharging size={12} /> 60.5 kWh
                </span>
              </div>
            </div>
          </div>
          <div className="mt-10 lg:col-span-2 lg:-mb-28">
            <QuickDiscovery />
          </div>
        </div>
      </section>

      {/* ————— FEATURED (bright white stage) ————— */}
      <section className="mx-auto max-w-shell px-4 pt-14 sm:px-6 lg:pt-36">
        <div className="reveal flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Featured EVs"
            title="Start with the ones people ask about most."
            copy="Indicative Nepal-market prices with last-updated dates. Range figures are manufacturer claims or lab-cycle values — never promises."
          />
          <Link href="/evs" className="btn-press inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-line bg-white px-5 py-2.5 text-[13.5px] font-bold text-ink shadow-soft hover:border-deep hover:text-deep">
            Browse all EVs <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-8 grid items-stretch gap-5 lg:grid-cols-3">
          {featured.slice(0, 3).map((v, i) => (
            <div key={v.slug} className="reveal reveal-stagger h-full" style={{ "--d": `${i * 90}ms` } as React.CSSProperties}>
              <FeaturedVehicleCard v={v} large={i === 0} />
            </div>
          ))}
        </div>
        <div className="mt-5 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((v, i) => (
            <div key={v.slug} className="reveal reveal-stagger h-full" style={{ "--d": `${(i % 3) * 90}ms` } as React.CSSProperties}>
              <VehicleCard v={v} />
            </div>
          ))}
        </div>
      </section>

      {/* ————— CATEGORIES (colorful, image-led) ————— */}
      <section className="mt-16 bg-tint/70 py-16">
        <div className="mx-auto max-w-shell px-4 sm:px-6">
          <SectionHeading
            eyebrow="Discover by category"
            title="What kind of electric fits your life?"
            copy="Six visual doors into the catalog — each tile carries live counts from the actual inventory."
          />
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
            {categories.map((c, i) => (
              <Link
                key={c.name}
                href={c.href}
                className={`reveal reveal-stagger group relative overflow-hidden rounded-[1.75rem] shadow-soft transition hover:shadow-lift ${i === 0 ? "col-span-2 min-h-[240px] lg:col-span-1 lg:row-span-2 lg:min-h-full" : "min-h-[190px]"}`}
                style={{ "--d": `${(i % 3) * 80}ms` } as React.CSSProperties}
              >
                <SafeImage
                  src={`https://images.unsplash.com/${c.img}?auto=format&fit=crop&w=900&q=80`}
                  alt={c.name}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${c.tint} via-black/20 to-transparent`} />
                <div className="relative flex h-full flex-col justify-end p-5 sm:p-6">
                  <span className={`w-fit rounded-full px-3 py-1 text-[11px] font-extrabold ${c.chip}`}>{c.count} listed</span>
                  <p className="font-display mt-2 text-xl font-semibold leading-tight text-white sm:text-2xl">{c.name}</p>
                  <span className="mt-1.5 inline-flex items-center gap-1 text-[13px] font-bold text-white/85">
                    Explore <ChevronRight size={15} className="transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ————— SIGNATURE BRAND (midnight contrast moment) ————— */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-skyvivid/20 blur-[110px]" aria-hidden />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-brand/25 blur-[100px]" aria-hidden />
        <div className="mx-auto grid max-w-shell items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="reveal">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-skyvivid">
              <Sparkles size={13} /> Why EasyEVNepal
            </p>
            <h2 className="font-display mt-4 text-balance text-3xl font-semibold leading-[1.04] sm:text-5xl">
              Your next vehicle deserves a better search.
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/70">
              An expensive decision should not feel like guesswork. We line up prices,
              batteries, range claims and charging realities side by side — then a real
              person helps you decide.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                [Compass, "Understand your options", "Categories, budgets and body types in plain language.", "bg-skyvivid text-deep"],
                [Scale, "Compare what matters", "Price, range source, battery, clearance and warranty — aligned.", "bg-palesky text-deep"],
                [PlugZap, "Plan charging & ownership", "Home vs public, connectors, and highway realities.", "bg-white text-brand"],
              ].map(([Icon, t, d, chip]: any) => (
                <li key={t} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur transition hover:bg-white/[0.09]">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${chip}`}>
                    <Icon size={20} />
                  </span>
                  <span>
                    <span className="block font-bold">{t}</span>
                    <span className="block text-[13.5px] text-white/65">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal relative">
            <div className="overflow-hidden rounded-[2rem] border border-white/15 shadow-lift">
              <SafeImage
                src="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=80"
                alt="Electric vehicle on an open road"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-skyvivid px-5 py-4 text-deep shadow-glow sm:left-8 sm:right-auto sm:gap-8">
              <div>
                <p className="tnum text-xl font-extrabold">1 conversation</p>
                <p className="text-[12.5px] font-semibold opacity-70">away from clarity</p>
              </div>
              <Link href="/inquire" className="btn-press rounded-full bg-deep px-5 py-2.5 text-[13px] font-bold text-white">
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ————— COMPARE (bright card, sky-tinted grid) ————— */}
      <section className="mx-auto max-w-shell px-4 pt-16 sm:px-6">
        <div className="reveal overflow-hidden rounded-[2rem] border border-cardline bg-white shadow-soft">
          <div className="grid lg:grid-cols-[1fr_1.4fr]">
            <div className="p-7 sm:p-10">
              <SectionHeading
                eyebrow="Compare before you decide"
                title="Small differences, big ownership impact."
                copy="Line up price, claimed range, battery, charging and clearance — with the test cycle stated every time."
              />
              <Link href="/compare" className="btn-press mt-6 inline-flex items-center gap-2 rounded-full bg-deep px-6 py-3 text-[14px] font-bold text-white shadow-soft hover:bg-brand">
                Open comparison tool <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-3 divide-x divide-cardline border-t border-cardline bg-palesky/50 lg:border-l lg:border-t-0">
              {comparePair.map((v) => (
                <Link key={v.slug} href={`/evs/${v.slug}`} className="group bg-white/60 p-4 transition hover:bg-white sm:p-6">
                  <div className="overflow-hidden rounded-2xl">
                    <SafeImage src={v.image} alt={v.model} className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <p className="mt-3 text-[11px] font-extrabold uppercase tracking-wider text-ocean">{v.brand}</p>
                  <p className="font-display text-[15px] font-semibold leading-tight text-ink group-hover:text-brand sm:text-lg">{v.model}</p>
                  <p className="tnum mt-1 text-[12.5px] font-extrabold text-deep sm:text-[13.5px]">{formatPriceRange(v.priceMinNPR, v.priceMaxNPR)}</p>
                  <p className="mt-1 text-[12px] text-muted">{v.rangeKm} km · {v.batteryKwh} kWh</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ————— BUDGET (light lavender stage) ————— */}
      <section className="mt-16 bg-lavender/60 py-16">
        <div className="mx-auto max-w-shell px-4 sm:px-6">
          <div className="reveal flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Budget & affordability"
              title="Start from what you can spend."
              copy="Honest bands, no savings promises. Pick a ceiling and see what actually fits."
            />
            <span className="grid h-14 w-14 place-items-center rounded-3xl bg-white text-brand shadow-soft">
              <Wallet size={26} />
            </span>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["City picks", "Under Rs. 20 Lakh", "/evs?budget=2000000", "Scooters & compact hatchbacks", "bg-white"],
              ["Family value", "Under Rs. 40 Lakh", "/evs?budget=4000000", "Nexon, Neta V, Tiago", "bg-white"],
              ["Long legs", "Rs. 40–60 Lakh", "/evs?min=4000000&budget=6000000", "Bigger batteries, tourers", "bg-palesky"],
              ["Premium", "Rs. 60 Lakh+", "/evs?min=6000000", "Atto 3, ZS EV, Seal", "bg-deep text-white"],
              ["Talk it through", "Not sure?", "/inquire", "We will narrow it with you", "bg-skyvivid"],
            ].map(([t, p, href, d, bg]: any) => (
              <Link key={t as string} href={href as string} className={`card-lift group rounded-3xl border border-cardline p-5 shadow-soft hover:shadow-lift ${bg as string}`}>
                <p className={`text-[11px] font-extrabold uppercase tracking-widest ${(bg as string).includes("deep") ? "text-skyvivid" : "text-ocean"}`}>{t}</p>
                <p className={`font-display mt-1.5 text-lg font-semibold ${(bg as string).includes("deep") ? "text-white" : "text-ink"}`}>{p}</p>
                <p className={`mt-1 text-[13px] ${(bg as string).includes("deep") ? "text-white/65" : "text-moss"}`}>{d}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ————— CHARGING (practical, tint) ————— */}
      <section className="mx-auto max-w-shell px-4 pt-16 sm:px-6">
        <div className="grid items-stretch gap-5 lg:grid-cols-2">
          <div className="reveal card-lift relative overflow-hidden rounded-[2rem] shadow-soft">
            <SafeImage src="https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?auto=format&fit=crop&w=1400&q=80" alt="EV charging connector" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/92 via-navy/30 to-transparent" />
            <div className="relative flex h-full min-h-[400px] flex-col justify-end p-7 text-white sm:p-8">
              <p className="w-fit rounded-full bg-skyvivid px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-deep">Charging & ownership</p>
              <h2 className="font-display mt-3 max-w-md text-balance text-3xl font-semibold sm:text-4xl">Charge at home. Travel with a plan.</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/charging" className="btn-press rounded-full bg-skyvivid px-5 py-2.5 text-[13px] font-extrabold text-deep">Charging guide</Link>
                <Link href="/charging-stations" className="btn-press rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-[13px] font-bold backdrop-blur hover:bg-white/20">Find stations</Link>
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              [PlugZap, "Home vs public", "Overnight AC for daily needs, DC fast for highways.", "/charging", "bg-palesky text-brand"],
              [MapPin, "Stations directory", "A starter list of valley & highway points — call ahead.", "/charging-stations", "bg-palesky text-deep"],
              [BookOpen, "Road-trip playbook", "Kathmandu–Pokhara buffers, elevation and etiquette.", "/guides/ev-road-trips", "bg-lavender text-purple-800"],
            ].map(([Icon, t, d, href, chip]: any) => (
              <Link key={t as string} href={href as string} className="reveal card-lift group flex items-center gap-4 rounded-3xl border border-cardline bg-white p-5 shadow-soft hover:shadow-lift">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${chip as string}`}><Icon size={22} /></span>
                <span className="flex-1">
                  <span className="block font-bold text-ink group-hover:text-brand">{t}</span>
                  <span className="block text-[13.5px] text-moss">{d}</span>
                </span>
                <ArrowUpRight size={18} className="text-muted transition group-hover:translate-x-0.5 group-hover:text-brand" />
              </Link>
            ))}
            <div className="reveal flex items-center gap-3 rounded-2xl border border-cardline bg-white px-5 py-4 text-[13px] font-medium text-brand shadow-soft">
              <ShieldCheck size={18} className="shrink-0 text-ocean" /> Live charger status is not shown — we never invent availability.
            </div>
          </div>
        </div>
      </section>

      {/* ————— PRODUCTS ————— */}
      <section className="mx-auto max-w-shell px-4 pt-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Beyond the vehicles" title="Chargers, care & everyday add-ons." copy="A small, focused shelf — request availability or a quotation." />
          <Link href="/products" className="btn-press inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-line bg-white px-5 py-2.5 text-[13.5px] font-bold text-ink hover:border-deep hover:text-deep">All products <ArrowRight size={15} /></Link>
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.slice(0, 3).map((p, i) => (
            <Link key={p.slug} href={`/products/${p.slug}`} className="reveal reveal-stagger card-lift group flex gap-4 rounded-3xl border border-cardline bg-white p-4 shadow-soft hover:shadow-lift" style={{ "--d": `${i * 80}ms` } as React.CSSProperties}>
              <div className="overflow-hidden rounded-2xl">
                <SafeImage src={p.image} alt={p.name} className="h-24 w-24 shrink-0 object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <span className="py-1">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-ocean">{p.category}</span>
                <span className="block font-bold leading-snug text-ink group-hover:text-brand">{p.name}</span>
                <span className="tnum mt-1 block text-[13.5px] font-extrabold text-deep">
                  {p.priceNPR ? `Rs. ${p.priceNPR.toLocaleString("en-IN")}` : "Price on request"}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ————— EDITORIAL ————— */}
      <section className="mt-16 bg-palesky/50 py-16">
        <div className="mx-auto max-w-shell px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Guides, news & insights" title="Read before you buy." />
            <div className="flex gap-2">
              <Link href="/guides" className="btn-press rounded-full border-[1.5px] border-line bg-white px-5 py-2.5 text-[13px] font-bold shadow-soft hover:border-deep hover:text-deep">All guides</Link>
              <Link href="/news" className="btn-press rounded-full border-[1.5px] border-line bg-white px-5 py-2.5 text-[13px] font-bold shadow-soft hover:border-deep hover:text-deep">News</Link>
            </div>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <Link href={`/guides/${guides[0].slug}`} className="reveal card-lift group relative overflow-hidden rounded-[2rem] bg-deep text-white shadow-soft hover:shadow-lift">
              <SafeImage src={guides[0].image} alt={guides[0].title} className="aspect-[16/10] w-full object-cover opacity-85 transition duration-700 group-hover:scale-[1.03] lg:aspect-auto lg:h-full lg:min-h-[400px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="w-fit rounded-full bg-skyvivid px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-deep">{guides[0].category} · {guides[0].readMins} min</p>
                <h3 className="font-display mt-3 max-w-xl text-balance text-2xl font-semibold leading-tight sm:text-[2rem]">{guides[0].title}</h3>
              </div>
            </Link>
            <div className="grid gap-4">
              {[...guides.slice(1), news!].map((a, i) => (
                <Link key={a.slug} href={`/${a.kind === "news" ? "news" : "guides"}/${a.slug}`} className="reveal reveal-stagger card-lift group flex gap-4 rounded-3xl border border-cardline bg-white p-4 shadow-soft hover:shadow-lift" style={{ "--d": `${i * 80}ms` } as React.CSSProperties}>
                  <div className="overflow-hidden rounded-2xl">
                    <SafeImage src={a.image} alt={a.title} className="h-20 w-28 shrink-0 object-cover transition duration-500 group-hover:scale-110" />
                  </div>
                  <span className="py-0.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-ocean">{a.category}</span>
                    <span className="clamp-2 block text-[14.5px] font-bold leading-snug text-ink group-hover:text-brand">{a.title}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ————— WHY ————— */}
      <section className="mx-auto max-w-shell px-4 pt-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            [Search, "Easier discovery", "Search by budget, body type and real needs — not jargon.", "bg-palesky text-brand"],
            [BatteryCharging, "Clearer specs", "Every range figure carries its test cycle. No fine-print tricks.", "bg-palesky text-deep"],
            [ShieldCheck, "Human assistance", "Tell us your running and parking — we help narrow honestly.", "bg-lavender text-purple-800"],
          ].map(([Icon, t, d, chip]: any, i) => (
            <div key={t as string} className="reveal reveal-stagger card-lift rounded-[1.75rem] border border-cardline bg-white p-7 shadow-soft hover:shadow-lift" style={{ "--d": `${i * 80}ms` } as React.CSSProperties}>
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${chip as string}`}><Icon size={22} /></span>
              <p className="font-display mt-4 text-xl font-semibold">{t}</p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-moss">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ————— LEAD CTA (bright gradient stage) ————— */}
      <section className="mx-auto max-w-shell px-4 py-16 sm:px-6">
        <div className="reveal grid overflow-hidden rounded-[2rem] border border-cardline bg-gradient-to-br from-palesky via-tint to-palesky shadow-soft lg:grid-cols-2">
          <div className="p-7 sm:p-12">
            <p className="inline-flex items-center gap-2 rounded-full bg-deep px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-skyvivid">
              <Sparkles size={13} /> One conversation
            </p>
            <h2 className="font-display mt-4 text-balance text-3xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-[2.75rem]">
              Your next move starts with one conversation.
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-moss">
              Tell us what you are looking for, and our team can help you explore the
              available options — no pressure, no false promises.
            </p>
            <ul className="mt-6 space-y-2.5 text-[13.5px] font-medium text-ink">
              {["Replies during working hours", "Variant & quotation help", "Charging feasibility check"].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-deep text-[11px] font-black text-skyvivid">✓</span> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/60 p-4 backdrop-blur sm:p-8">
            <LeadForm compact />
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "EasyEVNepal",
            description: "Electric vehicle discovery and buying assistance in Nepal.",
          }),
        }}
      />
    </>
  );
}
