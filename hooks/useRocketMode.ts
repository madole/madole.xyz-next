import { useCallback, useEffect, useState } from "react";
import { useKeySequence } from "./useKeySequence";

/**
 * off: nothing mounted, nothing listening beyond the sequence hook.
 * on: the rocket chunk is loaded and flying.
 * leaving: the rocket has been told to depart; it unmounts itself via onExited.
 */
export type RocketMode = "off" | "on" | "leaving";

const SEQUENCE = "rocket";

/**
 * Owns the hidden rocket easter egg's lifecycle: typing the sequence toggles
 * it, Escape dismisses it, and the rocket reports back when it has flown off
 * screen so it can be unmounted rather than merely hidden.
 *
 * The background view is display:none under prefers-reduced-motion, so the
 * rocket would be invisible there; the sequence is ignored in that case rather
 * than showing a hint for something that cannot appear.
 */
export function useRocketMode(): {
  mode: RocketMode;
  onExited: () => void;
} {
  const [mode, setMode] = useState<RocketMode>("off");

  const toggle = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    setMode((current) => (current === "off" ? "on" : "leaving"));
  }, []);

  useKeySequence(SEQUENCE, toggle);

  useEffect(() => {
    if (mode !== "on") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMode("leaving");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mode]);

  const onExited = useCallback(() => setMode("off"), []);

  return { mode, onExited };
}

export default useRocketMode;
