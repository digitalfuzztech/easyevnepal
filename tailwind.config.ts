import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pure-blue brand identity
        navy: "#102A43",
        deep: "#0756A6",
        brand: "#1687E8",
        ocean: "#0284C7",
        skyvivid: "#38BDF8",
        palesky: "#EAF6FF",
        lightblue: "#D9EEFF",
        tint: "#F3F9FF",
        lavender: "#F1EDFF",
        // Restrained complementary accent (sparingly)
        accent: {
          DEFAULT: "#FF8A3D",
          soft: "#FFF1E7",
          ink: "#8A3B0E",
        },
        // Neutrals
        ivory: "#FBFAF6",
        ink: "#172B3A",
        moss: "#607487",
        muted: "#7A8CA0",
        line: "#DCE8F2",
        cardline: "#E4EEF6",
        strongline: "#B8D5EA",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "var(--font-noto)",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        display: [
          "var(--font-display)",
          "var(--font-sans)",
          "Georgia",
          "serif",
        ],
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(23,43,58,.07), 0 8px 28px -12px rgba(23,43,58,.16)",
        card: "0 1px 0 rgba(23,43,58,.04), 0 18px 44px -22px rgba(7,86,166,.25)",
        lift: "0 2px 4px rgba(23,43,58,.06), 0 24px 56px -20px rgba(7,86,166,.28)",
        glow: "0 0 0 1px rgba(56,189,248,.45), 0 12px 40px -12px rgba(56,189,248,.5)",
        field: "0 1px 2px rgba(7,86,166,.08)",
      },
      maxWidth: {
        shell: "80rem",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pop: {
          "0%": { opacity: "0", transform: "translateY(10px) scale(.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "chat-in": {
          "0%": { opacity: "0", transform: "translateY(8px) scale(.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        typing: {
          "0%, 60%, 100%": { opacity: ".25", transform: "translateY(0)" },
          "30%": { opacity: "1", transform: "translateY(-3px)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "assist-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "spin-arc": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-arc-rev": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        rise: "rise .7s cubic-bezier(.22,.8,.28,1) both",
        fade: "fade .45s ease both",
        pop: "pop .35s cubic-bezier(.22,.8,.28,1) both",
        "chat-in": "chat-in .3s cubic-bezier(.22,.8,.28,1) both",
        typing: "typing 1.2s ease-in-out infinite",
        floaty: "floaty 5s ease-in-out infinite",
        "assist-float": "assist-float 2.6s ease-in-out infinite",
        "spin-arc": "spin-arc 1.6s linear infinite",
        "spin-arc-rev": "spin-arc-rev 2.4s linear infinite",
        "slide-in-right": "slide-in-right .32s cubic-bezier(.22,.8,.28,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
