const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export interface Product {
  slug: string;
  name: string;
  brand: string;
  category: string;
  priceNPR?: number | null;
  image: string;
  blurb: string;
  specs: { label: string; value: string }[];
  compatibility: string;
}

export const PRODUCTS: Product[] = [
  {
    slug: "home-ac-charger-7kw",
    name: "Home AC Charger — 7 kW",
    brand: "EasyEV Essentials",
    category: "Home charging",
    priceNPR: 85000,
    image: img("photo-1593941707882-a5bba14938c7"),
    blurb: "Wall-mounted home charger for overnight charging of most EVs in Nepal.",
    specs: [
      { label: "Power", value: "7 kW, 32A single-phase" },
      { label: "Connector", value: "Type 2 / GB/T (confirm vehicle)" },
      { label: "Protection", value: "IP54, overload + leakage" },
      { label: "Install", value: "Certified electrician required" },
    ],
    compatibility: "Compatible with most passenger EVs. Confirm connector with your vehicle before ordering.",
  },
  {
    slug: "portable-charger-3kw",
    name: "Portable EV Charger — 3.3 kW",
    brand: "EasyEV Essentials",
    category: "Portable charging",
    priceNPR: 42000,
    image: img("photo-1617704548623-340376564e68"),
    blurb: "Carry-anywhere emergency charger that plugs into a grounded 16A socket.",
    specs: [
      { label: "Power", value: "3.3 kW adjustable" },
      { label: "Cable", value: "5 m" },
      { label: "Display", value: "Current / temp / fault" },
    ],
    compatibility: "Universal with correct adapter. Check earthing at older buildings.",
  },
  {
    slug: "type2-gbt-adapter",
    name: "Type 2 ↔ GB/T Adapter",
    brand: "ChargeLink",
    category: "Cables & adapters",
    priceNPR: 18500,
    image: img("photo-1610647752706-3bb12232b3ab"),
    blurb: "Adapter for public stations with a different connector than your car.",
    specs: [
      { label: "Rating", value: "32A AC" },
      { label: "Use", value: "AC charging only" },
    ],
    compatibility: "AC only — never adapt DC fast charging unless manufacturer-approved.",
  },
  {
    slug: "all-weather-floor-mats",
    name: "All-Weather Floor Mats (EV)",
    brand: "Nepal Auto Care",
    category: "Accessories",
    priceNPR: 9500,
    image: img("photo-1503376780353-7e6692767b70"),
    blurb: "Deep-tray mats for monsoon mud and dust on valley roads.",
    specs: [
      { label: "Material", value: "TPE, odourless" },
      { label: "Fit", value: "Universal SUV trim-to-fit" },
    ],
    compatibility: "Trim to fit most compact and mid-size SUVs.",
  },
  {
    slug: "tire-inflator-12v",
    name: "12V Tyre Inflator with Auto Cut-off",
    brand: "Nepal Auto Care",
    category: "Accessories",
    priceNPR: 6800,
    image: img("photo-1449965408869-eaa3f722e40d"),
    blurb: "Essential for highway trips where puncture shops are sparse.",
    specs: [
      { label: "Power", value: "12V DC, 120W" },
      { label: "Max", value: "150 PSI, auto stop" },
    ],
    compatibility: "Runs off 12V socket. EVs keep 12V topped via DC-DC.",
  },
  {
    slug: "dashcam-dual-channel",
    name: "Dual-Channel Dashcam",
    brand: "SafeDrive",
    category: "Accessories",
    priceNPR: 16500,
    image: img("photo-1493238792000-8113da705763"),
    blurb: "Front + rear recording for insurance clarity on busy roads.",
    specs: [
      { label: "Video", value: "2K front + 1080p rear" },
      { label: "Power", value: "Hardwire kit optional (parking mode)" },
    ],
    compatibility: "Professional hardwiring recommended for EVs.",
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}
