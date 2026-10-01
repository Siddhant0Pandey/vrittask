import type { ReactNode } from "react";
import { JsonLd, websiteJsonLd } from "@/components/seo/json-ld";
import { AnnouncementBar } from "./announcement-bar";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/** Storefront chrome shared by the store layout and the global 404 page. */
export function StoreShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <JsonLd data={websiteJsonLd()} />
      <AnnouncementBar />
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
