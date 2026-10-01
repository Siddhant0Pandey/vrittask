import { RatingStars } from "@/components/ui/rating-stars";
import type { ProductRating } from "@/types/product";

/** Visual summary of the aggregate rating the API provides. */
export function RatingBreakdown({ rating }: { rating: ProductRating }) {
  const sentiment =
    rating.rate >= 4.5 ? "Loved by customers" : rating.rate >= 4 ? "Highly rated" : rating.rate >= 3 ? "Well reviewed" : "Mixed reviews";

  return (
    <div className="flex items-center gap-5 rounded-[var(--radius-card)] border border-line bg-surface p-5">
      <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-citron-200">
        <span className="font-display text-3xl font-extrabold text-pine-900">{rating.rate.toFixed(1)}</span>
      </div>
      <div className="space-y-1.5">
        <p className="font-display text-lg font-bold">{sentiment}</p>
        <RatingStars rating={rating} size="md" showCount={false} />
        <p className="text-sm text-ink-soft">Based on {rating.count.toLocaleString("en-US")} verified ratings</p>
      </div>
    </div>
  );
}
