import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/api/products";
import { siteConfig } from "@/lib/config";

const url = (path: string) => new URL(path, siteConfig.url).toString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: url("/products"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
  ];

  // A failing API should degrade the sitemap, not break it.
  const [products, categories] = await Promise.all([
    getProducts().catch(() => []),
    getCategories().catch(() => []),
  ]);

  return [
    ...staticRoutes,
    ...categories.map((category) => ({
      url: url(`/products?category=${encodeURIComponent(category)}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: url(`/products/${product.id}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      images: [product.image],
    })),
  ];
}
