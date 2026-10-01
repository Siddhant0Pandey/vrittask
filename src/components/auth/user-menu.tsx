"use client";

import { LogOut, ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { logoutAction } from "@/actions/auth";
import { ButtonLink } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useAuth } from "./auth-provider";

export function UserMenu() {
  const { user } = useAuth();
  const pathname = usePathname();
  const clearCart = useCartStore((state) => state.clear);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  if (!user) {
    const next = pathname === "/login" ? "" : `?next=${encodeURIComponent(pathname)}`;
    return (
      <ButtonLink href={`/login${next}`} variant="outline" size="md" className="h-11">
        <UserRound className="size-4" />
        <span className="hidden sm:inline">Sign in</span>
      </ButtonLink>
    );
  }

  const logout = () =>
    startTransition(async () => {
      // The cart belongs to the signed-in session, so it is cleared on sign-out.
      clearCart();
      await logoutAction();
    });

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-11 items-center gap-2 rounded-full border border-line-strong bg-surface pr-4 pl-1.5 text-sm font-semibold transition hover:border-ink"
      >
        <span className="grid size-8 place-items-center rounded-full bg-citron-300 font-display text-sm font-bold text-pine-900 uppercase">
          {user.username.charAt(0)}
        </span>
        <span className="hidden max-w-28 truncate sm:inline">{user.username}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 origin-top-right animate-fade-up rounded-2xl border border-line bg-surface p-2 shadow-lift"
        >
          <div className="px-3 py-2">
            <p className="text-xs text-ink-faint">Signed in as</p>
            <p className="truncate font-semibold">{user.username}</p>
          </div>
          <div className="my-1 h-px bg-line" />
          <Link
            href="/cart"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-sunken"
          >
            <ShoppingBag className="size-4 text-ink-soft" /> Your bag
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={logout}
            disabled={isPending}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-persimmon-700 hover:bg-persimmon-50 disabled:opacity-60"
          >
            <LogOut className="size-4" /> {isPending ? "Signing out…" : "Sign out"}
          </button>
        </div>
      )}
    </div>
  );
}
