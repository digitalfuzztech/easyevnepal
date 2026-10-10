import type { Metadata } from "next";
import { EvExplorer } from "@/components/EvExplorer";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = {
  title: "Explore electric vehicles in Nepal",
  description: "Search and filter electric cars, SUVs, scooters and more by brand, category and budget. Indicative Nepal prices with honest range context.",
};

export default function EvsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; budget?: string; min?: string };
}) {
  return (
    <div className="mx-auto max-w-shell px-4 py-8 sm:px-6 lg:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Electric vehicles" }]} />
      <div className="mt-4 max-w-2xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Discovery</p>
        <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          Every electric, in one search.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-moss">
          Filter by what matters — budget, body type, brand. Prices are indicative and
          carry last-updated dates; range figures always state their source.
        </p>
      </div>
      <div className="mt-8">
        <EvExplorer
          initialQ={searchParams.q ?? ""}
          initialCategory={searchParams.category ?? ""}
          initialBudget={searchParams.budget ?? ""}
          initialMin={searchParams.min ?? ""}
        />
      </div>
    </div>
  );
}
