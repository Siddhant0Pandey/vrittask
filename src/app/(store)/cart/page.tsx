import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CartView } from "@/components/cart/cart-view";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Your bag",
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  // The proxy handles the common case; this guards against a stale or invalid cookie.
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/cart");

  return (
    <Container className="py-6 sm:py-10">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Your bag", path: "/cart" },
        ]}
      />
      <div className="mt-4 mb-8">
        <h1 className="text-4xl font-extrabold sm:text-5xl">Your bag</h1>
        <p className="mt-2 text-ink-soft">
          Ready when you are, <span className="font-semibold text-ink">{user.username}</span>.
        </p>
      </div>
      <CartView />
    </Container>
  );
}
