import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

export function Logo({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-2.5", className)} aria-label={`${siteConfig.name} home`}>
      <span
        className={cn(
          "relative grid size-9 place-items-center rounded-xl transition-transform duration-300 group-hover:-rotate-6",
          inverted ? "bg-citron-300 text-pine-900" : "bg-pine-700 text-citron-300",
        )}
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
          <path d="M5 4v16M5 12l9-8M8.5 9l9.5 11" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="absolute -top-1 -right-1 size-3 rounded-full bg-persimmon-500 ring-2 ring-canvas" />
      </span>
      <span className={cn("font-display text-xl font-extrabold tracking-tight", inverted ? "text-white" : "text-ink")}>
        {siteConfig.name.toLowerCase()}
      </span>
    </Link>
  );
}
