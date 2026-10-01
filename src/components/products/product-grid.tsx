import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import { ProductCard, type ProductCardLayout } from "./product-card";

interface ProductGridProps {
  products: readonly Product[];
  layout?: ProductCardLayout;
  /** Number of leading images to load eagerly. */
  priorityCount?: number;
  columns?: "catalog" | "wide";
  className?: string;
}

const gridColumns = {
  catalog: "grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
  wide: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
} as const;

export function ProductGrid({ products, layout = "grid", priorityCount = 0, columns = "catalog", className }: ProductGridProps) {
  return (
    <ul
      className={cn(
        "grid gap-3 sm:gap-5",
        layout === "grid" ? gridColumns[columns] : "grid-cols-1",
        className,
      )}
    >
      {products.map((product, index) => (
        <li
          key={product.id}
          className="animate-fade-up"
          style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
        >
          <ProductCard product={product} layout={layout} priority={index < priorityCount} className="h-full" />
        </li>
      ))}
    </ul>
  );
}
