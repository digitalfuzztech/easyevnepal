import Link from "next/link";

export function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] ${
        dark ? "bg-white/10 text-skyvivid" : "bg-palesky text-brand"
      }`}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  dark = false,
  align = "left",
  action,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  dark?: boolean;
  align?: "left" | "center";
  action?: React.ReactNode;
}) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-2xl`}>
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <h2
        className={`font-display mt-4 text-balance text-3xl font-semibold leading-[1.04] tracking-tight sm:text-4xl lg:text-[2.9rem] ${
          dark ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {copy && (
        <p className={`mt-4 max-w-xl text-[15px] leading-relaxed ${dark ? "text-white/70" : "text-moss"}`}>
          {copy}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[13px]">
      <ol className="flex flex-wrap items-center gap-1.5 text-muted">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <span aria-hidden className="text-muted/60">
                /
              </span>
            )}
            {it.href ? (
              <Link
                href={it.href}
                className="rounded font-medium text-moss underline-offset-4 hover:text-brand hover:underline"
              >
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-semibold text-ink">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function EmptyState({
  title,
  copy,
  action,
}: {
  title: string;
  copy: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-cardline bg-white px-6 py-14 text-center shadow-soft">
      <p className="font-display text-balance text-2xl font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-moss">{copy}</p>
      {action && <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-3xl border border-cardline bg-white px-6 py-14" role="status" aria-live="polite">
      <span className="flex gap-1.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className="typing-dot h-2 w-2 rounded-full bg-brand" />
        ))}
      </span>
      <span className="text-sm font-semibold text-moss">{label}</span>
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  copy = "Please try again. If the problem continues, contact the EasyEVNepal team.",
  onRetry,
}: {
  title?: string;
  copy?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50/60 px-6 py-12 text-center" role="alert">
      <p className="font-display text-2xl font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-moss">{copy}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-press mt-6 rounded-full bg-deep px-6 py-2.5 text-[13px] font-bold text-white"
        >
          Try again
        </button>
      )}
    </div>
  );
}
