"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

export interface Debounced<Args extends unknown[]> {
  run: (...args: Args) => void;
  cancel: () => void;
}

/** Stable debounced wrapper around `callback`; pending calls are cancelled on unmount. */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs: number,
): Debounced<Args> {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => clearTimeout(timerRef.current), []);

  const run = useCallback(
    (...args: Args) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callbackRef.current(...args), delayMs);
    },
    [delayMs],
  );

  useEffect(() => cancel, [cancel]);

  return useMemo(() => ({ run, cancel }), [run, cancel]);
}
