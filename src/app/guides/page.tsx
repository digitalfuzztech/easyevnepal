import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/data/articles";
import { SafeImage } from "@/components/SafeImage";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = {
  title: "EV guides — buying, charging & ownership",
  description: "Practical electric-vehicle guides for Nepal: buying, home charging, road trips, warranties and ownership.",
};

export default function GuidesPage() {
  const guides = ARTICLES.filter((a) => a.kind === "guide");
  const [first, ...rest] = guides;
  return (
    <div className="mx-auto max-w-shell px-4 py-8 sm:px-6 lg:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides" }]} />
      <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Guides that respect your money.</h1>
      <p className="mt-3 max-w-2xl text-[15px] text-moss">No sponsored rankings. Just the questions to ask, the numbers that matter, and Nepali road realities.</p>
      <Link href={`/guides/${first.slug}`} className="group mt-8 grid overflow-hidden rounded-3xl bg-deep text-white lg:grid-cols-2">
        <SafeImage src={first.image} alt={first.title} className="aspect-[16/10] h-full w-full object-cover lg:aspect-auto" />
        <div className="p-7 sm:p-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-skyvivid">{first.category} · {first.readMins} min read</p>
          <h2 className="font-display mt-3 text-3xl font-semibold leading-tight">{first.title}</h2>
          <p className="mt-3 text-[14.5px] text-ivory/70">{first.excerpt}</p>
          <span className="mt-5 inline-block rounded-full bg-skyvivid px-5 py-2.5 text-[13px] font-extrabold text-deep">Read guide</span>
        </div>
      </Link>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((a) => (
          <Link key={a.slug} href={`/guides/${a.slug}`} className="group overflow-hidden rounded-3xl border border-line bg-white hover:shadow-card">
            <SafeImage src={a.image} alt={a.title} className="aspect-[16/9] w-full object-cover" />
            <div className="p-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-moss">{a.category} · {a.date}</p>
              <h3 className="font-display mt-1.5 text-lg font-semibold leading-snug">{a.title}</h3>
              <p className="clamp-2 mt-1.5 text-[13.5px] text-moss">{a.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
