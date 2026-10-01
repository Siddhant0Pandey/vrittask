import type { Metadata } from "next";
import { Figtree, Outfit, Sora } from "next/font/google";
import type { ReactNode } from "react";

/*
 * The Figma file uses Oakes Grotesk and Nohemi, which are not on Google Fonts.
 * Figtree and Sora are metric-similar stand-ins; to use the originals, swap these for
 * `next/font/local` declarations exporting the same CSS variables.
 */
const oakesStandIn = Figtree({ variable: "--font-oakes-standin", subsets: ["latin"], weight: ["500", "700"] });
const nohemiStandIn = Sora({ variable: "--font-nohemi-standin", subsets: ["latin"], weight: ["700"] });
const outfit = Outfit({ variable: "--font-outfit-family", subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: { absolute: "Services & Courses" },
  description: "Expert design, development and blockchain services, plus trending courses.",
  robots: { index: false, follow: false },
};

export default function Task2Layout({ children }: { children: ReactNode }) {
  return (
    <div className={`${oakesStandIn.variable} ${nohemiStandIn.variable} ${outfit.variable} flex-1 bg-white text-t2-ink`}>
      <main>{children}</main>
    </div>
  );
}
