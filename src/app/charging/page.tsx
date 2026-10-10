import type { Metadata } from "next";
import Link from "next/link";
import { PlugZap, Home, MapPin, BatteryCharging, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "EV charging in Nepal — home, public & connectors",
  description: "Home vs public charging, connector compatibility, charging speeds and ownership realities for Nepali EV drivers.",
};

const CARDS = [
  { icon: Home, title: "Charge at home", copy: "A grounded 16A socket runs a 3.3 kW portable charger overnight. A dedicated 7 kW wallbox roughly halves the time but needs its own circuit, MCB and verified earthing. Ask a certified electrician before delivery day.", points: ["Verify sanctioned load with your building", "Never use loose multi-plugs", "Budget for wiring + wallbox installation"] },
  { icon: MapPin, title: "Public charging", copy: "Highway DC chargers (40–60 kW) typically add meaningful range in 30–50 minutes to 80%. City AC points suit parked top-ups. Always call ahead — single-charger sites fail, queues form, and live status is not guaranteed.", points: ["Keep 20% buffer on highways", "Carry your portable charger as backup", "Charge to 80% when others wait"] },
  { icon: PlugZap, title: "Connectors & compatibility", copy: "Nepal hosts a mix of GB/T, Type 2 and CCS2. Your car's inlet decides everything — confirm it in writing before buying cables or adapters. Never adapt DC fast charging unless manufacturer-approved.", points: ["GB/T (common on Chinese EVs)", "Type 2 AC (common European)", "CCS2 DC (newer fast-charge sites)"] },
  { icon: BatteryCharging, title: "Speeds, simply", copy: "3.3 kW portable: overnight. 7 kW wallbox: half a working day for big batteries. 40–60 kW DC: a lunch stop to 80%. The last 20% is always slow — that is chemistry, not a faulty charger.", points: ["AC for daily, DC for distance", "Cold + hills slow everything", "Plan stops, not just distance"] },
];

export default function ChargingPage() {
  return (
    <div className="mx-auto max-w-shell px-4 py-8 sm:px-6 lg:py-12">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Charging & ownership</p>
      <h1 className="font-display mt-2 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
        Charging, without the confusion.
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] text-moss">
        What home installation involves, how public stations behave on Nepali highways, and which
        connector questions to ask before you buy.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {CARDS.map((c) => (
          <article key={c.title} className="rounded-3xl border border-line bg-white p-7">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-deep text-skyvivid"><c.icon size={22} /></span>
            <h2 className="font-display mt-4 text-2xl font-semibold">{c.title}</h2>
            <p className="mt-2 text-[14.5px] leading-relaxed text-moss">{c.copy}</p>
            <ul className="mt-4 space-y-1.5 text-[13.5px] font-medium text-ink">
              {c.points.map((p) => (
                <li key={p} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{p}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-3xl border border-cardline bg-white p-7 shadow-soft">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-palesky text-brand"><ShieldCheck size={22} /></span>
        <p className="flex-1 text-[14px] font-medium text-ink">We do not show live charger availability — any site claiming it without an operator feed is guessing.</p>
        <div className="flex gap-2">
          <Link href="/charging-stations" className="btn-press rounded-full bg-deep px-5 py-2.5 text-[13px] font-bold text-white">Station list</Link>
          <Link href="/guides/ev-road-trips" className="btn-press inline-flex items-center gap-1 rounded-full border-[1.5px] border-line px-5 py-2.5 text-[13px] font-bold hover:border-deep hover:text-deep">Road-trip guide <ArrowRight size={14} /></Link>
        </div>
      </div>
    </div>
  );
}
