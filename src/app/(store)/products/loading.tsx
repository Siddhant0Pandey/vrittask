import { ProductGridSkeleton } from "@/components/products/product-grid-skeleton";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <Container className="space-y-10 py-6 sm:py-10">
      <div className="rounded-[2rem] bg-pine-800 px-6 py-10 sm:px-10 sm:py-14">
        <div className="max-w-xl space-y-4 opacity-40">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-14 w-80 max-w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[272px_minmax(0,1fr)] lg:gap-10">
        <div className="hidden space-y-4 rounded-[var(--radius-card)] border border-line bg-surface/70 p-5 lg:block">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-11 w-full rounded-full" />
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-11 w-full rounded-xl" />
          ))}
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <div className="space-y-5">
          <div className="flex justify-between">
            <Skeleton className="h-10 w-48 rounded-full" />
            <Skeleton className="h-10 w-44 rounded-full" />
          </div>
          <ProductGridSkeleton />
        </div>
      </div>
    </Container>
  );
}
