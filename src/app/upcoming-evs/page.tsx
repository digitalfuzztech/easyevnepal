import type { Metadata } from "next";
import Link from "next/link";
import { Bell, CalendarClock } from "lucide-react";
import { UPCOMING } from "@/data/vehicles";
import { SafeImage } from "@/components/SafeImage";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = {
  title: "Upcoming EVs in Nepal",
  description: "Expected electric launches with clear confirmed vs estimated labels. Register for launch alerts.",
};

export default function UpcomingPage() {
  return (
    <div className="mx-auto max-w-shell px-4 py-8 sm:px-6 lg:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Upcoming EVs" }]} />
      <div className="mt-4 max-w-2xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">On the horizon</p>
        <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">What is coming next?</h1>
        <p className="mt-3 text-[15px] text-moss">
          Confirmed announcements are labelled <strong>Confirmed</strong>; everything else is an
          <strong> estimate</strong>. We separate the two — always.
        </p>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {UPCOMING.map((v) => (
          <article key={v.slug} className="overflow-hidden rounded-3xl border border-line bg-white">
            <SafeImage src={v.image} alt={`${v.brand} ${v.model}`} className="aspect-[16/9] w-full object-cover" />
            <div className="p-6">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${v.launchStatus === "Confirmed" ? "bg-accent text-navy" : "bg-lightblue text-brand"}`}>
                <CalendarClock size={12} /> {v.launchStatus}
              </span>
              <p className="mt-3 text-[11px] font-bold uppercase tracking-widest text-moss">{v.brand}</p>
              <h2 className="font-display text-2xl font-semibold">{v.model}</h2>
              <p className="mt-1 text-[14px] text-moss">{v.tagline}</p>
              <dl className="mt-4 space-y-1.5 text-[13.5px]">
                <div className="flex justify-between gap-3"><dt className="text-moss">Expected launch</dt><dd className="font-bold">{v.expectedLaunch}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-moss">Expected price</dt><dd className="font-bold">{v.expectedPrice}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-moss">Est. specs</dt><dd className="font-bold">{v.batteryKwh} kWh · {v.rangeKm} km</dd></div>
              </dl>
              <p className="mt-2 text-[12px] text-moss">Updated {v.priceUpdated} · Source: demonstration data.</p>
              <Link href={`/inquire?vehicle=${v.brand} ${v.model}&type=Upcoming+vehicle+alert`} className="mt-4 flex items-center justify-center gap-2 rounded-full bg-deep py-2.5 text-[13.5px] font-bold text-white hover:bg-brand">
                <Bell size={15} /> Alert me at launch
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
