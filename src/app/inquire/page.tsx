"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Phone, Clock, ShieldCheck } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";

function InquireInner() {
  const params = useSearchParams();
  const vehicle = params.get("vehicle") ?? "";
  const type = params.get("type") ?? "General EV advice";
  return (
    <div className="mx-auto max-w-shell px-4 py-8 sm:px-6 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="inline-flex items-center rounded-full bg-palesky px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand">Inquiry</p>
          <h1 className="font-display mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Tell us what you are looking for.
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-moss">
            A real person replies during working hours with variant options, quotation help,
            or charging feasibility — no spam, no fake urgency.
          </p>
          <div className="mt-6 space-y-3">
            {[
              [Phone, "01-5900000", "Call us, Sun–Fri", "bg-palesky text-brand"],
              [Clock, "Replies within one working day", "Often much faster", "bg-palesky text-deep"],
              [ShieldCheck, "Consent-first", "We only contact you about your inquiry", "bg-lavender text-purple-800"],
            ].map(([Icon, a, b, chip]: any) => (
              <div key={a} className="flex items-center gap-3 rounded-2xl border border-cardline bg-white p-4 shadow-soft">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${chip}`}><Icon size={19} /></span>
                <span><span className="block font-bold text-[14px]">{a}</span><span className="block text-[12.5px] text-moss">{b}</span></span>
              </div>
            ))}
          </div>
        </div>
        <LeadForm defaultVehicle={vehicle} defaultType={type} />
      </div>
    </div>
  );
}

export default function InquirePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-shell p-10 text-moss">Loading form…</div>}>
      <InquireInner />
    </Suspense>
  );
}
