"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  side?: "left" | "right";
  className?: string;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/** Accessible slide-over panel: focus trap, Escape to close, scroll lock, focus restore. */
export function Drawer({ open, onClose, title, children, footer, side = "right", className }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panel) return;
      const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return (
    <div className={cn("fixed inset-0 z-50", !open && "pointer-events-none")} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-pine-900/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        inert={!open}
        className={cn(
          "absolute inset-y-0 flex w-full max-w-md flex-col bg-canvas transition-[transform,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          side === "right" ? "right-0" : "left-0",
          open
            ? "visible translate-x-0 shadow-drawer"
            : cn("invisible", side === "right" ? "translate-x-full" : "-translate-x-full"),
          className,
        )}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id={titleId} className="text-lg font-bold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full text-ink-soft transition hover:bg-sunken hover:text-ink"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer && <footer className="border-t border-line bg-surface px-5 py-4">{footer}</footer>}
      </div>
    </div>
  );
}
