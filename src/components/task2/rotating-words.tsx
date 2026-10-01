"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

interface RotatingWordsProps {
  words: readonly string[];
  intervalMs?: number;
  className?: string;
}

const LINE_HEIGHT = 62.4;
const STACK_GAP = 26;
const STRIDE = LINE_HEIGHT + STACK_GAP;
const TRANSITION_MS = 300;

/*
 * Each row is a mask over a vertical stack of all words (the Figma "animate" component).
 * Mask heights / offsets match the three instances: 53px top-aligned, 53px centred, 66px bottom-aligned.
 */
const ROWS = [
  { height: 53, offset: 0 },
  { height: 53, offset: -4.7 },
  { height: 66, offset: 66 - LINE_HEIGHT },
] as const;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia(REDUCED_MOTION).matches, () => false);
}

/** Rotates the word list every few seconds; each row slides to its next word (smart-animate, 0.3s ease-out). */
export function RotatingWords({ words, intervalMs = 3000, className }: RotatingWordsProps) {
  const [tick, setTick] = useState(0);
  const [animating, setAnimating] = useState(true);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTick((value) => value + 1);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  // After a full cycle, jump back to the start without animating so the stack never runs out.
  useEffect(() => {
    if (tick < words.length) return;
    const timer = setTimeout(() => {
      setAnimating(false);
      setTick(0);
    }, TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [tick, words.length]);

  const stack = [...words, ...words];

  return (
    <div className={cn("flex flex-col gap-[35px] max-sm:[zoom:0.7]", className)}>
      <p className="sr-only">{words.join(", ")}</p>
      {ROWS.map((row, index) => (
        <div key={index} aria-hidden className="relative overflow-hidden" style={{ height: row.height }}>
          <div
            className={cn(
              "flex flex-col gap-[26px]",
              animating && !reducedMotion && "transition-transform duration-300 ease-out",
            )}
            style={{ transform: `translateY(${row.offset - (index + tick) * STRIDE}px)` }}
          >
            {stack.map((word, wordIndex) => (
              <span
                key={wordIndex}
                className="block font-oakes text-[52px] leading-[62.4px] font-bold tracking-[-0.52px] whitespace-nowrap text-t2-ink"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
