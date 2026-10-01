import { RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { cartConfig } from "@/lib/config";

const PERKS = [
  { Icon: Truck, title: "Free shipping", text: `On orders over $${cartConfig.freeShippingThreshold}` },
  { Icon: RotateCcw, title: "30-day returns", text: "No questions asked" },
  { Icon: ShieldCheck, title: "Secure checkout", text: "Encrypted payments" },
] as const;

export function ProductPerks() {
  return (
    <ul className="grid grid-cols-3 gap-2">
      {PERKS.map(({ Icon, title, text }) => (
        <li key={title} className="rounded-2xl bg-sunken/70 p-3 text-center sm:p-4">
          <Icon className="mx-auto mb-2 size-5 text-pine-600" />
          <p className="text-xs font-bold text-ink sm:text-sm">{title}</p>
          <p className="mt-0.5 text-[11px] text-ink-faint sm:text-xs">{text}</p>
        </li>
      ))}
    </ul>
  );
}
