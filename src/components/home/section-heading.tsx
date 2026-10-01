import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
}

export function SectionHeading({ id, eyebrow, title, href, linkLabel = "View all" }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold tracking-[0.16em] text-persimmon-600 uppercase">{eyebrow}</p>
        <h2 id={id} className="mt-2 text-3xl font-extrabold sm:text-4xl">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-pine-700 sm:inline-flex"
        >
          {linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
