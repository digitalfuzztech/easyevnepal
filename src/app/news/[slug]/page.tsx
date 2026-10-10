import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, getArticle } from "@/data/articles";
import { SafeImage } from "@/components/SafeImage";
import { Breadcrumbs } from "@/components/ui";

export function generateStaticParams() {
  return ARTICLES.filter((a) => a.kind === "news").map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const a = getArticle(params.slug);
  if (!a) return { title: "News not found" };
  return { title: a.title, description: a.excerpt };
}

export default function NewsDetail({ params }: { params: { slug: string } }) {
  const a = getArticle(params.slug);
  if (!a || a.kind !== "news") notFound();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "News", href: "/news" }, { label: a.title }]} />
      <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] text-brand">{a.category} · {a.date}</p>
      <h1 className="font-display mt-3 text-4xl font-semibold leading-tight sm:text-5xl">{a.title}</h1>
      <p className="mt-4 text-[17px] text-moss">{a.excerpt}</p>
      <SafeImage src={a.image} alt={a.title} eager className="mt-6 aspect-[16/8] w-full rounded-3xl object-cover" />
      <div className="mt-6 space-y-5 text-[16px] leading-[1.75]">
        {a.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <Link href="/news" className="mt-8 inline-block rounded-full border border-line bg-white px-6 py-2.5 text-[13px] font-bold">← All news</Link>
    </div>
  );
}
