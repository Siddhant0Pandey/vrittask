"use client";

import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { useCartHydrated, useCartTotals } from "@/hooks/use-cart";
import { useCartStore } from "@/store/cart-store";

export function CartButton() {
  const { isAuthenticated } = useAuth();
  const openDrawer = useCartStore((state) => state.openDrawer);
  const { itemCount } = useCartTotals();
  const hydrated = useCartHydrated();
  const router = useRouter();
  const count = isAuthenticated && hydrated ? itemCount : 0;

  return (
    <button
      type="button"
      onClick={() => (isAuthenticated ? openDrawer() : router.push("/login?next=/cart"))}
      aria-label={count > 0 ? `Open bag, ${count} items` : "Open bag"}
      className="relative grid size-11 place-items-center rounded-full bg-ink text-white transition hover:bg-pine-800 active:scale-95"
    >
      <ShoppingBag className="size-5" />
      {count > 0 && (
        <span
          key={count}
          className="absolute -top-1 -right-1 grid h-5 min-w-5 animate-pop place-items-center rounded-full bg-persimmon-500 px-1 text-[11px] font-bold text-white ring-2 ring-canvas tabular-nums"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
