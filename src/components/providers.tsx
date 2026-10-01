"use client";

import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth/auth-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { useCartStore } from "@/store/cart-store";
import type { SessionUser } from "@/types/auth";

function CartPersistence() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
    // Keep the cart in sync across browser tabs.
    const onStorage = (event: StorageEvent) => {
      if (event.key === useCartStore.persist.getOptions().name) void useCartStore.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return null;
}

export function Providers({ user, children }: { user: SessionUser | null; children: ReactNode }) {
  return (
    <AuthProvider user={user}>
      <CartPersistence />
      {children}
      {user && <CartDrawer />}
      <Toaster
        position="top-center"
        offset={88}
        toastOptions={{
          classNames: {
            toast: "!rounded-2xl !border-line !bg-surface !shadow-lift !font-sans",
            title: "!font-semibold !text-ink",
            description: "!text-ink-soft",
            actionButton: "!rounded-full !bg-pine-700 !font-semibold",
          },
        }}
      />
    </AuthProvider>
  );
}
