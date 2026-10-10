import Link from "next/link";
import Image from "next/image";
import logoEasy from "@/assets/images/General/logo-icon.png";

const COLS = [
  {
    title: "Discover",
    links: [
      ["All EVs", "/evs"],
      ["Compare", "/compare"],
      ["Used EVs", "/used-evs"],
      ["Upcoming", "/upcoming-evs"],
      ["Products", "/products"],
    ],
  },
  {
    title: "Learn",
    links: [
      ["Buying guides", "/guides"],
      ["Charging", "/charging"],
      ["Stations", "/charging-stations"],
      ["Road trips", "/guides/ev-road-trips"],
      ["News", "/news"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Contact / Inquire", "/inquire"],
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-shell px-4 py-14 sm:px-6 lg:py-16">
        <div className="grid items-start gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <div className="flex items-center gap-4">
              <span className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-white p-2.5 shadow-lift">
                <Image src={logoEasy} alt="EasyEVNepal logo" width={64} height={64} className="h-full w-full object-contain" />
              </span>
              <span className="leading-tight">
                <span className="block text-[26px] font-extrabold tracking-tight">
                  EasyEV<span className="text-skyvivid">Nepal</span>
                </span>
                <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.22em] text-white/60">
                  Move electric
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-[14.5px] leading-relaxed text-white/75">
              The easier, smarter way to discover electric vehicles and modern mobility
              products in Nepal — compare the details that matter, then talk to our team.
            </p>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-[13px] leading-relaxed text-white/70">
              Prices shown are indicative Nepal-market figures for research. Always confirm
              the written dealer quotation. Range figures are claims or lab-cycle values —
              never guaranteed real-world distances.
            </div>
          </div>
          <nav className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3" aria-label="Footer">
            {COLS.map((c) => (
              <div key={c.title}>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-skyvivid">
                  {c.title}
                </p>
                <ul className="mt-4 space-y-1">
                  {c.links.map(([label, href]) => (
                    <li key={href + label}>
                      <Link
                        href={href}
                        className="inline-block rounded py-1.5 text-[14.5px] font-medium text-white/80 transition hover:translate-x-0.5 hover:text-skyvivid"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-[13px] text-white/60 sm:flex-row sm:items-center">
          <p>© 2026 EasyEVNepal. All rights reserved. Demonstration inventory for design purposes.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition hover:text-skyvivid">Privacy</Link>
            <Link href="/terms" className="transition hover:text-skyvivid">Terms</Link>
            <Link href="/inquire" className="transition hover:text-skyvivid">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
