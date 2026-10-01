import { cartConfig } from "@/lib/config";

const MESSAGES = [
  `Free shipping on orders over $${cartConfig.freeShippingThreshold}`,
  "30-day no-fuss returns",
  "Hand-picked catalogue, refreshed weekly",
  "Secure checkout",
];

/** Decorative marquee; content is duplicated for a seamless loop and hidden from assistive tech. */
export function AnnouncementBar() {
  const items = [...MESSAGES, ...MESSAGES];
  return (
    <div className="overflow-hidden bg-pine-900 py-2 text-xs font-semibold text-citron-200">
      <p className="sr-only">{MESSAGES.join(". ")}</p>
      <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]" aria-hidden>
        {items.map((message, index) => (
          <span key={index} className="flex items-center gap-10 whitespace-nowrap">
            {message}
            <span className="size-1.5 rounded-full bg-persimmon-400" />
          </span>
        ))}
      </div>
    </div>
  );
}
