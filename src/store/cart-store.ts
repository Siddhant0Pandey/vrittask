import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { cartConfig } from "@/lib/config";
import type { CartItem, CartProduct, CartTotals } from "@/types/cart";

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
}

interface CartActions {
  addItem: (product: CartProduct, quantity?: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export type CartStore = CartState & CartActions;

const clampQuantity = (quantity: number) => Math.min(Math.max(Math.round(quantity), 1), cartConfig.maxQuantity);

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isDrawerOpen: false,

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: clampQuantity(item.quantity + quantity) }
                  : item,
              ),
            };
          }
          return { items: [...state.items, { product, quantity: clampQuantity(quantity) }] };
        }),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity: clampQuantity(quantity) } : item,
          ),
        })),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((item) => item.product.id !== productId) })),

      clear: () => set({ items: [] }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
    }),
    {
      name: "kosha-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // UI state such as the drawer is intentionally not persisted.
      partialize: (state) => ({ items: state.items }),
      // Rehydrated manually after mount to keep server and client markup identical.
      skipHydration: true,
    },
  ),
);

/** Derives totals from items. Pure, so it can be unit-tested and memoised by callers. */
export function computeCartTotals(items: readonly CartItem[]): CartTotals {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= cartConfig.freeShippingThreshold ? 0 : cartConfig.shippingFee;
  return { itemCount, subtotal, shipping, total: subtotal + shipping };
}

