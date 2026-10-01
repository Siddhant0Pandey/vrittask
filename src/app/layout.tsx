import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import { Providers } from "@/components/providers";
import { siteConfig } from "@/lib/config";
import { getSessionUser } from "@/lib/session";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} — ${siteConfig.tagline}`, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["online store", "electronics", "jewellery", "clothing", "ecommerce"],
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: siteConfig.name, description: siteConfig.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0d2823",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getSessionUser();

  return (
    <html lang="en" className={`${manrope.variable} ${bricolage.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Providers user={user}>{children}</Providers>
      </body>
    </html>
  );
}
