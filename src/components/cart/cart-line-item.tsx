"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Price } from "@/components/ui/price";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { formatCategory } from "@/lib/catalog";
import { cartConfig } from "@/lib/config";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import type { CartItem } from "@/types/cart";

interface CartLineItemProps {
  item: CartItem;
  size?: "compact" | "full";
  onNavigate?: () => void;
}

export function CartLineItem({ item, size = "compact", onNavigate }: CartLineItemProps) {
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const { product, quantity } = item;
  const isFull = size === "full";

  return (
    <li className={cn("flex gap-4", isFull ? "py-6" : "py-4")}>
      <Link
        href={`/products/${product.id}`}
        onClick={onNavigate}
        className={cn(
          "relative shrink-0 overflow-hidden rounded-2xl border border-line bg-white",
          isFull ? "size-24 sm:size-32" : "size-20",
        )}
      >
        <Image src={product.image} alt={product.title} fill sizes="128px" className="object-contain p-3" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-[0.12em] text-pine-600 uppercase">
              {formatCategory(product.category)}
            </p>
            <Link
              href={`/products/${product.id}`}
              onClick={onNavigate}
              className={cn("mt-0.5 line-clamp-2 font-semibold leading-snug hover:text-pine-700", isFull ? "text-base" : "text-sm")}
            >
              {product.title}
            </Link>
          </div>
          <Price amount={product.price * quantity} size={isFull ? "md" : "sm"} className="shrink-0" />
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <QuantityStepper
            value={quantity}
            onChange={(value) => setQuantity(product.id, value)}
            max={cartConfig.maxQuantity}
            size="sm"
            label={`Quantity for ${product.title}`}
          />
          <div className="flex items-center gap-3">
            {quantity > 1 && <span className="hidden text-xs text-ink-faint sm:inline">{formatPrice(product.price)} each</span>}
            <button
              type="button"
              onClick={() => removeItem(product.id)}
              aria-label={`Remove ${product.title}`}
              className="grid size-8 place-items-center rounded-full text-ink-faint transition hover:bg-persimmon-50 hover:text-persimmon-600"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
