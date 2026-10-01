import type { ReactNode } from "react";
import { cn, formatPrice } from "@/lib/utils";
import type { CartTotals } from "@/types/cart";

interface CartSummaryProps {
  totals: CartTotals;
  className?: string;
  children?: ReactNode;
}

export function CartSummary({ totals, className, children }: CartSummaryProps) {
  const rows = [
    { label: `Subtotal (${totals.itemCount} ${totals.itemCount === 1 ? "item" : "items"})`, value: formatPrice(totals.subtotal) },
    { label: "Shipping", value: totals.shipping === 0 ? "Free" : formatPrice(totals.shipping) },
    { label: "Taxes", value: "Calculated at checkout" },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <dl className="space-y-2.5 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4">
            <dt className="text-ink-soft">{row.label}</dt>
            <dd className={cn("font-semibold tabular-nums", row.value === "Free" && "text-pine-600")}>{row.value}</dd>
          </div>
        ))}
        <div className="flex items-baseline justify-between gap-4 border-t border-dashed border-line-strong pt-4">
          <dt className="font-display text-base font-bold">Total</dt>
          <dd className="font-display text-2xl font-extrabold tracking-tight tabular-nums">{formatPrice(totals.total)}</dd>
        </div>
      </dl>
      {children}
    </div>
  );
}
