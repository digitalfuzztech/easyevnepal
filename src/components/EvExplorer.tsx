"use client";
import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { VEHICLES, BRANDS, CATEGORIES, type Vehicle } from "@/data/vehicles";
import { VehicleCard } from "@/components/VehicleCard";
import { EmptyState } from "@/components/ui";

export function EvExplorer({
  initialQ = "",
  initialCategory = "",
  initialBudget = "",
  initialMin = "",
}: {
  initialQ?: string;
  initialCategory?: string;
  initialBudget?: string;
  initialMin?: string;
}) {
  const [q, setQ] = useState(initialQ);
  const [cats, setCats] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [brands, setBrands] = useState<string[]>([]);
  const [max, setMax] = useState(initialBudget);
  const [min, setMin] = useState(initialMin);
  const [sort, setSort] = useState("featured");
  const [drawer, setDrawer] = useState(false);

  const filtered = useMemo(() => {
    let list: Vehicle[] = [...VEHICLES];
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter((v) => `${v.brand} ${v.model}`.toLowerCase().includes(needle));
    }
    if (cats.length) list = list.filter((v) => cats.includes(v.category));
    if (brands.length) list = list.filter((v) => brands.includes(v.brand));
    if (max) list = list.filter((v) => v.priceMinNPR != null && v.priceMinNPR <= Number(max));
    if (min) list = list.filter((v) => v.priceMaxNPR != null && v.priceMaxNPR >= Number(min));
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => (a.priceMinNPR ?? Infinity) - (b.priceMinNPR ?? Infinity));
        break;
      case "price-desc":
        list.sort((a, b) => (b.priceMaxNPR ?? -1) - (a.priceMaxNPR ?? -1));
        break;
      case "range":
        list.sort((a, b) => (b.rangeKm ?? 0) - (a.rangeKm ?? 0));
        break;
      case "battery":
        list.sort((a, b) => (b.batteryKwh ?? 0) - (a.batteryKwh ?? 0));
        break;
      default:
        list.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
    }
    return list;
  }, [q, cats, brands, max, min, sort]);

  const activeCount =
    cats.length + brands.length + (max ? 1 : 0) + (min ? 1 : 0) + (q.trim() ? 1 : 0);

  function clearAll() {
    setQ(""); setCats([]); setBrands([]); setMax(""); setMin(""); setSort("featured");
  }

  const filters = (
    <div className="space-y-6">
      <div>
        <p className="text-[12px] font-bold uppercase tracking-widest text-moss">Search</p>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Brand or model"
          className="mt-2 h-12 w-full rounded-xl border-[1.5px] border-strongline bg-white px-4 text-[14px] font-medium text-ink outline-none transition placeholder:text-muted hover:border-brand/50 focus:border-brand focus:ring-4 focus:ring-brand/15"
          aria-label="Search brand or model"
        />
      </div>
      <div>
        <p className="text-[12px] font-bold uppercase tracking-widest text-moss">Category</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCats((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]))}
              aria-pressed={cats.includes(c)}
              className={`btn-press rounded-full border-[1.5px] px-4 py-1.5 text-[13px] font-bold transition ${cats.includes(c) ? "border-deep bg-deep text-white shadow-soft" : "border-strongline bg-white text-ink hover:border-ocean hover:bg-palesky"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[12px] font-bold uppercase tracking-widest text-moss">Brand</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {BRANDS.map((b) => (
            <button
              key={b}
              onClick={() => setBrands((s) => (s.includes(b) ? s.filter((x) => x !== b) : [...s, b]))}
              aria-pressed={brands.includes(b)}
              className={`btn-press rounded-full border-[1.5px] px-4 py-1.5 text-[13px] font-bold transition ${brands.includes(b) ? "border-brand bg-brand text-white shadow-soft" : "border-strongline bg-white text-ink hover:border-brand hover:bg-palesky"}`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-[12px] font-bold uppercase tracking-widest text-moss">Max budget</span>
          <select value={max} onChange={(e) => setMax(e.target.value)} aria-label="Max budget" className="select-caret mt-2 h-12 w-full rounded-xl border-[1.5px] border-strongline bg-white px-3 text-[13.5px] font-bold text-ink outline-none transition hover:border-brand/50 focus:border-brand focus:ring-4 focus:ring-brand/15">
            <option value="">Any</option>
            <option value="2000000">Rs. 20 Lakh</option>
            <option value="3000000">Rs. 30 Lakh</option>
            <option value="4000000">Rs. 40 Lakh</option>
            <option value="6000000">Rs. 60 Lakh</option>
          </select>
        </label>
        <label className="block">
          <span className="text-[12px] font-bold uppercase tracking-widest text-moss">Min price</span>
          <select value={min} onChange={(e) => setMin(e.target.value)} aria-label="Min price" className="select-caret mt-2 h-12 w-full rounded-xl border-[1.5px] border-strongline bg-white px-3 text-[13.5px] font-bold text-ink outline-none transition hover:border-brand/50 focus:border-brand focus:ring-4 focus:ring-brand/15">
            <option value="">Any</option>
            <option value="4000000">Rs. 40 Lakh</option>
            <option value="6000000">Rs. 60 Lakh</option>
          </select>
        </label>
      </div>
      {activeCount > 0 && (
        <button onClick={clearAll} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-brand hover:underline">
          <X size={14} /> Clear all filters ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="hidden self-start rounded-3xl border border-cardline bg-white p-6 shadow-soft lg:sticky lg:top-24 lg:block">{filters}</aside>
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[14px] text-moss" role="status">
            <strong className="tnum text-ink">{filtered.length}</strong> vehicle{filtered.length === 1 ? "" : "s"} found
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setDrawer(true)} className="btn-press inline-flex items-center gap-2 rounded-full border-[1.5px] border-strongline bg-white px-4 py-2.5 text-[13px] font-bold shadow-soft lg:hidden">
              <SlidersHorizontal size={15} /> Filters{activeCount > 0 ? ` (${activeCount})` : ""}
            </button>
            <label className="flex items-center gap-2 text-[13px] font-bold">
              Sort
              <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort vehicles" className="select-caret h-11 rounded-full border-[1.5px] border-strongline bg-white pl-4 text-[13px] font-bold text-ink shadow-soft outline-none transition hover:border-brand/50 focus:border-brand">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="range">Claimed range</option>
                <option value="battery">Battery size</option>
              </select>
            </label>
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="No EVs match those filters."
              copy="Try widening the budget or clearing a category. Or tell us what you need and we will help narrow it."
              action={
                <>
                  <button onClick={clearAll} className="rounded-full bg-deep px-6 py-2.5 text-[13px] font-bold text-white">Clear filters</button>
                  <a href="/inquire" className="rounded-full border border-line bg-white px-6 py-2.5 text-[13px] font-bold">Ask for help</a>
                </>
              }
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((v) => (
              <VehicleCard key={v.slug} v={v} />
            ))}
          </div>
        )}
      </div>
      {drawer && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-[2px]" onClick={() => setDrawer(false)} />
          <div className="animate-pop absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-[1.75rem] bg-white p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-lift">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-xl font-semibold">Filters</p>
              <button onClick={() => setDrawer(false)} className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white" aria-label="Close filters">
                <X size={18} />
              </button>
            </div>
            {filters}
            <button onClick={() => setDrawer(false)} className="mt-6 w-full rounded-full bg-deep py-3.5 text-[14px] font-bold text-white">
              Show {filtered.length} result{filtered.length === 1 ? "" : "s"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
