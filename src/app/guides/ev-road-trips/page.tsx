import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SafeImage } from "@/components/SafeImage";
import { Breadcrumbs } from "@/components/ui";
import { LeadForm } from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Kathmandu to Pokhara by EV — road-trip guide",
  description: "A realistic EV road-trip plan: charging stops, buffers, elevation effects and backup plans for the Prithvi Highway.",
};

export default function RoadTripPage() {
  return (
    <div className="mx-auto max-w-shell px-4 py-8 sm:px-6 lg:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: "Kathmandu–Pokhara by EV" }]} />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <article>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Road trips · 7 min read</p>
          <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Kathmandu to Pokhara by EV.</h1>
          <p className="mt-3 text-[16px] leading-relaxed text-moss">
            Roughly 200 km of climbs, descents, trucks and surprises. For 40+ kWh EVs this is a
            comfortable one-stop trip; smaller batteries need a definite midpoint plan — not hope.
          </p>
          <SafeImage src="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80" alt="Highway through green hills" className="mt-6 aspect-[16/8] w-full rounded-3xl object-cover" />
          <div className="prose-easy mt-6 space-y-4 text-[15px] leading-relaxed text-ink/90">
            <h2 className="font-display text-2xl font-semibold">The plan</h2>
            <p><strong>1. Leave full.</strong> Overnight to 100% at home — this is the one trip where it makes sense.</p>
            <p><strong>2. One planned top-up.</strong> Aim for a 20–30 minute DC stop around the Muglin / mid-hill belt. Call ahead that morning.</p>
            <p><strong>3. Keep 20% buffer.</strong> Detours, jams and a closed charger should never strand you.</p>
            <h2 className="font-display text-2xl font-semibold">Why elevation matters more than distance</h2>
            <p>Climbs drain disproportionately; descents recover some via regeneration. Smooth, steady driving beats fast-and-charge. Use eco mode and moderate AC on climbs.</p>
            <h2 className="font-display text-2xl font-semibold">Backup kit</h2>
            <p>Portable 3.3 kW charger, extension rated for continuous load, tyre inflator, and the phone numbers of two chargers — not one.</p>
          </div>
          <div className="mt-6 flex gap-2">
            <Link href="/charging-stations" className="rounded-full bg-deep px-5 py-2.5 text-[13px] font-bold text-white">Station list</Link>
            <Link href="/evs" className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-5 py-2.5 text-[13px] font-bold">Long-range EVs <ArrowRight size={14} /></Link>
          </div>
        </article>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-deep p-6 text-ivory">
            <p className="font-display text-xl font-semibold">Planning this trip?</p>
            <p className="mt-1 text-[13.5px] text-ivory/70">Tell us your vehicle and date — we will sanity-check the charging plan.</p>
            <Link href="/inquire" className="mt-4 block rounded-full bg-skyvivid py-2.5 text-center text-[13.5px] font-extrabold text-deep">Get trip advice</Link>
          </div>
          <div className="mt-4"><LeadForm compact defaultType="General EV advice" defaultVehicle="Kathmandu–Pokhara trip" /></div>
        </aside>
      </div>
    </div>
  );
}
