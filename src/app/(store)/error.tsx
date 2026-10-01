"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { ErrorState } from "@/components/ui/error-state";

export default function RootError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-16">
      <ErrorState
        message="An unexpected error occurred. Please try again — if it keeps happening, come back in a little while."
        onRetry={retry}
      />
    </Container>
  );
}
