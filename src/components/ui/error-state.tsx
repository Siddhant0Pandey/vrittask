"use client";

import { RotateCcw, CloudOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button, ButtonLink } from "./button";
import { StateMessage } from "./state-message";

interface ErrorStateProps {
  title?: string;
  message: string;
  /** Custom retry handler; defaults to re-running the server render. */
  onRetry?: () => void;
  showHomeLink?: boolean;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  showHomeLink = true,
  className,
}: ErrorStateProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const retry = () => startTransition(() => (onRetry ? onRetry() : router.refresh()));

  return (
    <StateMessage
      tone="danger"
      icon={CloudOff}
      title={title}
      description={message}
      className={className}
      action={
        <>
          <Button onClick={retry} disabled={isPending}>
            <RotateCcw className={isPending ? "size-4 animate-spin" : "size-4"} />
            {isPending ? "Retrying…" : "Try again"}
          </Button>
          {showHomeLink && (
            <ButtonLink href="/" variant="outline">
              Go home
            </ButtonLink>
          )}
        </>
      }
    />
  );
}
