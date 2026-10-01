import type { Product } from "./product";

/** Snapshot of the product fields the cart needs, so it renders without refetching. */
export type CartProduct = Pick<Product, "id" | "title" | "price" | "image" | "category">;

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
}
