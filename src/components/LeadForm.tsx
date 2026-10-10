"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

const INQUIRY_TYPES = [
  "General EV advice",
  "Specific vehicle inquiry",
  "Test-drive request",
  "Price quotation",
  "Upcoming vehicle alert",
  "Used vehicle inquiry",
  "Charger / accessory inquiry",
] as const;

export function LeadForm({
  defaultVehicle = "",
  defaultType = "General EV advice",
  compact = false,
}: {
  defaultVehicle?: string;
  defaultType?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    vehicle: defaultVehicle,
    inquiryType: defaultType,
    budget: "",
    contact: "Phone",
    message: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [serverMsg, setServerMsg] = useState("");

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!/^[+\d][\d\s\-()]{6,16}$/.test(form.phone.trim()))
      e.phone = "Enter a valid phone number (e.g. 98XXXXXXXX).";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Enter a valid email address.";
    if (!form.consent) e.consent = "Please accept to be contacted so we can respond.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (status === "sending") return;
    if (!validate()) return;
    setStatus("sending");
    setServerMsg("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sourcePage: typeof window !== "undefined" ? window.location.href : "",
          submittedAt: new Date().toISOString(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Submission failed. Please try again.");
      setStatus("done");
    } catch (err: unknown) {
      setStatus("error");
      setServerMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "done") {
    return (
      <div className="animate-pop rounded-3xl border border-cardline bg-white p-8 text-center shadow-soft" role="status">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-palesky">
          <CheckCircle2 className="text-brand" size={30} />
        </span>
        <h3 className="font-display mt-4 text-2xl font-semibold text-ink">
          Thank you, {form.name.split(" ")[0] || "friend"}.
        </h3>
        <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-moss">
          Your inquiry has been recorded. Our team will reach out via {form.contact.toLowerCase()} shortly.
          Reference: {form.inquiryType}{form.vehicle ? ` — ${form.vehicle}` : ""}.
        </p>
        <button
          onClick={() => { setStatus("idle"); router.refresh(); }}
          className="btn-press mt-6 rounded-full border-[1.5px] border-line px-6 py-2.5 text-[13px] font-bold text-ink hover:border-deep hover:text-deep"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  const inputCls = (bad?: string) =>
    `h-12 w-full rounded-xl border-[1.5px] bg-white px-4 text-[14px] font-medium text-ink shadow-sm outline-none transition placeholder:font-normal placeholder:text-muted hover:border-brand/50 focus:border-brand focus:ring-4 focus:ring-brand/15 ${
      bad ? "border-red-400 bg-red-50/50 focus:border-red-400 focus:ring-red-100" : "border-strongline"
    }`;

  const labelCls = "mb-1.5 block text-[13px] font-bold text-ink";

  const err = (msg?: string) => (
    <p className="mt-1 min-h-[16px] text-[12px] font-semibold leading-4 text-red-600" role={msg ? "alert" : undefined} aria-live="polite">
      {msg || ""}
    </p>
  );

  const groupCls = "rounded-2xl border border-cardline/80 bg-white/70 p-4 sm:p-5";
  const groupTitleCls = "text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={`rounded-[1.75rem] border border-cardline bg-tint shadow-soft ${compact ? "p-4 sm:p-5" : "p-5 sm:p-7"}`}
    >
      <fieldset className={groupCls}>
        <legend className="sr-only">Contact details</legend>
        <p className={groupTitleCls} aria-hidden>Contact details</p>
        <div className={`mt-3 grid gap-x-4 gap-y-1 ${compact ? "sm:grid-cols-1" : "sm:grid-cols-2"}`}>
          <div>
            <label htmlFor="lf-name" className={labelCls}>Full name <span className="text-brand" aria-hidden>*</span></label>
            <input
              id="lf-name" autoComplete="name" required className={inputCls(errors.name)} placeholder="e.g. Aashish Risal"
              value={form.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name}
              aria-describedby="lf-name-err"
            />
            <span id="lf-name-err">{err(errors.name)}</span>
          </div>
          <div>
            <label htmlFor="lf-phone" className={labelCls}>Phone <span className="text-brand" aria-hidden>*</span></label>
            <input
              id="lf-phone" autoComplete="tel" inputMode="tel" required className={inputCls(errors.phone)} placeholder="98XXXXXXXX"
              value={form.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!errors.phone}
              aria-describedby="lf-phone-err"
            />
            <span id="lf-phone-err">{err(errors.phone)}</span>
          </div>
          <div>
            <label htmlFor="lf-email" className={labelCls}>Email <span className="font-medium text-muted">(optional)</span></label>
            <input
              id="lf-email" autoComplete="email" inputMode="email" className={inputCls(errors.email)} placeholder="you@example.com"
              value={form.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email}
              aria-describedby="lf-email-err"
            />
            <span id="lf-email-err">{err(errors.email)}</span>
          </div>
          <div>
            <label htmlFor="lf-contact" className={labelCls}>Preferred contact</label>
            <select id="lf-contact" className={`${inputCls()} select-caret`} value={form.contact} onChange={(e) => set("contact", e.target.value)}>
              <option>Phone</option>
              <option>WhatsApp</option>
              <option>Email</option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className={`${groupCls} mt-3`}>
        <legend className="sr-only">What you are looking for</legend>
        <p className={groupTitleCls} aria-hidden>What you are looking for</p>
        <div className={`mt-3 grid gap-x-4 gap-y-4 ${compact ? "sm:grid-cols-1" : "sm:grid-cols-2"}`}>
          <div>
            <label htmlFor="lf-type" className={labelCls}>I want</label>
            <select id="lf-type" className={`${inputCls()} select-caret`} value={form.inquiryType} onChange={(e) => set("inquiryType", e.target.value)}>
              {INQUIRY_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="lf-budget" className={labelCls}>Budget range</label>
            <select id="lf-budget" className={`${inputCls()} select-caret`} value={form.budget} onChange={(e) => set("budget", e.target.value)}>
              <option value="">Select…</option>
              <option>Under Rs. 20 Lakh</option>
              <option>Rs. 20–40 Lakh</option>
              <option>Rs. 40–60 Lakh</option>
              <option>Rs. 60 Lakh+</option>
              <option>Two-wheeler budget</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="lf-vehicle" className={labelCls}>Vehicle / product of interest</label>
            <input
              id="lf-vehicle" className={inputCls()} placeholder="e.g. Tata Nexon EV, BYD Atto 3…"
              value={form.vehicle} onChange={(e) => set("vehicle", e.target.value)}
            />
            <p className="mt-1 text-[12px] text-muted">Pre-filled when you arrive from a vehicle or product page.</p>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="lf-msg" className={labelCls}>Message <span className="font-medium text-muted">(optional)</span></label>
            <textarea
              id="lf-msg" rows={3} className={`${inputCls()} h-auto resize-y py-3`} placeholder="Daily running, home parking, timeline…"
              value={form.message} onChange={(e) => set("message", e.target.value)}
            />
          </div>
        </div>
      </fieldset>

      <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-2xl border border-cardline bg-white p-3.5 text-[13px] leading-relaxed text-moss transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand/25">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => set("consent", e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 rounded accent-[#1687E8]"
          aria-describedby="lf-consent-err"
        />
        <span>I agree to be contacted about my inquiry. <span className="text-muted">Marketing messages remain optional and unticked.</span></span>
      </label>
      <span id="lf-consent-err">{err(errors.consent)}</span>

      {status === "error" && (
        <p className="mt-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-[13px] font-medium text-red-700" role="alert">{serverMsg}</p>
      )}

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-press flex flex-1 items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-[15px] font-bold text-white shadow-soft transition hover:bg-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" && <Loader2 size={17} className="animate-spin" />}
          {status === "sending" ? "Sending…" : "Request assistance"}
        </button>
      </div>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[12px] font-medium text-muted">
        <ShieldCheck size={13} className="text-brand" /> No spam. No fake urgency. Replies during working hours.
      </p>
    </form>
  );
}
