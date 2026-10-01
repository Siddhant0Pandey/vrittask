"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

export interface CarouselSlide {
  src: string;
  alt: string;
}

interface DragCarouselProps {
  slides: readonly CarouselSlide[];
  className?: string;
}

/** Figma: the progress thumb is 293px of the 1218px track. */
const THUMB_RATIO = 293 / 1218;
/** Resting position of the "Drag" cursor, as a fraction of the 1218 × 569 viewport. */
const CURSOR_REST = { x: (543 + 66) / 1218, y: (219 + 66) / 569 };
const DRAG_THRESHOLD_PX = 4;
const SWIPE_THRESHOLD_PX = 80;

interface DragState {
  pointerId: number;
  startX: number;
  startScroll: number;
  moved: boolean;
}

export function DragCarousel({ slides, className }: DragCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const [progress, setProgress] = useState(0);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const updateProgress = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setProgress(max > 0 ? track.scrollLeft / max : 0);
  }, []);

  useEffect(() => {
    updateProgress();
    window.addEventListener("resize", updateProgress);
    return () => window.removeEventListener("resize", updateProgress);
  }, [updateProgress]);

  /**
   * Settles on a slide after a drag so the carousel never rests half-way: a deliberate
   * swipe moves one slide in the drag direction, a tiny one returns to the nearest.
   */
  const settle = (delta: number) => {
    const track = trackRef.current;
    if (!track) return;
    const offsets = Array.from(track.children, (child) => (child as HTMLElement).offsetLeft - track.offsetLeft);
    const { scrollLeft } = track;
    let target = offsets.reduce((best, offset) =>
      Math.abs(offset - scrollLeft) < Math.abs(best - scrollLeft) ? offset : best,
    );
    if (Math.abs(delta) > SWIPE_THRESHOLD_PX) {
      target =
        delta < 0
          ? (offsets.find((offset) => offset > scrollLeft + 1) ?? offsets[offsets.length - 1])
          : ([...offsets].reverse().find((offset) => offset < scrollLeft - 1) ?? 0);
    }
    track.scrollTo({ left: target, behavior: "smooth" });
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    // Touch and pen keep native momentum scrolling; mouse gets click-and-drag.
    if (event.pointerType !== "mouse" || event.button !== 0 || !trackRef.current) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: trackRef.current.scrollLeft,
      moved: false,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") {
      const rect = event.currentTarget.getBoundingClientRect();
      setCursor({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    }
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag || !track || drag.pointerId !== event.pointerId) return;
    const delta = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(delta) > DRAG_THRESHOLD_PX) {
      drag.moved = true;
      setIsDragging(true);
      track.setPointerCapture(event.pointerId);
    }
    if (drag.moved) track.scrollLeft = drag.startScroll - delta;
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    dragRef.current = null;
    setIsDragging(false);
    if (drag?.moved) settle(event.clientX - drag.startX);
  };

  const cursorStyle = cursor
    ? { left: cursor.x, top: cursor.y }
    : { left: `${CURSOR_REST.x * 100}%`, top: `${CURSOR_REST.y * 100}%` };

  return (
    <div className={cn("flex flex-col gap-[59px]", className)}>
      <div
        className="relative pointer-fine:cursor-none"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setCursor(null)}
      >
        <div
          ref={trackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Project gallery"
          tabIndex={0}
          onScroll={updateProgress}
          onPointerDown={handlePointerDown}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          // Bleed off the right edge of the page like the Figma frame.
          className={cn(
            "scrollbar-none mr-[calc(50%-50vw)] flex gap-5 overflow-x-auto overscroll-x-contain rounded-l-[21.2px] select-none focus-visible:outline-offset-4",
            !isDragging && "snap-x snap-mandatory pointer-fine:snap-none",
          )}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
              className="relative aspect-[1012/569] w-[85vw] shrink-0 snap-start overflow-hidden rounded-[21.2px] bg-[#e1e1e1] lg:w-[min(1012px,80vw)]"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                draggable={false}
                priority={index === 0}
                sizes="(min-width: 1024px) 1012px, 85vw"
                className="pointer-events-none object-cover"
              />
            </div>
          ))}
        </div>

        <div
          aria-hidden
          style={cursorStyle}
          className={cn(
            "pointer-events-none absolute z-10 hidden size-[132px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-t2-chip pointer-fine:grid",
            "font-ui text-base leading-[19.2px] font-semibold text-t2-text",
            "transition-[scale,left,top] ease-out",
            cursor ? "duration-[50ms]" : "duration-500",
            isDragging && "scale-90",
          )}
        >
          Drag
        </div>
      </div>

      <div aria-hidden className="relative h-[7px] w-full overflow-hidden rounded-[50px] bg-t2-track">
        <div
          className="absolute inset-y-0 rounded-[50px] bg-t2-thumb"
          style={{ width: `${THUMB_RATIO * 100}%`, left: `${progress * (1 - THUMB_RATIO) * 100}%` }}
        />
      </div>
    </div>
  );
}
