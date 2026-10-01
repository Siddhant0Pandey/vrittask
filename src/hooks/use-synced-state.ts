"use client";

import { useState } from "react";

/**
 * Local, editable state that resets whenever its external source changes
 * (e.g. an input mirrored from the URL, which back/forward navigation can update).
 */
export function useSyncedState<T>(source: T, isEqual: (a: T, b: T) => boolean = Object.is) {
  const [value, setValue] = useState(source);
  const [previousSource, setPreviousSource] = useState(source);

  // Adjusting state during render is React's recommended alternative to a syncing effect.
  if (!isEqual(source, previousSource)) {
    setPreviousSource(source);
    setValue(source);
  }

  return [value, setValue] as const;
}
