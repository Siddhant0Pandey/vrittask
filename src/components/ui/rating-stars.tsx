import { Star } from "lucide-react";
import type { ProductRating } from "@/types/product";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: ProductRating;
  size?: "sm" | "md";
  showCount?: boolean;
  className?: string;
}

const STARS = [1, 2, 3, 4, 5] as const;

export function RatingStars({ rating, size = "sm", showCount = true, className }: RatingStarsProps) {
  const iconSize = size === "sm" ? "size-3.5" : "size-4.5";

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center" role="img" aria-label={`Rated ${rating.rate} out of 5`}>
        {STARS.map((star) => {
          const fill = Math.min(Math.max(rating.rate - (star - 1), 0), 1);
          return (
            <span key={star} className={cn("relative", iconSize)} aria-hidden>
              <Star className={cn("absolute inset-0 text-line-strong", iconSize)} fill="currentColor" strokeWidth={0} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={cn("text-star", iconSize)} fill="currentColor" strokeWidth={0} />
              </span>
            </span>
          );
        })}
      </div>
      <span className={cn("font-semibold text-ink", size === "sm" ? "text-xs" : "text-sm")}>
        {rating.rate.toFixed(1)}
      </span>
      {showCount && (
        <span className={cn("text-ink-faint", size === "sm" ? "text-xs" : "text-sm")}>
          ({rating.count.toLocaleString("en-US")})
        </span>
      )}
    </div>
  );
}
