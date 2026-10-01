import Link from "next/link";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/config";
import { Logo } from "./logo";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All products" },
      { href: "/products?category=electronics", label: "Electronics" },
      { href: "/products?category=jewelery", label: "Jewellery" },
      { href: "/products?sort=desc", label: "New arrivals" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/cart", label: "Your bag" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-pine-900 text-pine-100">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm space-y-4">
          <Logo inverted />
          <p className="text-sm leading-relaxed text-pine-200">{siteConfig.description}</p>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h2 className="mb-4 font-sans text-xs font-bold tracking-[0.14em] text-citron-300 uppercase">{column.title}</h2>
            <ul className="space-y-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-pine-100 transition hover:text-white hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-xs text-pine-300 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Demo storefront powered by the Fake Store API.
          </p>
          <p>Prices in USD.</p>
        </Container>
      </div>
    </footer>
  );
}
