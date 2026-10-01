import { Flower2, Gem, LayoutGrid, Monitor, Shirt, type LucideIcon } from "lucide-react";
import type { Category } from "@/types/product";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  electronics: Monitor,
  jewelery: Gem,
  "men's clothing": Shirt,
  "women's clothing": Flower2,
};

interface CategoryIconProps {
  /** `null` renders the "all categories" icon. */
  category: Category | null;
  className?: string;
}

export function CategoryIcon({ category, className }: CategoryIconProps) {
  const Icon = (category && CATEGORY_ICONS[category]) || LayoutGrid;
  return <Icon className={className} aria-hidden />;
}
