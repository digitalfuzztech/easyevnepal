"use client";
import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, X, ArrowRight } from "lucide-react";
import { VEHICLES, getVehicle } from "@/data/vehicles";
import { formatPriceRange } from "@/lib/format";
import { SafeImage } from "@/components/SafeImage";

const ROWS: { label: string; get: (slug: string) => string }[] = [
  { label: "Price (indicative)", get: (s) => { const v = getVehicle(s)!; return v.priceMinNPR == null && v.priceMaxNPR == null ? "Price on request" : formatPriceRange(v.priceMinNPR, v.priceMaxNPR); } },
  { label: "Claimed range", get: (s) => { const v = getVehicle(s)!; return v.rangeKm ? `${v.rangeKm} km (${v.rangeSource})` : "—"; } },
  { label: "Battery", get: (s) => { const v = getVehicle(s)!; return v.batteryKwh ? `${v.batteryKwh} kWh` : "—"; } },
  { label: "Motor", get: (s) => { const v = getVehicle(s)!; return v.motorKw ? `${v.motorKw} kW` : "—"; } },
  { label: "DC charging", get: (s) => getVehicle(s)!.chargeDC ?? "—" },
  { label: "AC charging", get: (s) => getVehicle(s)!.chargeAC ?? "—" },
  { label: "Ground clearance", get: (s) => { const v = getVehicle(s)!; return v.groundClearanceMm ? `${v.groundClearanceMm} mm` : "—"; } },
  { label: "Warranty", get: (s) => getVehicle(s)!.warranty ?? "—" },
];

function differ(values: string[]): boolean {
  return new Set(values).size > 1;
}

function CompareInner() {
  const params = useSearchParams();
  const initial = useMemo(() => {
    const add = params.get("add");
    const list = params.get("vs")?.split(",").filter(Boolean) ?? [];
    const base = ["tata-nexon-ev", "byd-atto-3"];
    if (add && getVehicle(add) && !base.includes(add)) base[1] = add;
    if (list.length >= 2) return list.filter((s) => getVehicle(s)).slice(0, 4);
    return base;
  }, [params]);

  const [selected, setSelected] = useState<string[]>(initial);
  const [picker, setPicker] = useState(false);

  function add(slug: string) {
    setSelected((s) => (s.includes(slug) || s.length >= 4 ? s : [...s, slug]));
    setPicker(false);
  }
  function remove(slug: string) {
    setSelected((s) => (s.length <= 2 ? s : s.filter((x) => x !== slug)));
  }

  const options = VEHICLES.filter((v) => !selected.includes(v.slug));

  return (
    <div className="mx-auto max-w-shell px-4 py-8 sm:px-6 lg:py-12">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Comparison</p>
      <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Compare before you decide.</h1>
      <p className="mt-3 max-w-2xl text-[15px] text-moss">
        Differences are subtly highlighted. “—” means the figure is not published — never a zero.
        Select 2–4 vehicles.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {selected.map((s) => {
          const v = getVehicle(s)!;
          return (
            <span key={s} className="inline-flex items-center gap-2 rounded-full bg-deep py-1.5 pl-4 pr-2 text-[13px] font-bold text-white">
              {v.brand} {v.model}
              <button onClick={() => remove(s)} aria-label={`Remove ${v.model}`} className="grid h-6 w-6 place-items-center rounded-full bg-white/15 hover:bg-white/30">
                <X size={13} />
              </button>
            </span>
          );
        })}
        {selected.length < 4 && (
          <button onClick={() => setPicker(true)} className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-brand/40 px-4 py-1.5 text-[13px] font-bold text-brand">
            <Plus size={14} /> Add vehicle
          </button>
        )}
      </div>

      {picker && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4" role="dialog" aria-modal="true" aria-label="Add vehicle">
          <div className="absolute inset-0 bg-navy/60" onClick={() => setPicker(false)} />
          <div className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-ivory p-5">
            <p className="font-display text-xl font-semibold">Add a vehicle</p>
            <div className="mt-3 space-y-2">
              {options.map((v) => (
                <button key={v.slug} onClick={() => add(v.slug)} className="flex w-full items-center gap-3 rounded-2xl border border-line bg-white p-3 text-left hover:border-brand">
                  <SafeImage src={v.image} alt={v.model} className="h-12 w-16 rounded-lg object-cover" />
                  <span>
                    <span className="block text-[12px] font-bold uppercase tracking-wider text-moss">{v.brand}</span>
                    <span className="block font-bold">{v.model}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-[2rem] border border-cardline bg-white shadow-soft">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr>
              <th className="w-40 p-4 text-[12px] uppercase tracking-widest text-moss">Specification</th>
              {selected.map((s) => {
                const v = getVehicle(s)!;
                return (
                  <th key={s} className="min-w-[180px] p-4 align-top">
                    <Link href={`/evs/${s}`} className="block">
                      <SafeImage src={v.image} alt={v.model} className="aspect-[16/9] w-full rounded-2xl object-cover" />
                      <span className="mt-2 block text-[11px] font-bold uppercase tracking-wider text-moss">{v.brand}</span>
                      <span className="font-display block text-lg font-semibold text-ink hover:text-brand">{v.model}</span>
                    </Link>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => {
              const vals = selected.map(row.get);
              const diff = differ(vals);
              return (
                <tr key={row.label} className={i % 2 ? "bg-white" : "bg-tint/60"}>
                  <th scope="row" className="p-4 text-[13px] font-bold text-moss">{row.label}</th>
                  {vals.map((val, j) => (
                    <td key={j} className={`p-4 text-[13.5px] font-semibold ${diff && val !== "—" ? "bg-palesky text-deep" : "text-ink"}`}>
                      {val}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={`/inquire?vehicle=${selected.map((s) => getVehicle(s)!.model).join(", ")}&type=Specific+vehicle+inquiry`} className="inline-flex items-center gap-2 rounded-full bg-deep px-6 py-3 text-[14px] font-bold text-white hover:bg-brand">
          Inquire about shortlist <ArrowRight size={15} />
        </Link>
        <Link
          href={`/compare?vs=${selected.join(",")}`}
          className="rounded-full border border-line bg-white px-6 py-3 text-[14px] font-bold hover:border-ink"
        >
          Copy / share this comparison (URL)
        </Link>
      </div>
      <p className="mt-3 text-[12.5px] text-moss">The URL encodes your selection — bookmark or share it and the table restores on load.</p>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-shell p-10 text-moss">Loading comparison…</div>}>
      <CompareInner />
    </Suspense>
  );
}
