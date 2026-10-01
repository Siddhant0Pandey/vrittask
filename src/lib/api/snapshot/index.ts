import "server-only";

import type { Category, Product, SortOrder } from "@/types/product";
import categories from "./categories.json";
import products from "./products.json";
import users from "./users.json";

/**
 * A static copy of the Fake Store API's public demo data, used only when the live API
 * is unavailable. Fake Store sits behind Cloudflare bot protection, which can reject
 * requests from serverless hosts such as Vercel; this keeps the store usable there.
 * Refresh with: curl https://fakestoreapi.com/products > products.json (etc.).
 */

interface SnapshotUser {
  id: number;
  username: string;
  password: string;
}

const productList = products as Product[];
const userList = users as SnapshotUser[];

export const snapshot = {
  products(sort?: SortOrder | null): Product[] {
    // Mirrors the API: `sort` orders by id.
    return sort === "desc" ? [...productList].reverse() : [...productList];
  },
  product(id: number): Product | null {
    return productList.find((product) => product.id === id) ?? null;
  },
  categories(): Category[] {
    return [...(categories as Category[])];
  },
  productsByCategory(category: Category): Product[] {
    return productList.filter((product) => product.category === category);
  },
  /** Returns the matching demo user, mirroring the API's credential check. */
  findUser(username: string, password: string): Omit<SnapshotUser, "password"> | null {
    const user = userList.find((candidate) => candidate.username === username && candidate.password === password);
    return user ? { id: user.id, username: user.username } : null;
  },
};
