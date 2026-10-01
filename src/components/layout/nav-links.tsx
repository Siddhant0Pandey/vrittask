"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/products", label: "Shop all" },
  { href: "/products?category=electronics", label: "Electronics", category: "electronics" },
  { href: "/products?category=jewelery", label: "Jewellery", category: "jewelery" },
  { href: "/products?category=women%27s+clothing", label: "Women", category: "women's clothing" },
  { href: "/products?category=men%27s+clothing", label: "Men", category: "men's clothing" },
] as const;

export function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();
  const activeCategory = useSearchParams().get("category");

  return (
    <nav aria-label="Primary" className={cn("flex items-center gap-1", className)}>
      {LINKS.map((link) => {
        const active =
          pathname === "/products" && ("category" in link ? activeCategory === link.category : !activeCategory);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition",
              active ? "bg-ink text-white" : "text-ink-soft hover:bg-sunken hover:text-ink",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
