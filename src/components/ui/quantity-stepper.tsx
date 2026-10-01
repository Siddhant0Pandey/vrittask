"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  size = "md",
  label = "Quantity",
  className,
}: QuantityStepperProps) {
  const buttonClass = cn(
    "grid place-items-center rounded-full text-ink transition hover:bg-sunken disabled:opacity-30 disabled:hover:bg-transparent",
    size === "sm" ? "size-7" : "size-9",
  );

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center rounded-full border border-line-strong bg-surface p-1",
        className,
      )}
    >
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="size-3.5" strokeWidth={2.5} />
      </button>
      <output
        aria-live="polite"
        className={cn("text-center font-bold tabular-nums", size === "sm" ? "w-7 text-sm" : "w-10")}
      >
        {value}
      </output>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="size-3.5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
