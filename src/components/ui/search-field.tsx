"use client";

import { Search, X } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface SearchFieldProps extends Omit<ComponentProps<"input">, "onChange" | "value" | "type"> {
  value: string;
  onValueChange: (value: string) => void;
}

export function SearchField({ value, onValueChange, className, placeholder = "Search", ...props }: SearchFieldProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-faint" />
      <input
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-11 w-full rounded-full border border-line-strong bg-surface pr-10 pl-10 text-sm text-ink placeholder:text-ink-faint",
          "transition focus:border-pine-600 focus:bg-white focus:ring-4 focus:ring-pine-100 focus:outline-none",
          "[&::-webkit-search-cancel-button]:hidden",
        )}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => onValueChange("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-ink-faint transition hover:bg-sunken hover:text-ink"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
