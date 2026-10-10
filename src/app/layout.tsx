import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, Noto_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { AssistantWidget } from "@/components/assistant/AssistantWidget";
import { Preloader } from "@/components/Preloader";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const noto = Noto_Sans({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto",
  display: "swap",
});

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EasyEVNepal — Find your kind of electric",
    template: "%s · EasyEVNepal",
  },
  description:
    "Discover electric vehicles in Nepal: compare prices, range, battery and charging. Research SUVs, hatchbacks, scooters and more, then request honest buying help.",
  metadataBase: new URL("https://easyevnepal.example.com"),
  openGraph: {
    type: "website",
    siteName: "EasyEVNepal",
    title: "EasyEVNepal — Find your kind of electric",
    description:
      "Explore electric vehicles, compare the details that matter, and discover a smarter way to move across Nepal.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${noto.variable} ${display.variable}`}>
      <body>
        <Preloader />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-deep focus:px-5 focus:py-2.5 focus:text-sm focus:font-bold focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="min-h-[60vh]">
          {children}
        </main>
        <SiteFooter />
        <AssistantWidget />
        <Reveal />
      </body>
    </html>
  );
}
