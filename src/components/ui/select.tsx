import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> extends Omit<ComponentProps<"select">, "onChange" | "value"> {
  options: readonly SelectOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
}

/** Styled native select — keeps platform pickers and accessibility on mobile. */
export function Select<T extends string>({ options, value, onValueChange, className, ...props }: SelectProps<T>) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(event) => onValueChange(event.target.value as T)}
        className="h-10 w-full cursor-pointer appearance-none rounded-full border border-line-strong bg-surface pr-9 pl-4 text-sm font-semibold text-ink transition hover:border-ink focus:border-pine-600 focus:ring-4 focus:ring-pine-100 focus:outline-none"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-soft" />
    </div>
  );
}
