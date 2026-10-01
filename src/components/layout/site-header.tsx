import { Suspense } from "react";
import { UserMenu } from "@/components/auth/user-menu";
import { Container } from "@/components/ui/container";
import { CartButton } from "./cart-button";
import { Logo } from "./logo";
import { NavLinks } from "./nav-links";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas">
      <Container className="flex h-18 items-center gap-6">
        <Logo />
        <Suspense>
          <NavLinks className="hidden lg:flex" />
        </Suspense>
        <div className="ml-auto flex items-center gap-2">
          <UserMenu />
          <CartButton />
        </div>
      </Container>
      <Suspense>
        <NavLinks className="scrollbar-none overflow-x-auto border-t border-line/70 px-4 py-2 lg:hidden" />
      </Suspense>
    </header>
  );
}
