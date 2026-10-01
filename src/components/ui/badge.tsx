import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-sunken text-ink-soft",
  pine: "bg-pine-100 text-pine-800",
  citron: "bg-citron-300 text-pine-900",
  persimmon: "bg-persimmon-100 text-persimmon-700",
} as const;

interface BadgeProps {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
