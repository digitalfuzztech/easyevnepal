import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "About EasyEVNepal", description: "Why EasyEVNepal exists: easier EV discovery and honest buying help for Nepal." };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">About</p>
      <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">An easier way to go electric in Nepal.</h1>
      <div className="mt-6 space-y-5 text-[16px] leading-[1.75] text-ink/90">
        <p>EasyEVNepal is a vehicle-discovery and lead-generation platform. We bring models, indicative prices, batteries, range claims and charging realities into one calm place — then help you talk to the right seller.</p>
        <p>We do not invent prices, range figures, reviews or stock. Demonstration data on this build is labelled as such; production records carry sources and update dates.</p>
        <p>Our business is qualified inquiries: test drives, quotations, alerts and buying consultations. If we cannot help, we say so.</p>
      </div>
      <Link href="/inquire" className="mt-8 inline-block rounded-full bg-deep px-7 py-3 text-[14px] font-bold text-white">Talk to the team</Link>
    </div>
  );
}
