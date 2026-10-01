import { Truck } from "lucide-react";
import { cartConfig } from "@/lib/config";
import { formatPrice } from "@/lib/utils";

export function FreeShippingMeter({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(cartConfig.freeShippingThreshold - subtotal, 0);
  const progress = Math.min(subtotal / cartConfig.freeShippingThreshold, 1) * 100;

  return (
    <div className="rounded-2xl bg-pine-50 p-4 ring-1 ring-pine-100">
      <p className="flex items-center gap-2 text-sm font-medium text-pine-900">
        <Truck className="size-4 shrink-0 text-pine-600" />
        {remaining > 0 ? (
          <span>
            You&apos;re <strong>{formatPrice(remaining)}</strong> away from free shipping
          </span>
        ) : (
          <span>
            <strong>Free shipping</strong> unlocked — nice.
          </span>
        )}
      </p>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-white"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        aria-label="Progress towards free shipping"
      >
        <div
          className="h-full rounded-full bg-pine-600 transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
