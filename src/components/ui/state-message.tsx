import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StateMessageProps {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  tone?: "neutral" | "danger";
  className?: string;
}

/** Shared layout for empty, error and not-found states. */
export function StateMessage({ icon: Icon, title, description, action, tone = "neutral", className }: StateMessageProps) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn(
        "flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-line-strong bg-surface/60 px-6 py-16 text-center",
        className,
      )}
    >
      <div
        className={cn(
          "mb-5 grid size-16 place-items-center rounded-2xl rotate-3",
          tone === "danger" ? "bg-persimmon-100 text-persimmon-600" : "bg-citron-200 text-pine-800",
        )}
      >
        <Icon className="size-7 -rotate-3" strokeWidth={1.75} />
      </div>
      <h2 className="text-xl font-bold text-ink sm:text-2xl">{title}</h2>
      {description && <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft sm:text-base">{description}</p>}
      {action && <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{action}</div>}
    </div>
  );
}
