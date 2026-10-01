export const siteConfig = {
  name: "Kosha",
  tagline: "Curated goods, honestly priced.",
  description:
    "Kosha is a curated storefront for electronics, jewellery and apparel. Browse, filter and shop a hand-picked catalogue.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const apiConfig = {
  baseUrl: process.env.FAKESTORE_API_URL ?? "https://fakestoreapi.com",
  timeoutMs: 10_000,
  /** Seconds that catalogue responses are cached on the server. */
  revalidateSeconds: 300,
} as const;

export const catalogConfig = {
  pageSize: 8,
} as const;

export const authConfig = {
  sessionCookie: "kosha_session",
  sessionMaxAgeSeconds: 60 * 60 * 24 * 7,
} as const;

export const cartConfig = {
  maxQuantity: 10,
  freeShippingThreshold: 100,
  shippingFee: 7.5,
} as const;
