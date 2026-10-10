import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Calendar, Gauge, ShieldCheck, AlertTriangle } from "lucide-react";
import { USED } from "@/data/vehicles";
import { formatFullNPR } from "@/lib/format";
import { SafeImage } from "@/components/SafeImage";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = {
  title: "Used EVs in Nepal",
  description: "Browse pre-owned electric vehicles with honest verification labels. Seller-provided vs dealer-verified, battery-health notes and inquiry.",
};

export default function UsedEvsPage() {
  return (
    <div className="mx-auto max-w-shell px-4 py-8 sm:px-6 lg:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Used EVs" }]} />
      <div className="mt-4 max-w-2xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Pre-owned</p>
        <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Used EVs, without the guesswork.</h1>
        <p className="mt-3 text-[15px] text-moss">
          Every listing states who provided the information. We never claim inspection or
          certification unless it actually happened.
        </p>
      </div>
      <div className="mt-6 flex items-start gap-2 rounded-2xl bg-amber-50 p-4 text-[13.5px] text-amber-900">
        <AlertTriangle size={17} className="mt-0.5 shrink-0" />
        Demonstration listings for design purposes. Always inspect the vehicle and its battery-health report before paying an advance.
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {USED.map((u) => (
          <article key={u.id} className="overflow-hidden rounded-3xl border border-line bg-white">
            <div className="relative">
              <SafeImage src={u.image} alt={u.title} className="aspect-[16/10] w-full object-cover" />
              <span className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold ${u.verification === "Dealer-verified" ? "bg-accent text-navy" : "bg-white/90 text-ink"}`}>
                <ShieldCheck size={12} /> {u.verification}
              </span>
            </div>
            <div className="p-5">
              <p className="tnum text-xl font-extrabold text-deep">{formatFullNPR(u.priceNPR)}</p>
              <h2 className="font-display mt-1 text-lg font-semibold leading-snug">{u.title}</h2>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[12.5px] font-medium text-moss">
                <span className="inline-flex items-center gap-1"><Calendar size={13} /> {u.year}</span>
                <span className="inline-flex items-center gap-1"><Gauge size={13} /> {u.mileageKm.toLocaleString()} km</span>
                <span className="inline-flex items-center gap-1"><MapPin size={13} /> {u.location}</span>
              </div>
              <p className="mt-2 text-[12.5px] text-moss">Condition: {u.condition} · {u.batteryHealth}</p>
              <Link href={`/inquire?vehicle=${encodeURIComponent(u.title)}&type=Used+vehicle+inquiry`} className="mt-4 block rounded-full bg-deep py-2.5 text-center text-[13.5px] font-bold text-white hover:bg-brand">
                Inquire about this vehicle
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
