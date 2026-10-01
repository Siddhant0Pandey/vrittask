import type { Metadata } from "next";
import { CatalogHero } from "@/components/products/catalog-hero";
import { ProductCatalog } from "@/components/products/product-catalog";
import { breadcrumbJsonLd, itemListJsonLd, JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { ErrorState } from "@/components/ui/error-state";
import { getUserMessage } from "@/lib/api/errors";
import { getCategories, getProducts } from "@/lib/api/products";
import { formatCategory, getPriceBounds, parseCatalogQuery } from "@/lib/catalog";

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/products" },
];

export async function generateMetadata({ searchParams }: PageProps<"/products">): Promise<Metadata> {
  const { category, search } = parseCatalogQuery(await searchParams);
  const title = category ? `Shop ${formatCategory(category)}` : search ? `Results for “${search}”` : "Shop all products";

  return {
    title,
    description: category
      ? `Browse our curated range of ${formatCategory(category).toLowerCase()} — filter by price and find your next favourite.`
      : "Browse the full Kosha catalogue: electronics, jewellery and clothing, with fast filtering by category and price.",
    // Filtered views consolidate onto the category page (or the main catalogue) for search engines.
    alternates: { canonical: category ? `/products?category=${encodeURIComponent(category)}` : "/products" },
    openGraph: { title, url: "/products" },
  };
}

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const { sort } = parseCatalogQuery(await searchParams);

  // Fetched in parallel; categories are non-critical and degrade to those found on products.
  const [productsResult, categoriesResult] = await Promise.allSettled([getProducts(sort), getCategories()]);

  if (productsResult.status === "rejected") {
    return (
      <Container className="py-10">
        <ErrorState title="We couldn't load the catalogue" message={getUserMessage(productsResult.reason)} />
      </Container>
    );
  }

  const products = productsResult.value;
  const categories =
    categoriesResult.status === "fulfilled"
      ? categoriesResult.value
      : Array.from(new Set(products.map((product) => product.category)));
  const averageRating = products.reduce((sum, product) => sum + product.rating.rate, 0) / (products.length || 1);

  return (
    <Container className="space-y-10 py-6 sm:py-10">
      <JsonLd data={[breadcrumbJsonLd(BREADCRUMBS), itemListJsonLd(products)]} />
      <CatalogHero
        breadcrumbs={BREADCRUMBS}
        stats={[
          { label: "Products", value: String(products.length) },
          { label: "Categories", value: String(categories.length) },
          { label: "Rating", value: averageRating.toFixed(1) },
        ]}
      />
      <ProductCatalog products={products} categories={categories} priceBounds={getPriceBounds(products)} />
    </Container>
  );
}
