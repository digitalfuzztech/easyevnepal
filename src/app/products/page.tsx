import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { SafeImage } from "@/components/SafeImage";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = {
  title: "EV chargers & accessories",
  description: "Home chargers, portable chargers, adapters and EV accessories with availability and quotation requests.",
};

export default function ProductsPage() {
  const cats = Array.from(new Set(PRODUCTS.map((p) => p.category)));
  return (
    <div className="mx-auto max-w-shell px-4 py-8 sm:px-6 lg:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products" }]} />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Beyond vehicles</p>
          <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Chargers & add-ons.</h1>
          <p className="mt-3 text-[15px] text-moss">No checkout, no fake stock — request availability or a quotation and we respond.</p>
        </div>
      </div>
      {cats.map((c) => (
        <div key={c} className="mt-8">
          <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] text-moss">{c}</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.filter((p) => p.category === c).map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`} className="group overflow-hidden rounded-3xl border border-line bg-white hover:shadow-card">
                <SafeImage src={p.image} alt={p.name} className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                <div className="flex items-start justify-between gap-3 p-5">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-moss">{p.brand}</p>
                    <p className="font-display text-lg font-semibold leading-snug">{p.name}</p>
                    <p className="tnum mt-1 text-[14px] font-extrabold text-deep">
                      {p.priceNPR ? `Rs. ${p.priceNPR.toLocaleString("en-IN")}` : "Price on request"}
                    </p>
                  </div>
                  <ArrowUpRight size={18} className="mt-1 shrink-0 text-moss group-hover:text-brand" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
