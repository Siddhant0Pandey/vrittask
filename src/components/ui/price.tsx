import { cn, formatPrice } from "@/lib/utils";

interface PriceProps {
  amount: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
  xl: "text-4xl",
} as const;

/** Renders a price with de-emphasised cents for quicker scanning. */
export function Price({ amount, size = "md", className }: PriceProps) {
  const [whole, cents] = formatPrice(amount).split(".");
  return (
    <span className={cn("font-display font-bold tracking-tight text-ink tabular-nums", sizes[size], className)}>
      {whole}
      <span className="text-[0.62em] align-top font-semibold opacity-70">.{cents}</span>
    </span>
  );
}
