"use client";

import Image from "next/image";
import { useState, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

/** Product image with a pointer-following magnifier on devices that support hover. */
export function ProductGallery({ src, alt }: { src: string; alt: string }) {
  const [origin, setOrigin] = useState<string | null>(null);

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div
      onPointerMove={handleMove}
      onPointerLeave={() => setOrigin(null)}
      className="relative aspect-square cursor-zoom-in overflow-hidden rounded-[2rem] border border-line bg-white shadow-soft"
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(min-width: 1024px) 50vw, 100vw"
        style={origin ? { transformOrigin: origin } : undefined}
        className={cn("object-contain p-10 transition-transform duration-300 ease-out sm:p-16", origin && "scale-[1.8]")}
      />
      <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ink px-3 py-1 text-xs font-medium text-white opacity-0 transition-opacity [@media(hover:hover)]:opacity-100">
        {origin ? "Move to explore" : "Hover to zoom"}
      </span>
    </div>
  );
}
