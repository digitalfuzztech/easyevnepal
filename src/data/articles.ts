const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export interface Article {
  slug: string;
  kind: "guide" | "news";
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readMins: number;
  image: string;
  body: string[];
  relatedVehicleSlugs?: string[];
}

export const ARTICLES: Article[] = [
  {
    slug: "ev-buying-guide-nepal-2026",
    kind: "guide",
    title: "The 2026 Nepal EV buying guide: range, charging & real costs",
    excerpt: "How to choose between battery sizes, what WLTP really means on hills, and the questions to ask every dealer.",
    category: "Buying guides",
    date: "2026-09-12",
    readMins: 9,
    image: img("photo-1593941707882-a5bba14938c7"),
    body: [
      "Start with your daily distance. Most Kathmandu commutes are under 40 km a day, so even a 24 kWh hatchback covers a week of city driving on one or two charges.",
      "Treat claimed range as a ceiling, not a promise. Lab cycles like NEDC and CLTC are optimistic; WLTP is closer to mixed driving. On sustained climbs and highway speeds, expect 20–35% less.",
      "Check three things at the dealership: the connector type your car uses, the home-charger installation process, and the written battery warranty terms including degradation coverage.",
      "Plan charging before delivery. A grounded parking spot, a certified electrician, and clarity on your building's sanctioned load will save weeks of friction.",
    ],
    relatedVehicleSlugs: ["tata-nexon-ev", "byd-atto-3", "tata-tiago-ev"],
  },
  {
    slug: "home-charging-explained",
    kind: "guide",
    title: "Home charging in Nepal, explained simply",
    excerpt: "Sockets, sanctioned loads, earthing, and what a 7 kW installation actually involves.",
    category: "Charging",
    date: "2026-08-28",
    readMins: 6,
    image: img("photo-1617704548623-340376564e68"),
    body: [
      "A portable 3.3 kW charger works on a grounded 16A socket but takes 8–12 hours for a full charge on larger batteries.",
      "A wall-mounted 7 kW charger roughly halves that time but needs a dedicated circuit and proper earthing.",
      "Ask your electrician to verify earthing, MCB rating, and cable sizing. Never run a charger on a loose multi-plug.",
    ],
    relatedVehicleSlugs: ["mg-zs-ev", "byd-dolphin"],
  },
  {
    slug: "kathmandu-pokhara-ev-road-trip",
    kind: "guide",
    title: "Kathmandu to Pokhara by EV: a realistic charging plan",
    excerpt: "Where to top up, how much buffer to keep, and why elevation matters more than distance.",
    category: "Road trips",
    date: "2026-09-02",
    readMins: 7,
    image: img("photo-1502877338535-766e1452684a"),
    body: [
      "The ~200 km highway is comfortably doable for 40+ kWh EVs with one short top-up; smaller batteries should plan a definite stop around the midpoint.",
      "Climbs consume disproportionately more energy, but descents recover some through regeneration. Drive smoothly and keep 20% buffer.",
      "Call ahead to confirm public chargers are working — do not rely on a single pin. Carry your portable charger as backup.",
    ],
    relatedVehicleSlugs: ["tata-nexon-ev", "neta-v", "mahindra-xuv400-ev"],
  },
  {
    slug: "battery-warranty-questions",
    kind: "guide",
    title: "Battery warranties: 7 questions worth asking",
    excerpt: "Years and kilometres are only half the story — degradation terms matter just as much.",
    category: "Ownership",
    date: "2026-07-19",
    readMins: 5,
    image: img("photo-1617788138017-80ad40651399"),
    body: [
      "Ask what capacity loss triggers a claim, who tests battery health, and whether fast-charging habits affect coverage.",
      "Get the warranty in writing with the variant name and start date. Verbal assurances do not count.",
      "For used EVs, ask for a recent battery-health report and have an independent inspection before paying an advance.",
    ],
    relatedVehicleSlugs: ["byd-atto-3", "mg-zs-ev"],
  },
  {
    slug: "new-launches-roundup-september",
    kind: "news",
    title: "September market notes: what changed in Nepal's EV line-up",
    excerpt: "Variant reshuffles, indicative price moves, and which models to watch this Dashain season.",
    category: "Market news",
    date: "2026-09-15",
    readMins: 4,
    image: img("photo-1503376780353-7e6692767b70"),
    body: [
      "Dealers refreshed several variant lists ahead of the festive season. Prices below remain indicative — always confirm the written quotation.",
      "Upcoming coupe-SUV electrics continue to be teased for 2027. Treat launch dates as estimates until officially confirmed.",
      "EasyEVNepal updates indicative prices as dealers publish them. Last-updated dates appear on every vehicle page.",
    ],
  },
  {
    slug: "public-charging-etiquette",
    kind: "news",
    title: "A short etiquette guide for public charging queues",
    excerpt: "Move when done, share the plug, and other small habits that keep stations flowing.",
    category: "Charging",
    date: "2026-08-05",
    readMins: 3,
    image: img("photo-1610647752706-3bb12232b3ab"),
    body: [
      "Charge to 80% at busy stations and free the plug — the last 20% is slow and inconsiderate when others wait.",
      "Leave your contact visible so the next driver can reach you.",
      "Report faulty stations to the operator so listings stay accurate.",
    ],
  },
];

export function getArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}
