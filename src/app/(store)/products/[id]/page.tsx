import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryIcon } from "@/components/products/category-icon";
import { ProductGallery } from "@/components/products/detail/product-gallery";
import { ProductPerks } from "@/components/products/detail/product-perks";
import { PurchasePanel } from "@/components/products/detail/purchase-panel";
import { RatingBreakdown } from "@/components/products/detail/rating-breakdown";
import { ProductGrid } from "@/components/products/product-grid";
import { breadcrumbJsonLd, JsonLd, productJsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { ErrorState } from "@/components/ui/error-state";
import { Price } from "@/components/ui/price";
import { RatingStars } from "@/components/ui/rating-stars";
import { getUserMessage } from "@/lib/api/errors";
import { getProduct, getProductsByCategory } from "@/lib/api/products";
import { formatCategory } from "@/lib/catalog";
import type { Product } from "@/types/product";

const RELATED_LIMIT = 4;

async function loadProduct(params: PageProps<"/products/[id]">["params"]) {
  const { id } = await params;
  return getProduct(Number(id));
}

export async function generateMetadata({ params }: PageProps<"/products/[id]">): Promise<Metadata> {
  try {
    const product = await loadProduct(params);
    if (!product) return { title: "Product not found", robots: { index: false } };
    const description = product.description.length > 155 ? `${product.description.slice(0, 152)}…` : product.description;
    return {
      title: product.title,
      description,
      alternates: { canonical: `/products/${product.id}` },
      openGraph: {
        title: product.title,
        description,
        url: `/products/${product.id}`,
        images: [{ url: product.image, alt: product.title }],
      },
      twitter: { card: "summary_large_image", title: product.title, description, images: [product.image] },
    };
  } catch {
    return { title: "Product" };
  }
}

async function getRelated(product: Product): Promise<Product[]> {
  try {
    const sameCategory = await getProductsByCategory(product.category);
    return sameCategory.filter((item) => item.id !== product.id).slice(0, RELATED_LIMIT);
  } catch {
    // Related products are a nice-to-have; never fail the page for them.
    return [];
  }
}

export default async function ProductPage({ params }: PageProps<"/products/[id]">) {
  let product: Product | null;
  try {
    product = await loadProduct(params);
  } catch (error) {
    return (
      <Container className="py-16">
        <ErrorState title="We couldn't load this product" message={getUserMessage(error)} />
      </Container>
    );
  }
  if (!product) notFound();

  const related = await getRelated(product);
  const categoryHref = `/products?category=${encodeURIComponent(product.category)}`;
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/products" },
    { name: formatCategory(product.category), path: categoryHref },
    { name: product.title, path: `/products/${product.id}` },
  ];

  return (
    <Container className="py-6 sm:py-10">
      <JsonLd data={[productJsonLd(product), breadcrumbJsonLd(breadcrumbs)]} />
      <Breadcrumbs items={breadcrumbs} className="mb-6 sm:mb-8" />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ProductGallery src={product.image} alt={product.title} />
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Link href={categoryHref}>
                <Badge tone="pine" className="transition hover:bg-pine-200">
                  <CategoryIcon category={product.category} className="size-3" />
                  {formatCategory(product.category)}
                </Badge>
              </Link>
              {product.rating.rate >= 4.5 && <Badge tone="citron">Bestseller</Badge>}
              <Badge tone="neutral">In stock</Badge>
            </div>
            <h1 className="text-3xl leading-tight font-extrabold sm:text-4xl lg:text-[2.75rem]">{product.title}</h1>
            <a href="#reviews" className="inline-block">
              <RatingStars rating={product.rating} size="md" />
            </a>
          </div>

          <div className="flex items-baseline gap-3">
            <Price amount={product.price} size="xl" />
          </div>

          <p className="text-base leading-relaxed text-ink-soft first-letter:font-semibold first-letter:text-ink">
            {product.description}
          </p>

          <PurchasePanel product={product} />
          <ProductPerks />

          <section id="reviews" className="scroll-mt-28 space-y-3">
            <h2 className="text-xl font-bold">Ratings</h2>
            <RatingBreakdown rating={product.rating} />
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">Details</h2>
            <dl className="divide-y divide-line overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface text-sm">
              {[
                ["Category", formatCategory(product.category)],
                ["SKU", `KSH-${String(product.id).padStart(5, "0")}`],
                ["Rating", `${product.rating.rate} / 5 (${product.rating.count} ratings)`],
                ["Ships", "Within 2 business days"],
              ].map(([term, detail]) => (
                <div key={term} className="flex justify-between gap-4 px-5 py-3.5">
                  <dt className="text-ink-faint">{term}</dt>
                  <dd className="text-right font-semibold">{detail}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 space-y-6" aria-labelledby="related-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.14em] text-persimmon-600 uppercase">Pairs well with</p>
              <h2 id="related-heading" className="mt-1 text-3xl font-extrabold">
                More in {formatCategory(product.category)}
              </h2>
            </div>
            <Link href={categoryHref} className="shrink-0 text-sm font-semibold text-pine-700 underline-offset-4 hover:underline">
              View all
            </Link>
          </div>
          <ProductGrid products={related} columns="wide" />
        </section>
      )}
    </Container>
  );
}
