import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
      <Skeleton className="aspect-[4/4.2] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="size-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading products"
      className={cn("grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4", className)}
    >
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
