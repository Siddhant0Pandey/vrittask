"use client";

import { cn } from "@/lib/utils";

interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  formatLabel?: (value: number) => string;
  className?: string;
}

/** Dual-thumb slider composed of two native range inputs, keeping keyboard + a11y for free. */
export function RangeSlider({ min, max, value, onChange, step = 1, formatLabel = String, className }: RangeSliderProps) {
  const [low, high] = value;
  const span = Math.max(max - min, 1);
  const lowPct = ((low - min) / span) * 100;
  const highPct = ((high - min) / span) * 100;

  const inputClass = "range-thumb absolute inset-x-0 top-1/2 h-0 w-full -translate-y-1/2 focus:outline-none";

  return (
    <div className={cn("relative h-6", className)}>
      <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-sunken" />
      <div
        className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-pine-600"
        style={{ left: `${lowPct}%`, right: `${100 - highPct}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={low}
        aria-label="Minimum price"
        aria-valuetext={formatLabel(low)}
        onChange={(event) => onChange([Math.min(Number(event.target.value), high), high])}
        // Keep the low thumb reachable when both thumbs sit at the top end.
        className={cn(inputClass, low > max - span * 0.1 ? "z-20" : "z-10")}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={high}
        aria-label="Maximum price"
        aria-valuetext={formatLabel(high)}
        onChange={(event) => onChange([low, Math.max(Number(event.target.value), low)])}
        className={cn(inputClass, "z-10")}
      />
    </div>
  );
}
