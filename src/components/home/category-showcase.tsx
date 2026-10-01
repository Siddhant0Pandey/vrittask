import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CategoryIcon } from "@/components/products/category-icon";
import { formatCategory } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import type { Category, Product } from "@/types/product";

const PALETTE = [
  "bg-pine-100 hover:bg-pine-200",
  "bg-citron-200 hover:bg-citron-300",
  "bg-persimmon-100 hover:bg-persimmon-50",
  "bg-sunken hover:bg-line",
] as const;

interface CategoryShowcaseProps {
  categories: readonly Category[];
  products: readonly Product[];
}

export function CategoryShowcase({ categories, products }: CategoryShowcaseProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {categories.map((category, index) => {
        const inCategory = products.filter((product) => product.category === category);
        const cover = [...inCategory].sort((a, b) => b.rating.rate - a.rating.rate)[0];

        return (
          <li key={category}>
            <Link
              href={`/products?category=${encodeURIComponent(category)}`}
              className={cn(
                "group relative flex aspect-[4/5] flex-col overflow-hidden rounded-[1.75rem] p-5 transition-colors duration-300",
                PALETTE[index % PALETTE.length],
              )}
            >
              <div className="relative z-10 flex items-start justify-between">
                <span className="grid size-9 place-items-center rounded-xl bg-white text-ink">
                  <CategoryIcon category={category} className="size-4" />
                </span>
                <span className="grid size-9 place-items-center rounded-full bg-ink text-white transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
              {cover && (
                <Image
                  src={cover.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-contain px-10 pt-16 pb-20 mix-blend-multiply transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
                />
              )}
              <div className="relative z-10 mt-auto">
                <h3 className="text-xl font-extrabold sm:text-2xl">{formatCategory(category)}</h3>
                <p className="text-sm font-medium text-ink-soft">{inCategory.length} pieces</p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
