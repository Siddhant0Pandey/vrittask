"use client";

import { ArrowLeft, Lock, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button, ButtonLink } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StateMessage } from "@/components/ui/state-message";
import { useCartHydrated, useCartTotals } from "@/hooks/use-cart";
import { useCartStore } from "@/store/cart-store";
import { CartLineItem } from "./cart-line-item";
import { CartSummary } from "./cart-summary";
import { FreeShippingMeter } from "./free-shipping-meter";

function CartSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]" role="status" aria-label="Loading your bag">
      <div className="space-y-6 rounded-[var(--radius-card)] border border-line bg-surface p-6">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex gap-4">
            <Skeleton className="size-28 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-9 w-28 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-80 rounded-[var(--radius-card)]" />
    </div>
  );
}

export function CartView() {
  const hydrated = useCartHydrated();
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const totals = useCartTotals();

  if (!hydrated) return <CartSkeleton />;

  if (items.length === 0) {
    return (
      <StateMessage
        icon={ShoppingBag}
        title="Your bag is empty"
        description="Looks like you haven't added anything yet. Explore the catalogue and find something you love."
        action={<ButtonLink href="/products">Start shopping</ButtonLink>}
      />
    );
  }

  const checkout = () => {
    toast.success("Order placed — thank you!", {
      description: "This is a demo store, so nothing will be charged or shipped.",
    });
    clear();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
      <section aria-labelledby="bag-items" className="rounded-[var(--radius-card)] border border-line bg-surface px-5 sm:px-7">
        <div className="flex items-center justify-between border-b border-line py-5">
          <h2 id="bag-items" className="text-lg font-bold">
            {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"}
          </h2>
          <button
            type="button"
            onClick={clear}
            className="text-sm font-semibold text-ink-faint underline-offset-4 transition hover:text-persimmon-600 hover:underline"
          >
            Remove all
          </button>
        </div>
        <ul className="divide-y divide-line">
          {items.map((item) => (
            <CartLineItem key={item.product.id} item={item} size="full" />
          ))}
        </ul>
      </section>

      <aside className="space-y-4 lg:sticky lg:top-28">
        <FreeShippingMeter subtotal={totals.subtotal} />
        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-soft">
          <h2 className="mb-5 text-lg font-bold">Order summary</h2>
          <CartSummary totals={totals}>
            <Button variant="accent" size="lg" fullWidth onClick={checkout}>
              <Lock className="size-4" />
              Checkout securely
            </Button>
            <ButtonLink href="/products" variant="ghost" fullWidth>
              <ArrowLeft className="size-4" />
              Continue shopping
            </ButtonLink>
          </CartSummary>
        </div>
      </aside>
    </div>
  );
}
