import Link from "next/link";
import { ArrowRight, ArrowUpRight, BatteryCharging, Gauge, GitCompareArrows } from "lucide-react";
import type { Vehicle } from "@/data/vehicles";
import { formatPriceRange } from "@/lib/format";
import { SafeImage } from "./SafeImage";

const CATEGORY_TINT: Record<string, string> = {
  SUV: "bg-navy/90 text-white",
  Hatchback: "bg-brand/90 text-white",
  Sedan: "bg-ink/85 text-white",
  Scooter: "bg-skyvivid/95 text-navy",
  Motorcycle: "bg-skyvivid/95 text-navy",
  Commercial: "bg-amber-500/95 text-white",
  MPV: "bg-purple-600/90 text-white",
};

function PriceLine({ v, light = false }: { v: Vehicle; light?: boolean }) {
  if (v.priceStatus === "unavailable" || (v.priceMinNPR == null && v.priceMaxNPR == null)) {
    return (
      <p className={`text-[14.5px] font-bold ${light ? "text-skyvivid" : "text-deep"}`}>
        Price on request{" "}
        <span className={`font-medium ${light ? "text-white/60" : "text-muted"}`}>— ask us</span>
      </p>
    );
  }
  return (
    <p className={`tnum text-[17px] font-extrabold tracking-tight ${light ? "text-white" : "text-ink"}`}>
      {formatPriceRange(v.priceMinNPR, v.priceMaxNPR)}
    </p>
  );
}

/**
 * Standard card — uniform grid rhythm:
 * image region (fixed aspect) → identity (reserved title height) →
 * specs → flexible spacer → price → bottom-pinned actions.
 */
export function VehicleCard({ v }: { v: Vehicle }) {
  return (
    <article className="card-lift group flex h-full flex-col overflow-hidden rounded-3xl border border-cardline bg-white hover:border-line hover:shadow-lift">
      <Link
        href={`/evs/${v.slug}`}
        className="relative block aspect-[16/10] shrink-0 overflow-hidden"
        aria-label={`${v.brand} ${v.model}`}
        tabIndex={-1}
      >
        <SafeImage
          src={v.image}
          alt={`${v.brand} ${v.model}`}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
        />
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition group-hover:opacity-100" />
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur ${
            CATEGORY_TINT[v.category] ?? "bg-navy/90 text-white"
          }`}
        >
          {v.category}
        </span>
        {v.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-accent px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-navy shadow-soft">
            Popular
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand">{v.brand}</p>
        <Link
          href={`/evs/${v.slug}`}
          className="font-display mt-1 line-clamp-2 min-h-[3.25rem] text-[21px] font-semibold leading-[1.15] text-ink transition-colors hover:text-brand"
        >
          {v.model}
        </Link>
        <div className="mt-1.5 min-h-[1.6rem]">
          <PriceLine v={v} />
        </div>
        <div className="mt-2.5 flex min-h-[2.25rem] flex-wrap content-start gap-2">
          {v.rangeKm && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-tint px-3 py-1.5 text-[12px] font-bold text-deep">
              <Gauge size={13} /> {v.rangeKm} km
              <span className="font-semibold text-muted">{v.rangeSource ? `· ${v.rangeSource}` : ""}</span>
            </span>
          )}
          {v.batteryKwh && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-palesky px-3 py-1.5 text-[12px] font-bold text-deep">
              <BatteryCharging size={13} /> {v.batteryKwh} kWh
            </span>
          )}
        </div>
        <div className="flex-1" aria-hidden />
        <div className="mt-4 flex gap-2 border-t border-cardline pt-4">
          <Link
            href={`/evs/${v.slug}`}
            className="btn-press flex-1 rounded-full border-[1.5px] border-line py-2.5 text-center text-[13px] font-bold text-ink hover:border-brand hover:text-brand"
          >
            Details
          </Link>
          <Link
            href={`/compare?add=${v.slug}`}
            aria-label={`Compare ${v.model}`}
            className="btn-press grid w-11 shrink-0 place-items-center rounded-full border-[1.5px] border-line text-moss hover:border-brand hover:text-brand"
          >
            <GitCompareArrows size={16} />
          </Link>
          <Link
            href={`/inquire?vehicle=${v.slug}`}
            className="btn-press flex flex-1 items-center justify-center gap-1 rounded-full bg-brand py-2.5 text-[13px] font-bold text-white hover:bg-deep"
          >
            Inquire <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Featured card — immersive navy editorial panel, bottom-anchored content. */
export function FeaturedVehicleCard({ v, large = false }: { v: Vehicle; large?: boolean }) {
  return (
    <article
      className={`card-lift group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-navy text-white hover:shadow-lift ${
        large ? "lg:col-span-2" : ""
      }`}
    >
      <SafeImage
        src={v.image}
        alt={`${v.brand} ${v.model}`}
        className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-deep/55 to-deep/5" />
      <div className="absolute right-5 top-5 flex gap-2">
        <span className="rounded-full bg-skyvivid px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-navy">
          Featured
        </span>
      </div>
      <div
        className={`relative flex flex-1 flex-col justify-end p-6 sm:p-8 ${
          large ? "min-h-[440px]" : "min-h-[360px]"
        }`}
      >
        <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-skyvivid">{v.brand}</p>
        <h3
          className={`font-display mt-2 line-clamp-2 font-semibold leading-[1.02] tracking-tight ${
            large ? "min-h-[3.4rem] text-4xl sm:text-[3.4rem] sm:min-h-[6.6rem]" : "min-h-[3.9rem] text-3xl"
          }`}
        >
          {v.model}
        </h3>
        <p className="clamp-2 mt-2.5 max-w-md text-[14px] leading-relaxed text-white/75">{v.tagline}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] font-bold">
          <span className="tnum rounded-full bg-white px-3.5 py-1.5 text-navy">
            {formatPriceRange(v.priceMinNPR, v.priceMaxNPR)}
          </span>
          {v.rangeKm && (
            <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-white backdrop-blur">
              {v.rangeKm} km claimed
            </span>
          )}
          {v.batteryKwh && (
            <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-white backdrop-blur">
              {v.batteryKwh} kWh
            </span>
          )}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href={`/evs/${v.slug}`}
            className="btn-press inline-flex items-center gap-2 rounded-full bg-skyvivid px-6 py-3 text-[13.5px] font-extrabold text-navy hover:bg-white"
          >
            Explore {v.model} <ArrowRight size={15} />
          </Link>
          <Link
            href={`/inquire?vehicle=${v.slug}`}
            className="btn-press rounded-full border border-white/35 px-6 py-3 text-[13.5px] font-bold text-white backdrop-blur hover:bg-white/10"
          >
            Request price
          </Link>
        </div>
      </div>
    </article>
  );
}
