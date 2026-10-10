"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scroll-reveal orchestrator with reliability guarantees:
 * 1. Adds `js-enabled` to <html> so `.reveal`/`.hero-line` hidden states only
 *    apply when JS can actually reveal them (CSS defaults are visible).
 * 2. IntersectionObserver reveals elements as they enter (with a bottom margin
 *    so content animates slightly before it is fully visible).
 * 3. A safety timeout reveals everything after 2.5s even if the observer
 *    stalls, the tab was backgrounded, or elements were already in view.
 * 4. Re-runs on route change so per-page `.reveal` nodes are picked up.
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("js-enabled");

    const revealAll = () => {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
        el.classList.add("is-visible");
      });
    };

    const els = Array.from(document.querySelectorAll(".reveal:not(.is-visible)"));
    if (!("IntersectionObserver" in window)) {
      revealAll();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => io.observe(el));

    // Safety net: never leave content hidden indefinitely.
    const fallback = window.setTimeout(revealAll, 2500);
    return () => {
      window.clearTimeout(fallback);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
