import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms & disclaimer" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-semibold">Terms & disclaimer</h1>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink/85">
        <p>Prices on EasyEVNepal are indicative research figures unless marked as a written dealer quotation. Always confirm price, variant, warranty and delivery terms in writing before paying.</p>
        <p>Range figures are manufacturer claims or lab-cycle values (WLTP / NEDC / CLTC) and are not guaranteed real-world distances.</p>
        <p>Used-vehicle details are seller-provided unless labelled dealer-verified. We do not certify used vehicles without a stated inspection.</p>
        <p>Charging-station listings carry no live availability unless explicitly fed by an operator.</p>
      </div>
    </div>
  );
}
