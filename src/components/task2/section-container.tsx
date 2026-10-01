import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** 1440px artboard; side padding scales to the Figma's 112px (7.78% of 1440). */
export function SectionContainer({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-[1440px] px-[clamp(20px,7.78vw,112px)]", className)} {...props} />;
}
