import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/data/articles";
import { SafeImage } from "@/components/SafeImage";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = {
  title: "EV news & market notes — Nepal",
  description: "Launches, variant updates and market notes for Nepal's electric vehicle scene.",
};

export default function NewsPage() {
  const news = ARTICLES.filter((a) => a.kind === "news");
  return (
    <div className="mx-auto max-w-shell px-4 py-8 sm:px-6 lg:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "News" }]} />
      <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Market notes.</h1>
      <p className="mt-3 max-w-2xl text-[15px] text-moss">Short, dated updates. Estimates are labelled as estimates — dates are real publication dates.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {news.map((a) => (
          <Link key={a.slug} href={`/news/${a.slug}`} className="group overflow-hidden rounded-3xl border border-line bg-white hover:shadow-card">
            <SafeImage src={a.image} alt={a.title} className="aspect-[16/8] w-full object-cover" />
            <div className="p-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-moss">{a.category} · {a.date} · {a.readMins} min</p>
              <h2 className="font-display mt-2 text-2xl font-semibold leading-tight">{a.title}</h2>
              <p className="mt-2 text-[14px] text-moss">{a.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
