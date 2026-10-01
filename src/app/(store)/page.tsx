import { BadgeCheck, Leaf, PackageOpen } from "lucide-react";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { HomeHero } from "@/components/home/home-hero";
import { SectionHeading } from "@/components/home/section-heading";
import { ProductGrid } from "@/components/products/product-grid";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ErrorState } from "@/components/ui/error-state";
import { getUserMessage } from "@/lib/api/errors";
import { getCategories, getProducts } from "@/lib/api/products";

const VALUES = [
  { Icon: BadgeCheck, title: "Rated by real shoppers", text: "Every product carries its full rating history — no hidden reviews." },
  { Icon: PackageOpen, title: "Unbox with confidence", text: "30-day returns and free shipping on orders over $100." },
  { Icon: Leaf, title: "Fewer, better things", text: "A tight, curated catalogue instead of an endless scroll." },
] as const;

export default async function HomePage() {
  const [productsResult, categoriesResult] = await Promise.allSettled([getProducts(), getCategories()]);

  if (productsResult.status === "rejected") {
    return (
      <Container className="py-16">
        <ErrorState title="The shop is taking a breather" message={getUserMessage(productsResult.reason)} showHomeLink={false} />
      </Container>
    );
  }

  const products = productsResult.value;
  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [...new Set(products.map((p) => p.category))];
  const topRated = [...products].sort((a, b) => b.rating.rate - a.rating.rate);
  const averageRating = products.reduce((sum, p) => sum + p.rating.rate, 0) / (products.length || 1);

  return (
    <>
      <HomeHero showcase={topRated.slice(0, 3)} productCount={products.length} averageRating={averageRating} />

      <Container className="space-y-24 py-12">
        <section aria-labelledby="categories-heading">
          <SectionHeading id="categories-heading" eyebrow="Shop by category" title="Find your corner" href="/products" linkLabel="Shop all" />
          <CategoryShowcase categories={categories} products={products} />
        </section>

        <section aria-labelledby="top-rated-heading">
          <SectionHeading id="top-rated-heading" eyebrow="Top rated" title="The crowd favourites" href="/products" />
          <ProductGrid products={topRated.slice(0, 4)} columns="wide" />
        </section>

        <section className="rounded-[2rem] bg-pine-900 px-6 py-14 text-white sm:px-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:items-center">
            <div className="space-y-4">
              <h2 className="text-3xl leading-tight font-extrabold sm:text-4xl">
                Shopping that feels <span className="text-citron-300 italic">considered.</span>
              </h2>
              <ButtonLink href="/products" variant="citron">
                Explore the catalogue
              </ButtonLink>
            </div>
            <ul className="grid gap-4 sm:grid-cols-3">
              {VALUES.map(({ Icon, title, text }) => (
                <li key={title} className="rounded-2xl bg-pine-800 p-5">
                  <Icon className="size-6 text-persimmon-400" />
                  <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-pine-200">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Container>
    </>
  );
}
