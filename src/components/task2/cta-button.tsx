import { cn } from "@/lib/utils";

interface CtaButtonProps {
  label: string;
  /** Label revealed on hover/focus while the pill widens. */
  hoverLabel: string;
  className?: string;
}

/** Figma "CTA_Button [48px]": 106px → 176px on hover with a label swap (0.3s ease-out). */
export function CtaButton({ label, hoverLabel, className }: CtaButtonProps) {
  return (
    <button
      type="button"
      aria-label={hoverLabel}
      className={cn(
        "group relative inline-flex h-12 w-[106px] items-center justify-center overflow-hidden rounded-full bg-t2-blue",
        "font-ui text-base leading-[19.2px] font-semibold text-[#fafafa]",
        "transition-[width,background-color] duration-300 ease-out hover:w-[176px] focus-visible:w-[176px] active:bg-[#0e43c4]",
        className,
      )}
    >
      <span
        aria-hidden
        className="whitespace-nowrap transition duration-300 ease-out group-hover:-translate-y-6 group-hover:opacity-0 group-focus-visible:-translate-y-6 group-focus-visible:opacity-0"
      >
        {label}
      </span>
      <span
        aria-hidden
        className="absolute translate-y-6 whitespace-nowrap opacity-0 transition duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
      >
        {hoverLabel}
      </span>
    </button>
  );
}
