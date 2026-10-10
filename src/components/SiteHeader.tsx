"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X, Phone, Sparkles } from "lucide-react";
import Image from "next/image";
import logoEasy from "@/assets/images/General/logo-icon.png";

const NAV = [
  {
    label: "Discover EVs",
    href: "/evs",
    children: [
      { label: "All electric vehicles", href: "/evs", desc: "Browse the full catalog" },
      { label: "Electric SUVs", href: "/evs?category=SUV", desc: "High clearance, family space" },
      { label: "Hatchbacks & sedans", href: "/evs?category=Hatchback", desc: "City-friendly picks" },
      { label: "Scooters & bikes", href: "/evs?category=Scooter", desc: "Two-wheeler freedom" },
      { label: "Used EVs", href: "/used-evs", desc: "Pre-owned, honestly labelled" },
      { label: "Upcoming models", href: "/upcoming-evs", desc: "What is on the horizon" },
    ],
  },
  { label: "Compare", href: "/compare" },
  {
    label: "EV Guides",
    href: "/guides",
    children: [
      { label: "Buying guides", href: "/guides", desc: "Research before you buy" },
      { label: "Charging explained", href: "/charging", desc: "Home vs public" },
      { label: "Road-trip planning", href: "/guides/ev-road-trips", desc: "Kathmandu–Pokhara & more" },
      { label: "News & market notes", href: "/news", desc: "What changed lately" },
    ],
  },
  { label: "Charging", href: "/charging" },
  { label: "Products", href: "/products" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDrop(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <div className="bg-navy text-white/90">
        <div className="mx-auto flex max-w-shell items-center justify-between gap-4 px-4 py-1.5 text-[12px] font-medium sm:px-6">
          <p className="truncate">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-skyvivid align-middle" />
            Festive-season variant lists updated — always confirm the written dealer quotation.
          </p>
          <Link href="/guides/ev-buying-guide-nepal-2026" className="hidden shrink-0 underline-offset-4 hover:text-skyvivid hover:underline sm:block">
            Read the 2026 buying guide
          </Link>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 bg-white/90 backdrop-blur-xl transition-shadow ${
          scrolled ? "shadow-soft border-b border-cardline" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-[68px] max-w-shell items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-2.5" aria-label="EasyEVNepal home">
            <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl transition-transform group-hover:scale-105">
              <Image src={logoEasy} alt="EasyEVNepal logo" width={48} height={48} className="h-12 w-12 object-contain" priority />
            </span>
            <span className="leading-none">
              <span className="block text-[17px] font-extrabold tracking-tight text-deep">
                EasyEV<span className="text-ocean">Nepal</span>
              </span>
              <span className="block text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted">
                Move electric
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDrop(item.label)}
                  onMouseLeave={() => setOpenDrop(null)}
                >
                  <Link
                    href={item.href}
                    aria-expanded={openDrop === item.label}
                    aria-haspopup="true"
                    className={`flex items-center gap-1 rounded-full px-4 py-2.5 text-[14px] font-semibold transition ${
                      active ? "bg-palesky text-deep" : "text-ink hover:bg-tint hover:text-deep"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${openDrop === item.label ? "rotate-180" : ""}`}
                    />
                  </Link>
                  {openDrop === item.label && (
                    <div className="absolute left-0 top-full w-72 pt-2">
                      <div className="animate-pop overflow-hidden rounded-2xl border border-cardline bg-white p-2 shadow-lift">
                        {item.children.map((c) => (
                          <Link
                            key={c.label}
                            href={c.href}
                            className="block rounded-xl px-3.5 py-2.5 transition hover:bg-tint"
                          >
                            <span className="block text-[14px] font-bold text-ink">{c.label}</span>
                            <span className="block text-[12px] text-muted">{c.desc}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-4 py-2.5 text-[14px] font-semibold transition ${
                    active ? "bg-palesky text-deep" : "text-ink hover:bg-tint hover:text-deep"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="tel:+977015900000"
              className="btn-press hidden items-center gap-2 rounded-full border-[1.5px] border-line bg-white px-4 py-2.5 text-[13px] font-bold text-deep hover:border-deep md:flex"
            >
              <Phone size={15} /> 01-5900000
            </a>
            <Link
              href="/inquire"
              className="btn-press hidden items-center gap-1.5 rounded-full bg-deep px-5 py-2.5 text-[14px] font-bold text-white shadow-soft transition hover:bg-brand sm:inline-flex"
            >
              <Sparkles size={15} className="text-skyvivid" /> Find my EV
            </Link>
            <button
              className="btn-press grid h-11 w-11 place-items-center rounded-full border-[1.5px] border-line bg-white lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu size={19} />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="animate-fade absolute inset-0 bg-navy/60 backdrop-blur-[2px]" onClick={() => setMobileOpen(false)} />
          <div className="animate-slide-in-right absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-white shadow-lift">
            <div className="flex items-center justify-between border-b border-cardline px-5 py-4">
              <span className="font-extrabold text-deep">EasyEVNepal</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="btn-press grid h-11 w-11 place-items-center rounded-full border-[1.5px] border-line bg-white"
                aria-label="Close menu"
              >
                <X size={19} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted">Explore</p>
              <div className="mt-2 divide-y divide-cardline">
                {[
                  { label: "Discover all EVs", href: "/evs", desc: "Search & filter" },
                  { label: "Compare vehicles", href: "/compare", desc: "Side-by-side specs" },
                  { label: "Used EVs", href: "/used-evs", desc: "Pre-owned picks" },
                  { label: "Upcoming models", href: "/upcoming-evs", desc: "Launch alerts" },
                  { label: "Charging guide", href: "/charging", desc: "Home & public" },
                  { label: "Charging stations", href: "/charging-stations", desc: "Where to top up" },
                  { label: "Guides", href: "/guides", desc: "Buying advice" },
                  { label: "News", href: "/news", desc: "Market notes" },
                  { label: "Accessories & products", href: "/products", desc: "Chargers & more" },
                  { label: "About", href: "/about", desc: "Who we are" },
                ].map((l) => (
                  <Link
                    key={l.href + l.label}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3"
                  >
                    <span className="block text-[15px] font-bold text-ink">{l.label}</span>
                    <span className="block text-[12px] text-muted">{l.desc}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="border-t border-cardline bg-tint/60 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <Link
                href="/inquire"
                onClick={() => setMobileOpen(false)}
                className="btn-press block rounded-full bg-deep py-3.5 text-center text-[15px] font-bold text-white"
              >
                Help me find my EV
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
