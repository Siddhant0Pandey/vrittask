import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <Container className="py-6 sm:py-10" role="status" aria-label="Loading product">
      <Skeleton className="mb-8 h-4 w-64" />
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <Skeleton className="aspect-square w-full rounded-[2rem]" />
        <div className="space-y-6">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-12 w-36" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-36 w-full rounded-[var(--radius-card)]" />
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>
        </div>
      </div>
    </Container>
  );
}
