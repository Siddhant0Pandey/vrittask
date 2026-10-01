import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-pine-700 text-white hover:bg-pine-800 shadow-[inset_0_1px_0_rgb(255_255_255/0.12)]",
  accent: "bg-persimmon-500 text-white hover:bg-persimmon-600 shadow-[inset_0_1px_0_rgb(255_255_255/0.18)]",
  citron: "bg-citron-300 text-pine-900 hover:bg-citron-400",
  outline: "border border-line-strong bg-surface text-ink hover:border-ink hover:bg-white",
  ghost: "text-ink-soft hover:bg-sunken hover:text-ink",
  inverse: "bg-white text-pine-900 hover:bg-citron-200",
} as const;

const sizes = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2.5",
  icon: "size-10 justify-center",
} as const;

export interface ButtonStyleProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  fullWidth?: boolean;
}

export function buttonStyles({ variant = "primary", size = "md", fullWidth }: ButtonStyleProps = {}): string {
  return cn(
    "inline-flex shrink-0 items-center justify-center rounded-full font-semibold whitespace-nowrap",
    "transition-[background-color,border-color,color,transform,box-shadow] duration-200 active:scale-[0.97]",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
  );
}

export type ButtonProps = ComponentProps<"button"> & ButtonStyleProps;

export function Button({ variant, size, fullWidth, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonStyles({ variant, size, fullWidth }), className)} {...props} />;
}

export type ButtonLinkProps = ComponentProps<typeof Link> & ButtonStyleProps;

export function ButtonLink({ variant, size, fullWidth, className, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonStyles({ variant, size, fullWidth }), className)} {...props} />;
}
