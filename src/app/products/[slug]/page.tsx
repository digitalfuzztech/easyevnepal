import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, PRODUCTS } from "@/data/products";
import { SafeImage } from "@/components/SafeImage";
import { Breadcrumbs } from "@/components/ui";
import { LeadForm } from "@/components/LeadForm";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = getProduct(params.slug);
  if (!p) return { title: "Product not found" };
  return { title: `${p.name} — price & compatibility`, description: p.blurb };
}

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const p = getProduct(params.slug);
  if (!p) notFound();
  const related = PRODUCTS.filter((x) => x.slug !== p.slug && x.category === p.category).slice(0, 2);
  return (
    <div className="mx-auto max-w-shell px-4 py-8 sm:px-6 lg:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: p.name }]} />
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-3xl">
            <SafeImage src={p.image} alt={p.name} eager className="aspect-[4/3] w-full object-cover" />
          </div>
          <h2 className="font-display mt-6 text-xl font-semibold">Specifications</h2>
          <dl className="mt-3 overflow-hidden rounded-2xl border border-line bg-white">
            {p.specs.map((s, i) => (
              <div key={s.label} className={`grid grid-cols-[160px_1fr] gap-3 px-5 py-3 text-[14px] ${i % 2 ? "bg-white" : "bg-ivory/60"}`}>
                <dt className="font-bold text-moss">{s.label}</dt>
                <dd className="font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 rounded-2xl bg-lightblue/70 p-4 text-[13.5px] text-brand">{p.compatibility}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">{p.category} · {p.brand}</p>
          <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight">{p.name}</h1>
          <p className="tnum mt-3 text-2xl font-extrabold text-deep">
            {p.priceNPR ? `Rs. ${p.priceNPR.toLocaleString("en-IN")}` : "Price on request"}
          </p>
          <p className="mt-2 text-[15px] text-moss">{p.blurb}</p>
          <div className="mt-5"><LeadForm compact defaultVehicle={p.name} defaultType="Charger / accessory inquiry" /></div>
          {related.length > 0 && (
            <div className="mt-6">
              <p className="font-bold">Related products</p>
              <div className="mt-2 grid gap-2">
                {related.map((r) => (
                  <Link key={r.slug} href={`/products/${r.slug}`} className="rounded-2xl border border-line bg-white p-3 text-[14px] font-bold hover:border-brand">{r.name}</Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
