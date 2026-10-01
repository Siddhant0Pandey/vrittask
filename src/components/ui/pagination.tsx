"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  /** Builds the URL for a page so links stay crawlable and open-in-new-tab friendly. */
  getHref: (page: number) => string;
  /** When provided, intercepts clicks for client-side page changes instead of navigating. */
  onPageChange?: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

type PageToken = number | "ellipsis-start" | "ellipsis-end";

export function getPageTokens(page: number, totalPages: number, siblingCount = 1): PageToken[] {
  const visible = siblingCount * 2 + 5;
  if (totalPages <= visible) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const start = Math.max(page - siblingCount, 2);
  const end = Math.min(page + siblingCount, totalPages - 1);
  const tokens: PageToken[] = [1];
  if (start > 2) tokens.push("ellipsis-start");
  for (let i = start; i <= end; i++) tokens.push(i);
  if (end < totalPages - 1) tokens.push("ellipsis-end");
  tokens.push(totalPages);
  return tokens;
}

export function Pagination({ page, totalPages, getHref, onPageChange, siblingCount = 1, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const handleClick = (target: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!onPageChange || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    onPageChange(target);
  };

  const itemClass =
    "grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm font-semibold transition-colors";

  const edge = (target: number, disabled: boolean, label: string, icon: ReactNode) =>
    disabled ? (
      <span className={cn(itemClass, "text-ink-faint/50")} aria-disabled>
        {icon}
      </span>
    ) : (
      <Link
        href={getHref(target)}
        onClick={handleClick(target)}
        scroll={false}
        aria-label={label}
        className={cn(itemClass, "text-ink hover:bg-sunken")}
      >
        {icon}
      </Link>
    );

  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-center", className)}>
      <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-1 shadow-soft">
        {edge(page - 1, page <= 1, "Previous page", <ChevronLeft className="size-4" />)}
        {getPageTokens(page, totalPages, siblingCount).map((token) =>
          typeof token === "number" ? (
            <Link
              key={token}
              href={getHref(token)}
              onClick={handleClick(token)}
              scroll={false}
              aria-current={token === page ? "page" : undefined}
              aria-label={`Page ${token}`}
              className={cn(
                itemClass,
                token === page ? "bg-pine-700 text-white shadow-soft" : "text-ink-soft hover:bg-sunken hover:text-ink",
              )}
            >
              {token}
            </Link>
          ) : (
            <span key={token} className={cn(itemClass, "text-ink-faint")} aria-hidden>
              …
            </span>
          ),
        )}
        {edge(page + 1, page >= totalPages, "Next page", <ChevronRight className="size-4" />)}
      </div>
    </nav>
  );
}
