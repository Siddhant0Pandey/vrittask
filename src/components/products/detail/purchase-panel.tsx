"use client";

import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddToCartButton } from "@/components/products/add-to-cart-button";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { useAddToCart } from "@/hooks/use-cart";
import { cartConfig } from "@/lib/config";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

export function PurchasePanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddToCart();
  const router = useRouter();

  const buyNow = () => {
    if (addToCart(product, quantity)) router.push("/cart");
  };

  return (
    <div className="space-y-4 rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-wider text-ink-faint uppercase">Quantity</p>
          <p className="text-sm text-ink-soft">
            Total <span className="font-semibold text-ink tabular-nums">{formatPrice(product.price * quantity)}</span>
          </p>
        </div>
        <QuantityStepper value={quantity} onChange={setQuantity} max={cartConfig.maxQuantity} />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <AddToCartButton product={product} quantity={quantity} size="lg" fullWidth />
        <Button variant="outline" size="lg" fullWidth onClick={buyNow}>
          <Zap className="size-4.5" />
          Buy now
        </Button>
      </div>
    </div>
  );
}
