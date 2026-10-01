import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Price } from "@/components/ui/price";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface HomeHeroProps {
  /** Three products shown in the collage, most prominent first. */
  showcase: Product[];
  productCount: number;
  averageRating: number;
}

const TILE_STYLES = [
  "col-span-2 row-span-2 bg-white",
  "bg-citron-200",
  "bg-persimmon-100",
] as const;

export function HomeHero({ showcase, productCount, averageRating }: HomeHeroProps) {
  const [hero] = showcase;

  return (
    <section className="relative overflow-hidden">
      <Container className="relative grid items-center gap-12 py-12 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="animate-fade-up space-y-7">
          <p className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface py-1 pr-3 pl-1 text-xs font-semibold text-ink-soft">
            <span className="rounded-full bg-pine-700 px-2 py-0.5 text-citron-300">New</span>
            {productCount} hand-picked pieces, refreshed weekly
          </p>

          <h1 className="text-5xl leading-[0.95] font-extrabold tracking-[-0.035em] sm:text-7xl xl:text-[5.5rem]">
            Goods worth{" "}
            <span className="relative inline-block whitespace-nowrap text-pine-700">
              keeping
              <svg
                viewBox="0 0 300 24"
                className="absolute -bottom-2 left-0 h-3 w-full text-persimmon-500 sm:-bottom-3 sm:h-4"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path d="M3 17C60 6 160 3 297 10" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" />
              </svg>
            </span>
            .
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-ink-soft">
            Electronics, jewellery and wardrobe staples — chosen for craft, rated by real shoppers, and priced without
            the games.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink href="/products" variant="accent" size="lg">
              Shop the catalogue <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/products?sort=desc" variant="outline" size="lg">
              New arrivals
            </ButtonLink>
          </div>

          <dl className="flex flex-wrap gap-x-8 gap-y-3 pt-2 text-sm">
            <div className="flex items-center gap-2">
              <Star className="size-4 text-star" fill="currentColor" strokeWidth={0} />
              <dt className="sr-only">Average rating</dt>
              <dd>
                <span className="font-bold">{averageRating.toFixed(1)}</span>
                <span className="text-ink-faint"> avg. rating</span>
              </dd>
            </div>
            <div>
              <dt className="sr-only">Shipping</dt>
              <dd>
                <span className="font-bold">Free shipping</span>
                <span className="text-ink-faint"> over $100</span>
              </dd>
            </div>
            <div>
              <dt className="sr-only">Returns</dt>
              <dd>
                <span className="font-bold">30-day</span>
                <span className="text-ink-faint"> returns</span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="grid aspect-square grid-cols-3 grid-rows-3 gap-3 sm:gap-4">
            {showcase.slice(0, 3).map((product, index) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                aria-label={product.title}
                className={cn(
                  "group relative overflow-hidden rounded-[1.75rem] border border-line shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-lift",
                  TILE_STYLES[index],
                )}
              >
                <Image
                  src={product.image}
                  alt=""
                  fill
                  priority
                  sizes={index === 0 ? "(min-width: 1024px) 34vw, 66vw" : "(min-width: 1024px) 16vw, 33vw"}
                  className={cn(
                    "object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105",
                    index === 0 ? "p-12" : "p-5",
                  )}
                />
              </Link>
            ))}
            <div className="col-span-3 flex items-center justify-between gap-4 rounded-[1.75rem] bg-pine-800 px-6 text-white shadow-soft">
              <div>
                <p className="text-xs font-semibold tracking-wider text-citron-300 uppercase">Customer favourite</p>
                <p className="line-clamp-1 font-display text-lg font-bold">{hero?.title}</p>
              </div>
              {hero && <Price amount={hero.price} size="lg" className="shrink-0 text-white" />}
            </div>
          </div>

          <div className="absolute -top-4 -left-4 hidden rotate-[-8deg] rounded-2xl bg-citron-300 px-4 py-3 shadow-lift sm:block">
            <p className="font-display text-2xl leading-none font-extrabold text-pine-900">4.5★+</p>
            <p className="text-[11px] font-bold tracking-wide text-pine-800 uppercase">Bestsellers inside</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
