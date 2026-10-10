export function formatNPR(n?: number | null): string {
  if (n == null) return "Price on request";
  if (n >= 10000000) {
    const cr = n / 10000000;
    return `Rs. ${trimNum(cr)} Cr`;
  }
  const lakh = n / 100000;
  return `Rs. ${trimNum(lakh)} Lakh`;
}

function trimNum(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, "");
}

export function formatPriceRange(
  min?: number | null,
  max?: number | null
): string {
  if (min == null && max == null) return "Price on request";
  if (min != null && max != null && min !== max)
    return `${formatNPR(min)} – ${formatNPR(max)}`;
  return formatNPR(min ?? max);
}

export function formatFullNPR(n?: number | null): string {
  if (n == null) return "—";
  return "Rs. " + n.toLocaleString("en-IN");
}

export const NEPAL_BUDGETS = [
  { label: "Under Rs. 20 Lakh", max: 2000000 },
  { label: "Under Rs. 30 Lakh", max: 3000000 },
  { label: "Under Rs. 40 Lakh", max: 4000000 },
  { label: "Under Rs. 60 Lakh", max: 6000000 },
  { label: "Premium EVs", min: 6000000 },
] as const;
