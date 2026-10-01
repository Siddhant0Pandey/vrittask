"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";
import { parseCatalogQuery, serializeCatalogQuery } from "@/lib/catalog";
import type { CatalogQuery } from "@/types/product";

type HistoryMode = "push" | "replace";

/**
 * The URL is the single source of truth for catalogue state.
 *
 * - `sort` is applied by the API, so changing it triggers a server navigation.
 * - Every other filter is applied client-side, so it is written with the native
 *   History API (which Next.js keeps in sync with `useSearchParams`) — shareable
 *   URLs and back/forward support without a server round-trip.
 */
export function useCatalogQuery() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const query = useMemo(() => parseCatalogQuery(searchParams), [searchParams]);

  const hrefFor = useCallback(
    (patch: Partial<CatalogQuery>) => `${pathname}${serializeCatalogQuery({ ...query, ...patch })}`,
    [pathname, query],
  );

  const update = useCallback(
    (patch: Partial<CatalogQuery>, mode: HistoryMode = "push") => {
      // Read the live URL rather than the render-time snapshot so that back-to-back
      // (e.g. debounced) updates compose instead of overwriting each other.
      const current = parseCatalogQuery(new URLSearchParams(window.location.search));
      // Any filter change invalidates the current page unless a page is set explicitly.
      const next: CatalogQuery = { ...current, page: 1, ...patch };
      const href = `${pathname}${serializeCatalogQuery(next)}`;

      if (next.sort !== current.sort) {
        startTransition(() => router[mode](href, { scroll: false }));
        return;
      }
      window.history[mode === "push" ? "pushState" : "replaceState"](null, "", href);
    },
    [pathname, router],
  );

  const reset = useCallback(() => update({ search: "", category: null, price: {} }), [update]);

  return { query, update, reset, hrefFor, isSorting: isPending };
}
