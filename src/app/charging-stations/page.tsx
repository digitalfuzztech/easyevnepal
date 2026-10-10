import type { Metadata } from "next";
import { MapPin, PlugZap, Clock, PhoneCall } from "lucide-react";
import { STATIONS } from "@/data/stations";
import { Breadcrumbs, Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "EV charging stations in Nepal",
  description: "A starter directory of charging points across Nepal. No live status — call ahead before relying on any pin.",
};

export default function StationsPage() {
  return (
    <div className="mx-auto max-w-shell px-4 py-8 sm:px-6 lg:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Charging", href: "/charging" }, { label: "Stations" }]} />
      <div className="mt-4 max-w-2xl">
        <Eyebrow>Directory</Eyebrow>
        <h1 className="font-display mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Where to charge.</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-moss">
          A starter list — not a live map. Pins are illustrative; availability changes.{" "}
          <strong className="text-ink">Always call ahead</strong> before routing a trip around one charger.
        </p>
      </div>
      <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-lightblue bg-palesky p-4 text-[13.5px] font-medium text-deep">
        <PhoneCall size={17} className="mt-0.5 shrink-0" />
        No live availability is shown for any station. If a trip depends on one charger, confirm it by phone that morning and keep a backup.
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STATIONS.map((s) => (
          <article key={s.id} className="card-lift rounded-[1.75rem] border border-cardline bg-white p-6 shadow-soft hover:shadow-lift">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-palesky px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand">
              <MapPin size={12} /> {s.city}
            </p>
            <h2 className="font-display mt-3 text-xl font-semibold leading-snug">{s.name}</h2>
            <p className="text-[13px] text-muted">{s.area}</p>
            <div className="mt-4 space-y-1.5 text-[13px] font-medium">
              <p className="flex items-center gap-2"><PlugZap size={14} className="shrink-0 text-ocean" /> {s.connectors.join(" · ")}</p>
              <p className="flex items-center gap-2"><Clock size={14} className="shrink-0 text-brand" /> {s.hours} · {s.power}</p>
            </div>
            <p className="mt-3 rounded-xl bg-tint/80 p-2.5 text-[12px] font-medium text-moss">{s.statusNote}</p>
          </article>
        ))}
        <div className="flex flex-col justify-center rounded-[1.75rem] bg-deep p-6 text-white shadow-soft">
          <p className="font-display text-xl font-semibold">Know a station we missed?</p>
          <p className="mt-1 text-[13.5px] text-white/70">Send the location, connector types and hours — we will verify and list it.</p>
          <a href="/inquire" className="btn-press mt-4 rounded-full bg-skyvivid py-2.5 text-center text-[13px] font-extrabold text-deep">Suggest a station</a>
        </div>
      </div>
    </div>
  );
}
