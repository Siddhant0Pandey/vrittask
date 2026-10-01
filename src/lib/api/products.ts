import "server-only";

import { apiConfig } from "@/lib/config";
import type { Category, Product, SortOrder } from "@/types/product";
import { fakeStore } from "./fakestore";
import { isApiError } from "./errors";

const cache = (tag: string) => ({ next: { revalidate: apiConfig.revalidateSeconds, tags: ["products", tag] } });

export function getProducts(sort?: SortOrder | null): Promise<Product[]> {
  return fakeStore.get<Product[]>("/products", { query: { sort }, ...cache("products:list") });
}

/** Returns `null` when the product does not exist so callers can render a 404. */
export async function getProduct(id: number): Promise<Product | null> {
  if (!Number.isInteger(id) || id <= 0) return null;
  try {
    return await fakeStore.get<Product>(`/products/${id}`, cache(`products:${id}`));
  } catch (error) {
    if (isApiError(error) && error.isNotFound) return null;
    throw error;
  }
}

export function getCategories(): Promise<Category[]> {
  return fakeStore.get<Category[]>("/products/categories", cache("products:categories"));
}

export function getProductsByCategory(category: Category): Promise<Product[]> {
  return fakeStore.get<Product[]>(`/products/category/${encodeURIComponent(category)}`, cache(`category:${category}`));
}
