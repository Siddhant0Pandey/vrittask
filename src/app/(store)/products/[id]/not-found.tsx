import { PackageSearch } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { StateMessage } from "@/components/ui/state-message";

export default function ProductNotFound() {
  return (
    <Container className="py-16">
      <StateMessage
        icon={PackageSearch}
        title="This product has wandered off"
        description="It may have been removed, or the link might be incorrect. Plenty more to discover in the catalogue."
        action={<ButtonLink href="/products">Back to the shop</ButtonLink>}
      />
    </Container>
  );
}
