import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, AlertTriangle, CalendarClock, Gauge, BatteryCharging, Mountain } from "lucide-react";
import { getVehicle, similarVehicles, VEHICLES } from "@/data/vehicles";
import { getArticle } from "@/data/articles";
import { formatPriceRange } from "@/lib/format";
import { SafeImage } from "@/components/SafeImage";
import { Breadcrumbs, Eyebrow } from "@/components/ui";
import { VehicleCard } from "@/components/VehicleCard";
import { LeadForm } from "@/components/LeadForm";

export function generateStaticParams() {
  return VEHICLES.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const v = getVehicle(params.slug);
  if (!v) return { title: "Vehicle not found" };
  return {
    title: `${v.brand} ${v.model} — price, range & specs in Nepal`,
    description: `${v.brand} ${v.model}: ${formatPriceRange(v.priceMinNPR, v.priceMaxNPR)}, ${v.rangeKm ?? "—"} km claimed range, ${v.batteryKwh ?? "—"} kWh battery. Honest specs and inquiry.`,
  };
}

export default function VehicleDetail({ params }: { params: { slug: string } }) {
  const v = getVehicle(params.slug);
  if (!v) notFound();
  const similar = similarVehicles(v);
  const relatedGuides = ["ev-buying-guide-nepal-2026", "home-charging-explained", "kathmandu-pokhara-ev-road-trips"]
    .map((s) => getArticle(s))
    .filter(Boolean);

  const groups: { title: string; rows: [string, string][] }[] = [
    {
      title: "Performance & range",
      rows: [
        ["Battery", v.batteryKwh ? `${v.batteryKwh} kWh` : "Not published"],
        ["Claimed range", v.rangeKm ? `${v.rangeKm} km (${v.rangeSource ?? "unspecified"})` : "Not published"],
        ["Motor", v.motorKw ? `${v.motorKw} kW` : "Not published"],
      ],
    },
    {
      title: "Charging",
      rows: [
        ["DC fast charging", v.chargeDC ?? "Confirm with dealer"],
        ["AC home charging", v.chargeAC ?? "Confirm with dealer"],
      ],
    },
    {
      title: "Body & warranty",
      rows: [
        ["Body type", v.bodyType],
        ["Ground clearance", v.groundClearanceMm ? `${v.groundClearanceMm} mm` : "Not published"],
        ["Seats", v.seats ? String(v.seats) : "—"],
        ["Warranty", v.warranty ?? "Confirm written terms"],
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-shell px-4 py-8 sm:px-6 lg:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "EVs", href: "/evs" },
          { label: `${v.brand} ${v.model}` },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="relative overflow-hidden rounded-[2rem] shadow-soft">
            <SafeImage src={v.image} alt={`${v.brand} ${v.model}`} eager className="aspect-[16/9] w-full object-cover" />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-deep/90 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-skyvivid backdrop-blur">
                {v.category}
              </span>
              <span className="rounded-full bg-white/90 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-deep backdrop-blur">
                {v.bodyType}
              </span>
            </div>
          </div>
          {v.gallery.length > 1 && (
            <div className="rail-scroll mt-3 flex gap-3 overflow-x-auto pb-1">
              {v.gallery.map((g, i) => (
                <SafeImage key={i} src={g} alt={`${v.model} view ${i + 1}`} className="h-20 w-32 shrink-0 rounded-2xl border border-cardline object-cover" />
              ))}
            </div>
          )}

          <div className="mt-7">
            <Eyebrow>{v.brand}</Eyebrow>
            <h1 className="font-display mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{v.model}</h1>
            <p className="mt-2.5 max-w-xl text-[15.5px] leading-relaxed text-moss">{v.tagline}</p>
          </div>

          <div className="mt-6 grid gap-3 rounded-[1.75rem] border border-cardline bg-white p-4 shadow-soft sm:grid-cols-3 sm:p-5">
            {[
              [Gauge, "Claimed range", v.rangeKm ? `${v.rangeKm} km` : "—", v.rangeSource ?? "", "bg-tint text-brand"],
              [BatteryCharging, "Battery", v.batteryKwh ? `${v.batteryKwh} kWh` : "—", v.motorKw ? `${v.motorKw} kW motor` : "", "bg-palesky text-deep"],
              [Mountain, "Clearance", v.groundClearanceMm ? `${v.groundClearanceMm} mm` : "—", v.seats ? `${v.seats} seats` : "", "bg-palesky text-brand"],
            ].map(([Icon, k, val, sub, chip]: any) => (
              <div key={k as string} className="rounded-2xl border border-cardline bg-ivory p-4">
                <p className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-widest ${chip as string}`}>
                  <Icon size={12} /> {k}
                </p>
                <p className="tnum font-display mt-2 text-[1.65rem] font-semibold leading-none">{val as string}</p>
                <p className="mt-1 text-[12px] font-medium text-muted">{sub as string}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 flex items-start gap-2 rounded-2xl bg-amber-50 p-3.5 text-[12.5px] leading-relaxed text-amber-800">
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            Manufacturer-claimed range is not a guaranteed real-world distance. Hills, speed, load and AC reduce it.
          </p>

          <h2 className="font-display mt-10 text-2xl font-semibold tracking-tight">Full specifications</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {groups.map((g) => (
              <div key={g.title} className="overflow-hidden rounded-3xl border border-cardline bg-white shadow-soft">
                <p className="bg-tint px-5 py-3 text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-brand">
                  {g.title}
                </p>
                <dl className="divide-y divide-cardline">
                  {g.rows.map(([k, val]) => (
                    <div key={k} className="px-5 py-3">
                      <dt className="text-[11.5px] font-bold uppercase tracking-wider text-muted">{k}</dt>
                      <dd className="mt-0.5 text-[14px] font-semibold text-ink">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-ocean/30 bg-palesky/60 p-6">
              <h3 className="font-bold text-brand">Strengths to note</h3>
              <ul className="mt-3 space-y-2 text-[14px] text-ink">
                {v.pros.map((p) => (
                  <li key={p} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-ocean" />{p}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-cardline bg-white p-6 shadow-soft">
              <h3 className="font-bold text-ink">Consider before buying</h3>
              <ul className="mt-3 space-y-2 text-[14px] text-moss">
                {v.considerations.map((c) => (
                  <li key={c} className="flex gap-2"><AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-500" />{c}</li>
                ))}
              </ul>
              <p className="mt-3 text-[12px] text-muted">Editorial notes from available information — verify with a test drive.</p>
            </div>
          </div>

          {v.faqs.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-2xl font-semibold tracking-tight">Common questions</h2>
              <div className="mt-4 space-y-3">
                {v.faqs.map((f) => (
                  <details key={f.q} className="group rounded-2xl border border-cardline bg-white px-5 py-4 shadow-soft open:ring-2 open:ring-palesky">
                    <summary className="cursor-pointer font-bold text-[14.5px] text-ink hover:text-brand">{f.q}</summary>
                    <p className="mt-2 text-[14px] leading-relaxed text-moss">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <h2 className="font-display text-2xl font-semibold tracking-tight">Related guides</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {relatedGuides.map((a) => (
                <Link key={a!.slug} href={`/guides/${a!.slug}`} className="card-lift rounded-2xl border border-cardline bg-white p-4 text-[13.5px] font-bold shadow-soft hover:text-brand">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-ocean">{a!.category}</span>
                  <span className="mt-1 block leading-snug">{a!.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-[1.75rem] bg-deep text-white shadow-lift">
            <div className="h-1.5 bg-gradient-to-r from-skyvivid via-ocean to-palesky" />
            <div className="p-6 sm:p-7">
              {v.priceStatus === "unavailable" || (v.priceMinNPR == null && v.priceMaxNPR == null) ? (
                <>
                  <p className="text-[12px] font-extrabold uppercase tracking-widest text-skyvivid">Price on request</p>
                  <p className="font-display mt-2 text-3xl font-semibold">Ask for a quotation</p>
                </>
              ) : (
                <>
                  <p className="flex items-center gap-1.5 text-[12px] font-extrabold uppercase tracking-widest text-skyvivid">
                    <CalendarClock size={14} /> Indicative Nepal price
                  </p>
                  <p className="tnum font-display mt-2 text-[1.9rem] font-semibold leading-tight">
                    {formatPriceRange(v.priceMinNPR, v.priceMaxNPR)}
                  </p>
                </>
              )}
              <p className="mt-2 text-[12.5px] text-white/60">Updated {v.priceUpdated} · Demonstration data — confirm written dealer quote.</p>
              <div className="mt-5 grid gap-2">
                <Link href={`/inquire?vehicle=${v.slug}&type=Price+quotation`} className="btn-press rounded-full bg-skyvivid py-3 text-center text-[14px] font-extrabold text-deep hover:bg-white">
                  Request best price
                </Link>
                <Link href={`/inquire?vehicle=${v.slug}&type=Test-drive+request`} className="btn-press rounded-full border border-white/25 py-3 text-center text-[14px] font-bold hover:bg-white/10">
                  Book a test drive
                </Link>
                <Link href={`/compare?add=${v.slug}`} className="inline-flex items-center justify-center gap-1.5 py-2 text-[13px] font-bold text-skyvivid hover:underline">
                  Compare this EV <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <LeadForm defaultVehicle={`${v.brand} ${v.model}`} defaultType="Specific vehicle inquiry" compact />
          </div>
        </aside>
      </div>

      <div className="mt-14">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Similar vehicles</h2>
          <Link href="/evs" className="rounded-full text-[13.5px] font-bold text-brand hover:underline">View all →</Link>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((s) => (
            <VehicleCard key={s.slug} v={s} />
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${v.brand} ${v.model}`,
            category: v.bodyType,
            description: v.tagline,
          }),
        }}
      />
    </div>
  );
}
