"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import logoEasy from "@/assets/images/General/logo-icon.png";

/**
 * Branded initial-load preloader.
 *
 * Lifecycle:
 * - Rendered by the root layout on every full page load (SSR HTML includes it
 *   in its visible state, so the initial paint is branded — no mismatch: the
 *   first client render matches with `leaving=false, gone=false`).
 * - Dismisses when the window `load` event fires (genuine readiness: HTML,
 *   CSS, fonts, hero image), with a 2.5s absolute cap so it can never stick.
 * - Fades out over 350ms, then unmounts. Client-side navigations never
 *   remount the layout, so it never flashes on route transitions.
 * - Respects prefers-reduced-motion (static logo, fast fade).
 */
export function Preloader() {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let dismissed = false;
    let fadeTimer: number | undefined;
    let capTimer: number | undefined;

    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      setLeaving(true);
      fadeTimer = window.setTimeout(() => setGone(true), 380);
    };

    if (document.readyState === "complete") {
      // Page already ready (e.g. fast / cached load): brief brand moment only.
      const t = window.setTimeout(dismiss, 450);
      capTimer = t;
    } else {
      window.addEventListener("load", dismiss, { once: true });
      capTimer = window.setTimeout(dismiss, 2500);
    }
    return () => {
      window.removeEventListener("load", dismiss);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(capTimer);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      role="status"
      aria-label="Loading EasyEVNepal"
      aria-hidden={leaving}
      className={`fixed inset-0 z-[90] grid place-items-center bg-white transition-opacity duration-300 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center">
        <div className="relative grid h-28 w-28 place-items-center">
          {/* soft track */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-full border-[3px] border-palesky"
          />
          {/* bright rotating arc */}
          <span
            aria-hidden
            className="animate-spin-arc absolute inset-0 rounded-full border-[3px] border-transparent border-t-brand border-r-skyvivid"
          />
          {/* secondary lighter counter-arc */}
          <span
            aria-hidden
            className="animate-spin-arc-rev absolute inset-2 rounded-full border-2 border-transparent border-b-lightblue"
          />
          {/* logo + glow */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-full shadow-glow"
          />
          <span className="relative grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-white">
            <Image
              src={logoEasy}
              alt=""
              width={64}
              height={64}
              className="h-16 w-16 object-contain"
              priority
            />
          </span>
        </div>
        <p className="font-display mt-5 text-xl font-semibold tracking-tight text-navy">
          EasyEV<span className="text-brand">Nepal</span>
        </p>
        <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
          Move electric
        </p>
      </div>
    </div>
  );
}
