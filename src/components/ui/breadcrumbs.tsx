import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface Crumb {
  name: string;
  path: string;
}

export function Breadcrumbs({ items, className }: { items: readonly Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-ink-faint">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="flex min-w-0 items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="truncate font-medium text-ink-soft">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.path} className="transition hover:text-ink">
                    {item.name}
                  </Link>
                  <ChevronRight className="size-3.5 shrink-0" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
