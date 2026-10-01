import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { Container } from "@/components/ui/container";
import { safeRedirectPath } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Kosha account to start your bag.",
  robots: { index: false, follow: true },
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  const redirectTo = safeRedirectPath(Array.isArray(next) ? next[0] : next);
  const isFromCart = redirectTo !== "/products";

  return (
    <Container className="py-8 sm:py-14">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-line bg-surface shadow-lift lg:grid-cols-[1.05fr_1fr]">
        <aside className="hidden bg-pine-800 p-10 text-white lg:flex lg:flex-col lg:gap-10">
          <div className="space-y-4">
            <p className="text-xs font-bold tracking-[0.18em] text-citron-300 uppercase">Members get more</p>
            <h2 className="text-4xl leading-tight font-extrabold">
              Your bag, saved <span className="text-citron-300 italic">and ready</span> whenever you are.
            </h2>
          </div>

          <ul className="space-y-3 text-sm text-pine-100">
            {["Your bag is kept between visits", "Add to bag from anywhere in the shop", "Pick up right where you left off"].map(
              (perk) => (
                <li key={perk} className="flex items-center gap-3">
                  <span className="size-1.5 rounded-full bg-persimmon-400" />
                  {perk}
                </li>
              ),
            )}
          </ul>

        </aside>

        <section className="p-6 sm:p-10">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-extrabold sm:text-4xl">Welcome back</h1>
            <p className="text-ink-soft">
              {isFromCart ? "Sign in to add items and view your bag." : "Sign in to your account to continue."}
            </p>
          </div>
          <LoginForm redirectTo={redirectTo} />
        </section>
      </div>
    </Container>
  );
}
