import type { Product } from "@/types/product";
import { siteConfig } from "@/lib/config";
import { formatCategory } from "@/lib/catalog";

type JsonLdData = Record<string, unknown>;

/** Renders schema.org structured data. `<` is escaped to prevent script injection. */
export function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const absoluteUrl = (path: string) => new URL(path, siteConfig.url).toString();

export function productJsonLd(product: Product): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": absoluteUrl(`/products/${product.id}`),
    name: product.title,
    description: product.description,
    image: [product.image],
    sku: String(product.id),
    category: formatCategory(product.category),
    brand: { "@type": "Brand", name: siteConfig.name },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.rate,
      reviewCount: product.rating.count,
      bestRating: 5,
      worstRating: 0,
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product.id}`),
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function itemListJsonLd(products: readonly Product[]): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/products/${product.id}`),
      name: product.title,
    })),
  };
}

export function websiteJsonLd(): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/products")}?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
