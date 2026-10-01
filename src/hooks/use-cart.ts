"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-provider";
import { computeCartTotals, useCartStore } from "@/store/cart-store";
import type { CartProduct, CartTotals } from "@/types/cart";
import type { Product } from "@/types/product";

const subscribeHydration = (onChange: () => void) => useCartStore.persist.onFinishHydration(onChange);

/** True once the persisted cart has been read from localStorage. */
export function useCartHydrated(): boolean {
  return useSyncExternalStore(
    subscribeHydration,
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );
}

export function useCartTotals(): CartTotals {
  const items = useCartStore((state) => state.items);
  return useMemo(() => computeCartTotals(items), [items]);
}

export function toCartProduct({ id, title, price, image, category }: Product | CartProduct): CartProduct {
  return { id, title, price, image, category };
}

/**
 * Adds to cart for signed-in users; guests are sent to login and returned afterwards.
 * Returns whether the item was added.
 */
export function useAddToCart() {
  const { isAuthenticated } = useAuth();
  const addItem = useCartStore((state) => state.addItem);
  const openDrawer = useCartStore((state) => state.openDrawer);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useCallback(
    (product: Product | CartProduct, quantity = 1): boolean => {
      if (!isAuthenticated) {
        const qs = searchParams.toString();
        const next = `${pathname}${qs ? `?${qs}` : ""}`;
        toast("Sign in to start your cart", { description: "We'll bring you right back here afterwards." });
        router.push(`/login?next=${encodeURIComponent(next)}`);
        return false;
      }
      addItem(toCartProduct(product), quantity);
      toast.success("Added to your bag", {
        description: `${quantity} × ${product.title}`,
        action: { label: "View bag", onClick: openDrawer },
      });
      return true;
    },
    [isAuthenticated, addItem, openDrawer, router, pathname, searchParams],
  );
}
