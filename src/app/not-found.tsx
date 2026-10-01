import { Compass } from "lucide-react";
import { StoreShell } from "@/components/layout/store-shell";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { StateMessage } from "@/components/ui/state-message";

export default function NotFound() {
  return (
    <StoreShell>
      <Container className="py-16">
        <StateMessage
          icon={Compass}
          title="This page doesn't exist"
          description="The link may be broken or the page may have moved. Let's get you back on track."
          action={
            <>
              <ButtonLink href="/products">Browse products</ButtonLink>
              <ButtonLink href="/" variant="outline">
                Go home
              </ButtonLink>
            </>
          }
        />
      </Container>
    </StoreShell>
  );
}
