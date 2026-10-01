"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { ErrorState } from "@/components/ui/error-state";

export default function ProductsError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-16">
      <ErrorState
        title="This page hit a snag"
        message="Something went wrong while loading products. It's usually temporary — please try again."
        onRetry={retry}
      />
    </Container>
  );
}
