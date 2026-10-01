import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { RatingStars } from "@/components/ui/rating-stars";
import { formatCategory } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import { AddToCartButton } from "./add-to-cart-button";

export type ProductCardLayout = "grid" | "list";

interface ProductCardProps {
  product: Product;
  layout?: ProductCardLayout;
  /** Marks above-the-fold images for eager loading. */
  priority?: boolean;
  className?: string;
}

const BESTSELLER_THRESHOLD = 4.5;

export function ProductCard({ product, layout = "grid", priority, className }: ProductCardProps) {
  const href = `/products/${product.id}`;
  const isList = layout === "list";
  const isBestseller = product.rating.rate >= BESTSELLER_THRESHOLD;

  return (
    <article
      className={cn(
        "group relative flex overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface",
        "transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-lift",
        isList ? "flex-row" : "flex-col",
        className,
      )}
    >
      <Link
        href={href}
        className={cn(
          "relative block shrink-0 overflow-hidden bg-white",
          isList ? "w-32 sm:w-48" : "aspect-[4/4.2] w-full",
        )}
        tabIndex={-1}
        aria-hidden
      >
        <Image
          src={product.image}
          alt=""
          fill
          priority={priority}
          sizes={isList ? "192px" : "(min-width: 1280px) 280px, (min-width: 640px) 33vw, 50vw"}
          className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-105 sm:p-8"
        />
        {isBestseller && !isList && (
          <Badge tone="citron" className="absolute top-3 left-3">
            Bestseller
          </Badge>
        )}
      </Link>

      <div className={cn("flex flex-1 flex-col gap-2 p-4", isList && "justify-center sm:p-6")}>
        <p className="text-[11px] font-bold tracking-[0.12em] text-pine-600 uppercase">
          {formatCategory(product.category)}
        </p>
        <h3 className={cn("font-sans font-semibold leading-snug text-ink", isList ? "text-base sm:text-lg" : "text-sm sm:text-[15px]")}>
          <Link href={href} className="line-clamp-2 after:absolute after:inset-0 after:content-[''] hover:text-pine-700">
            {product.title}
          </Link>
        </h3>
        {isList && <p className="hidden text-sm leading-relaxed text-ink-soft sm:line-clamp-2">{product.description}</p>}
        <RatingStars rating={product.rating} />
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <Price amount={product.price} size={isList ? "lg" : "md"} />
          {/* Sits above the card's stretched link so it remains clickable. */}
          <AddToCartButton product={product} compact className="relative z-10" />
        </div>
      </div>
    </article>
  );
}
