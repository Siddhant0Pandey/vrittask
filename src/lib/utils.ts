import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const currencyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatPrice(amount: number): string {
  return currencyFormatter.format(amount);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Restricts redirect targets to same-origin paths to prevent open redirects. */
export function safeRedirectPath(path: string | null | undefined, fallback = "/products"): string {
  return path && path.startsWith("/") && !path.startsWith("//") ? path : fallback;
}
