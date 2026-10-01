import "server-only";

import { apiConfig } from "@/lib/config";
import type { Category, Product, SortOrder } from "@/types/product";
import { isApiError } from "./errors";
import { fakeStore } from "./fakestore";
import { snapshot } from "./snapshot";

const cache = (tag: string) => ({ next: { revalidate: apiConfig.revalidateSeconds, tags: ["products", tag] } });

/** Serves the bundled snapshot when the live API is unavailable; other errors still surface. */
async function withSnapshotFallback<T>(request: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await request();
  } catch (error) {
    if (!isApiError(error) || !error.isUnavailable) throw error;
    console.warn(`[api] live API unavailable (${error.code}), serving snapshot data`);
    return fallback();
  }
}

export function getProducts(sort?: SortOrder | null): Promise<Product[]> {
  return withSnapshotFallback(
    () => fakeStore.get<Product[]>("/products", { query: { sort }, ...cache("products:list") }),
    () => snapshot.products(sort),
  );
}

/** Returns `null` when the product does not exist so callers can render a 404. */
export async function getProduct(id: number): Promise<Product | null> {
  if (!Number.isInteger(id) || id <= 0) return null;
  try {
    return await withSnapshotFallback(
      () => fakeStore.get<Product>(`/products/${id}`, cache(`products:${id}`)),
      () => snapshot.product(id),
    );
  } catch (error) {
    if (isApiError(error) && error.isNotFound) return null;
    throw error;
  }
}

export function getCategories(): Promise<Category[]> {
  return withSnapshotFallback(
    () => fakeStore.get<Category[]>("/products/categories", cache("products:categories")),
    () => snapshot.categories(),
  );
}

export function getProductsByCategory(category: Category): Promise<Product[]> {
  return withSnapshotFallback(
    () =>
      fakeStore.get<Product[]>(`/products/category/${encodeURIComponent(category)}`, cache(`category:${category}`)),
    () => snapshot.productsByCategory(category),
  );
}
