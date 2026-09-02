import { useEffect, useRef } from "react";

/**
 * Milliseconds of silence before a partially typed sequence is forgotten, so
 * a stray "r" ten minutes ago cannot combine with "ocket" typed now.
 */
const RESET_MS = 1500;

/** Keystrokes aimed at a form control are input, not a secret code. */
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

/**
 * Fires `onMatch` when the user types `sequence` (case-insensitive) with
 * nothing focused. Modifier chords are ignored so Ctrl+R and friends still do
 * what the browser expects, and only printable keys count so arrows, Escape
 * and Shift do not break a sequence in progress.
 *
 * Everything lives in the effect closure: no state, no re-renders, and the
 * whole thing unsubscribes when `enabled` goes false or the page unmounts.
 */
export function useKeySequence(
  sequence: string,
  onMatch: () => void,
  enabled = true,
): void {
  // Latest callback without re-subscribing the listener every render.
  const onMatchRef = useRef(onMatch);
  useEffect(() => {
    onMatchRef.current = onMatch;
  }, [onMatch]);

  useEffect(() => {
    if (!enabled || sequence.length === 0) return;
    const wanted = sequence.toLowerCase();
    let progress = 0;
    let lastKeyAt = 0;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key.length !== 1) return;
      if (isTypingTarget(event.target)) return;

      const now = performance.now();
      if (now - lastKeyAt > RESET_MS) progress = 0;
      lastKeyAt = now;

      const key = event.key.toLowerCase();
      if (key === wanted[progress]) {
        progress += 1;
        if (progress === wanted.length) {
          progress = 0;
          onMatchRef.current();
        }
      } else {
        // A wrong key may still be the start of a fresh attempt.
        progress = key === wanted[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sequence, enabled]);
}

export default useKeySequence;
