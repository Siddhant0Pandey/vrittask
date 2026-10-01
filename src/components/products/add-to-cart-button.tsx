"use client";

import { Check, Plus, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useAddToCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface AddToCartButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  product: Product;
  quantity?: number;
  /** Compact circular button used on product cards. */
  compact?: boolean;
}

const CONFIRMATION_MS = 1600;

export function AddToCartButton({ product, quantity = 1, compact, className, ...props }: AddToCartButtonProps) {
  const addToCart = useAddToCart();
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), CONFIRMATION_MS);
    return () => clearTimeout(timer);
  }, [justAdded]);

  const handleClick = () => {
    if (addToCart(product, quantity)) setJustAdded(true);
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Add ${product.title} to bag`}
        className={cn(
          "grid size-10 place-items-center rounded-full text-white shadow-soft transition-all duration-200 active:scale-90",
          justAdded ? "bg-pine-600" : "bg-persimmon-500 hover:bg-persimmon-600 hover:shadow-lift",
          className,
        )}
      >
        {justAdded ? <Check className="size-4.5" strokeWidth={2.5} /> : <Plus className="size-4.5" strokeWidth={2.5} />}
      </button>
    );
  }

  return (
    <Button
      variant={justAdded ? "primary" : "accent"}
      onClick={handleClick}
      className={className}
      aria-live="polite"
      {...props}
    >
      {justAdded ? <Check className="size-4.5" strokeWidth={2.5} /> : <ShoppingBag className="size-4.5" />}
      {justAdded ? "Added to bag" : "Add to bag"}
    </Button>
  );
}
