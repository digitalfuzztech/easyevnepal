import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, getArticle } from "@/data/articles";
import { getVehicle } from "@/data/vehicles";
import { SafeImage } from "@/components/SafeImage";
import { Breadcrumbs } from "@/components/ui";
import { VehicleCard } from "@/components/VehicleCard";
import { LeadForm } from "@/components/LeadForm";

export function generateStaticParams() {
  return ARTICLES.filter((a) => a.kind === "guide").map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const a = getArticle(params.slug);
  if (!a) return { title: "Guide not found" };
  return { title: a.title, description: a.excerpt };
}

export default function GuideDetail({ params }: { params: { slug: string } }) {
  const a = getArticle(params.slug);
  if (!a || a.kind !== "guide") notFound();
  const vehicles = (a.relatedVehicleSlugs ?? []).map((s) => getVehicle(s)).filter(Boolean);
  const related = ARTICLES.filter((x) => x.slug !== a.slug && x.kind === "guide").slice(0, 2);

  return (
    <div className="mx-auto max-w-shell px-4 py-8 sm:px-6 lg:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: a.title }]} />
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <article>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">{a.category} · {a.date} · {a.readMins} min read</p>
          <h1 className="font-display mt-3 text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl">{a.title}</h1>
          <p className="mt-4 text-[17px] leading-relaxed text-moss">{a.excerpt}</p>
          <SafeImage src={a.image} alt={a.title} eager className="mt-6 aspect-[16/8] w-full rounded-3xl object-cover" />
          <div className="mt-6 space-y-5 text-[16px] leading-[1.75] text-ink/90">
            {a.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {vehicles.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-2xl font-semibold">Vehicles mentioned</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {vehicles.map((v) => (
                  <VehicleCard key={v!.slug} v={v!} />
                ))}
              </div>
            </div>
          )}
          {related.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-xl font-semibold">Keep reading</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {related.map((r) => (
                  <Link key={r.slug} href={`/guides/${r.slug}`} className="rounded-2xl border border-line bg-white p-4 text-[14px] font-bold hover:border-brand">{r.title}</Link>
                ))}
              </div>
            </div>
          )}
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: a.title, datePublished: a.date }) }} />
        </article>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <LeadForm compact defaultType="General EV advice" />
          <div className="mt-4 rounded-3xl bg-deep p-6 text-ivory">
            <p className="font-display text-lg font-semibold">Still confused?</p>
            <p className="mt-1 text-[13.5px] text-ivory/70">One form, one human reply. No obligation.</p>
            <Link href="/inquire" className="mt-3 block rounded-full bg-skyvivid py-2.5 text-center text-[13px] font-extrabold text-deep">Ask for help</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
