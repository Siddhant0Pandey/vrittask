"use client";

import { ArrowRight, ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { StateMessage } from "@/components/ui/state-message";
import { useCartTotals } from "@/hooks/use-cart";
import { useCartStore } from "@/store/cart-store";
import { CartLineItem } from "./cart-line-item";
import { CartSummary } from "./cart-summary";
import { FreeShippingMeter } from "./free-shipping-meter";

export function CartDrawer() {
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isDrawerOpen);
  const close = useCartStore((state) => state.closeDrawer);
  const totals = useCartTotals();
  const pathname = usePathname();

  // Close when navigating to another page.
  useEffect(() => close(), [pathname, close]);

  return (
    <Drawer
      open={isOpen}
      onClose={close}
      title={
        <span className="flex items-center gap-2">
          Your bag
          {totals.itemCount > 0 && (
            <span className="rounded-full bg-citron-300 px-2 py-0.5 text-xs text-pine-900">{totals.itemCount}</span>
          )}
        </span>
      }
      footer={
        items.length > 0 && (
          <CartSummary totals={totals}>
            <div className="grid gap-2">
              <ButtonLink href="/cart" variant="accent" size="lg" fullWidth>
                Review & checkout <ArrowRight className="size-4" />
              </ButtonLink>
              <Button variant="ghost" fullWidth onClick={close}>
                Keep shopping
              </Button>
            </div>
          </CartSummary>
        )
      }
    >
      {items.length === 0 ? (
        <div className="p-5">
          <StateMessage
            icon={ShoppingBag}
            title="Your bag is empty"
            description="Good things are waiting. Add a few favourites to get started."
            action={
              <ButtonLink href="/products" onClick={close}>
                Browse products
              </ButtonLink>
            }
          />
        </div>
      ) : (
        <div className="space-y-2 p-5">
          <FreeShippingMeter subtotal={totals.subtotal} />
          <ul className="divide-y divide-line">
            {items.map((item) => (
              <CartLineItem key={item.product.id} item={item} onNavigate={close} />
            ))}
          </ul>
        </div>
      )}
    </Drawer>
  );
}
