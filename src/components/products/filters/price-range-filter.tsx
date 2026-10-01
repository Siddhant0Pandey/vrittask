"use client";

import { RangeSlider } from "@/components/ui/range-slider";
import { cn, formatPrice } from "@/lib/utils";
import type { PriceRange } from "@/types/product";

interface PriceRangeFilterProps {
  bounds: PriceRange;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const PRESETS: { label: string; range: (bounds: PriceRange) => [number, number] }[] = [
  { label: "Under $25", range: ({ min }) => [min, 25] },
  { label: "$25 – $100", range: () => [25, 100] },
  { label: "$100 – $500", range: () => [100, 500] },
  { label: "$500+", range: ({ max }) => [500, max] },
];

const formatWhole = (value: number) => formatPrice(value).replace(/\.00$/, "");

export function PriceRangeFilter({ bounds, value, onChange }: PriceRangeFilterProps) {
  const [low, high] = value;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        {[
          { label: "Min", amount: low },
          { label: "Max", amount: high },
        ].map(({ label, amount }, index) => (
          <div key={label} className="contents">
            {index === 1 && <span className="h-px w-3 bg-line-strong" aria-hidden />}
            <div className="flex-1 rounded-xl border border-line bg-surface px-3 py-2">
              <p className="text-[10px] font-bold tracking-wider text-ink-faint uppercase">{label}</p>
              <p className="font-display text-base font-bold tabular-nums">{formatWhole(amount)}</p>
            </div>
          </div>
        ))}
      </div>

      <RangeSlider min={bounds.min} max={bounds.max} value={value} onChange={onChange} formatLabel={formatWhole} />

      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map(({ label, range }) => {
          const [presetLow, presetHigh] = range(bounds).map((n) => Math.min(Math.max(n, bounds.min), bounds.max));
          const active = presetLow === low && presetHigh === high;
          return (
            <button
              key={label}
              type="button"
              aria-pressed={active}
              onClick={() => onChange([presetLow, presetHigh])}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                active
                  ? "border-pine-700 bg-pine-50 text-pine-800"
                  : "border-line bg-surface text-ink-soft hover:border-line-strong hover:text-ink",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
