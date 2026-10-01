"use client";

import { AlertCircle, ArrowRight, Eye, EyeOff, KeyRound, LoaderCircle } from "lucide-react";
import { useActionState, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LoginFormState } from "@/types/auth";

/** Public sample account documented by the Fake Store API. */
const DEMO_CREDENTIALS = { username: "mor_2314", password: "83r5^_" } as const;

const initialState: LoginFormState = { status: "idle" };

interface FieldProps extends ComponentProps<"input"> {
  label: string;
  error?: string;
  trailing?: ReactNode;
}

function Field({ label, error, trailing, id, className, ...props }: FieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cn(
            "h-12 w-full rounded-xl border bg-surface px-4 text-[15px] text-ink placeholder:text-ink-faint transition",
            "focus:bg-white focus:ring-4 focus:outline-none",
            error
              ? "border-persimmon-500 focus:ring-persimmon-100"
              : "border-line-strong focus:border-pine-600 focus:ring-pine-100",
            trailing && "pr-12",
            className,
          )}
          {...props}
        />
        {trailing && <div className="absolute inset-y-0 right-2 flex items-center">{trailing}</div>}
      </div>
      {error && (
        <p id={errorId} className="text-xs font-medium text-persimmon-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const error = state.status === "error" ? state : null;

  const fillDemo = () => {
    const form = formRef.current;
    if (!form) return;
    (form.elements.namedItem("username") as HTMLInputElement).value = DEMO_CREDENTIALS.username;
    (form.elements.namedItem("password") as HTMLInputElement).value = DEMO_CREDENTIALS.password;
    form.requestSubmit();
  };

  return (
    <div className="space-y-6">
      <form ref={formRef} action={formAction} className="space-y-4" noValidate>
        <input type="hidden" name="redirectTo" value={redirectTo} />

        {error && (
          <div role="alert" className="flex items-start gap-3 rounded-xl bg-persimmon-50 p-3.5 text-sm text-persimmon-700 ring-1 ring-persimmon-100">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {error.message}
          </div>
        )}

        <Field
          id="username"
          name="username"
          label="Username"
          autoComplete="username"
          placeholder="e.g. mor_2314"
          defaultValue={error?.values?.username}
          error={error?.fieldErrors?.username}
          required
        />
        <Field
          id="password"
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="••••••••"
          error={error?.fieldErrors?.password}
          required
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="grid size-9 place-items-center rounded-lg text-ink-faint transition hover:bg-sunken hover:text-ink"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
        />

        <Button type="submit" size="lg" fullWidth disabled={isPending}>
          {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
          {isPending ? "Signing in…" : "Sign in"}
          {!isPending && <ArrowRight className="size-4" />}
        </Button>
      </form>

      <div className="relative text-center text-xs font-semibold tracking-wider text-ink-faint uppercase">
        <span className="relative z-10 bg-canvas px-3">or</span>
        <span className="absolute inset-x-0 top-1/2 h-px bg-line" aria-hidden />
      </div>

      <div className="rounded-2xl border border-dashed border-pine-300 bg-pine-50 p-4">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-citron-300 text-pine-900">
            <KeyRound className="size-4" />
          </span>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-sm font-bold text-pine-900">Test account</p>
            <p className="text-xs text-pine-800">
              <code className="rounded bg-white px-1.5 py-0.5 font-mono">{DEMO_CREDENTIALS.username}</code>
              {" / "}
              <code className="rounded bg-white px-1.5 py-0.5 font-mono">{DEMO_CREDENTIALS.password}</code>
            </p>
          </div>
        </div>
        <Button variant="outline" fullWidth className="mt-3" onClick={fillDemo} disabled={isPending}>
          Sign in with test account
        </Button>
      </div>
    </div>
  );
}
