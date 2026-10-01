"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface CourseStat {
  id: string;
  count: string;
  title: string;
  description: string;
  /** Width of the description in the expanded card, so it wraps like the Figma. */
  descriptionWidth: number;
}

/** Tech icons in the expanded card: exported SVG sizes and their Figma centre points. */
const ICONS = [
  { src: "/task2/icon-react.svg", width: 94, height: 94, x: 112.5, y: 172.5 },
  { src: "/task2/icon-social.svg", width: 126, height: 126, x: 243, y: 173 },
  { src: "/task2/icon-vue.svg", width: 116, height: 130, x: 360.5, y: 172.5 },
  { src: "/task2/icon-design.svg", width: 89, height: 71, x: 481, y: 173 },
] as const;

/** Figma smart-animate "ease-in-and-out-back", 1s. */
const EASE_BACK = "duration-1000 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]";

function ArrowRight() {
  return (
    <svg viewBox="0 0 20 20" className="size-5" fill="none" aria-hidden>
      <path d="M3.5 10h13M11 4.5l5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Plus({ className }: { className: string }) {
  return (
    <span aria-hidden className={cn("absolute font-nohemi text-[64px] leading-[76.8px] font-bold", className)}>
      +
    </span>
  );
}

function ExpandedContent({ stat }: { stat: CourseStat }) {
  return (
    <>
      {/* Desktop: absolute positions taken from the Figma "active" variant. */}
      <div className="hidden xl:block">
        {ICONS.map((icon) => (
          <Image
            key={icon.src}
            src={icon.src}
            alt=""
            width={icon.width}
            height={icon.height}
            unoptimized
            className="absolute max-w-none -translate-x-1/2 -translate-y-1/2"
            style={{ left: icon.x, top: icon.y }}
          />
        ))}
        <div className="absolute inset-x-0 top-[283px] flex items-center justify-center gap-6">
          <p className="relative h-[138px] font-nohemi text-[150px] leading-[180px] font-bold text-t2-blush">
            {stat.count}
            <Plus className="top-[-8px] left-[calc(100%-13px)] text-white" />
          </p>
          <div className="flex flex-col gap-3 text-t2-blush">
            <h3 className="font-outfit text-[32px] leading-[40.3px] font-bold whitespace-nowrap">{stat.title}</h3>
            <p className="font-outfit text-lg leading-[22.7px]" style={{ width: stat.descriptionWidth }}>
              {stat.description}
            </p>
          </div>
        </div>
      </div>

      {/* Tablet / mobile: stacked version of the same content. */}
      <div className="flex h-full flex-col justify-end gap-8 p-6 pt-20 sm:p-10 sm:pt-24 xl:hidden">
        <div className="flex items-center gap-4 sm:gap-8">
          {ICONS.map((icon) => (
            <Image key={icon.src} src={icon.src} alt="" width={icon.width} height={icon.height} unoptimized className="h-12 w-auto sm:h-16" />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-t2-blush">
          <p className="relative font-nohemi text-[96px] leading-none font-bold sm:text-[120px]">
            {stat.count}
            <Plus className="-top-3 left-[calc(100%-6px)] text-[44px] leading-none text-white" />
          </p>
          <div className="flex flex-col gap-2 pl-4">
            <h3 className="font-outfit text-2xl leading-tight font-bold sm:text-[32px]">{stat.title}</h3>
            <p className="max-w-[260px] font-outfit text-base leading-snug sm:text-lg">{stat.description}</p>
          </div>
        </div>
      </div>
    </>
  );
}

function CollapsedContent({ stat }: { stat: CourseStat }) {
  return (
    <>
      {/* Desktop: title + description rotated -90° (reads bottom-to-top), number below. */}
      <div className="hidden h-full flex-col items-center gap-6 pt-[41px] text-t2-crimson xl:flex">
        {/* A horizontal 218 × 138 block rotated -90° into a 138 × 218 slot (vertical writing-mode mangles punctuation). */}
        <div className="relative h-[218px] w-[138px] shrink-0">
          <div className="absolute top-1/2 left-1/2 flex h-[138px] w-[218px] -translate-x-1/2 -translate-y-1/2 -rotate-90 flex-col gap-3">
            <h3 className="font-outfit text-[32px] leading-[40.3px] font-bold">{stat.title}</h3>
            <p className="font-outfit text-lg leading-[22.7px]">{stat.description}</p>
          </div>
        </div>
        <p className="relative font-nohemi text-[150px] leading-[180px] font-bold">
          {stat.count}
          <Plus className="top-[-24px] left-[calc(100%-17px)]" />
        </p>
      </div>

      {/* Tablet / mobile: horizontal summary row. */}
      <div className="flex h-full items-center justify-between gap-4 px-6 text-t2-crimson sm:px-10 xl:hidden">
        <div className="min-w-0">
          <h3 className="font-outfit text-xl leading-tight font-bold sm:text-2xl">{stat.title}</h3>
          <p className="mt-1 font-outfit text-sm leading-snug sm:text-base">{stat.description}</p>
        </div>
        <p className="relative shrink-0 pr-5 font-nohemi text-[64px] leading-none font-bold sm:text-[80px]">
          {stat.count}
          <Plus className="-top-2 right-0 text-[32px] leading-none" />
        </p>
      </div>
    </>
  );
}

interface StatCardProps {
  stat: CourseStat;
  active: boolean;
  onSelect: () => void;
}

function StatCard({ stat, active, onSelect }: StatCardProps) {
  return (
    <li
      className={cn(
        "group/card relative transition-[height,flex-grow]",
        EASE_BACK,
        active ? "h-[400px] xl:flex-[592_1_0%]" : "h-[150px] sm:h-[170px] xl:flex-[280_1_0%]",
        "xl:h-[461px]",
      )}
    >
      {!active && (
        <Image
          src="/task2/click-me.png"
          alt=""
          width={63}
          height={48}
          className="pointer-events-none absolute -top-12 left-[135px] hidden opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 xl:block"
        />
      )}

      {/*
        The card colour flips instantly to crimson when expanding (the shrinking circle reveals it)
        and to blush only once the growing circle has covered it, so no red fringe shows on the corners.
      */}
      <div
        className={cn(
          "relative h-full overflow-hidden rounded-[32px] transition-[background-color] duration-0",
          active ? "bg-t2-crimson" : "bg-t2-blush delay-1000",
        )}
      >
        {/* The blush circle grows to cover the card when collapsed and shrinks to a dot when expanded. */}
        <span
          aria-hidden
          className={cn(
            "absolute rounded-full bg-t2-blush transition-all",
            EASE_BACK,
            active
              ? "bottom-[-7px] left-[-8px] size-[15px]"
              : "bottom-[-100vw] left-[-50vw] size-[200vw] xl:bottom-[-64px] xl:left-[-122px] xl:size-[596px]",
          )}
        />

        <div
          aria-hidden={!active}
          className={cn(
            "absolute inset-0 transition-opacity",
            active ? "opacity-100 delay-500 duration-500" : "pointer-events-none opacity-0 duration-200",
          )}
        >
          <ExpandedContent stat={stat} />
        </div>

        <div
          aria-hidden={active}
          className={cn(
            "absolute inset-0 transition-opacity",
            active ? "pointer-events-none opacity-0 duration-200" : "opacity-100 delay-500 duration-500",
          )}
        >
          <CollapsedContent stat={stat} />
        </div>

        <button
          type="button"
          onClick={onSelect}
          aria-pressed={active}
          aria-label={`${stat.count}+ ${stat.title}`}
          className={cn("absolute inset-0 z-10 rounded-[32px] focus-visible:outline-offset-4", active ? "cursor-default" : "cursor-pointer")}
        />

        {active && (
          <a
            href="#courses"
            className="absolute top-6 right-6 z-20 flex animate-[fade-up_0.5s_0.5s_both] items-center gap-2 font-outfit text-lg leading-[22.7px] font-semibold text-t2-blush transition-[gap] duration-500 ease-out hover:gap-4 sm:top-10 sm:right-10 xl:right-[38px]"
          >
            View all Courses
            <ArrowRight />
          </a>
        )}
      </div>
    </li>
  );
}

/** Figma component "stats": one expanded card, the rest collapsed; clicking swaps them. */
export function CourseStats({ stats, defaultActiveId }: { stats: readonly CourseStat[]; defaultActiveId?: string }) {
  const [activeId, setActiveId] = useState(defaultActiveId ?? stats[0]?.id);

  return (
    <ul className="flex flex-col gap-5 xl:flex-row xl:gap-8">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} active={stat.id === activeId} onSelect={() => setActiveId(stat.id)} />
      ))}
    </ul>
  );
}
