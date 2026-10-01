import { useEffect, type MutableRefObject } from "react";

const ARROW_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

/** The key that triggers the barrel roll, as a one-shot rather than held. */
const ROLL_KEY = "b";

export interface ArrowKeysOptions {
  /** Which arrow keys are currently held. Read from useFrame, never written there. */
  held: MutableRefObject<Set<string>>;
  /** Set true on the frame a roll starts, so the tween restarts if pressed mid-roll. */
  onRoll: () => void;
  /** Consulted on keydown; return false to ignore input entirely, as when leaving. */
  enabled: () => boolean;
}

/**
 * Tracks the arrow keys as a held set, plus the one-shot barrel roll key.
 *
 * A held set rather than key-repeat events, so movement is frame-rate
 * independent and a tap is never swallowed by the keyboard's repeat delay.
 * Nothing here re-renders: the frame callback reads the ref directly.
 *
 * preventDefault applies only to the arrows, and only while enabled -
 * otherwise the page would stop scrolling for everyone. Nobody sees this
 * before the rocket is activated, because the component holding it is not
 * mounted until the hidden mode turns on.
 *
 * Blur clears the set, because a key held while the window loses focus never
 * sends its keyup and the rocket would fly itself into the corner.
 */
export function useArrowKeys({
  held,
  onRoll,
  enabled,
}: ArrowKeysOptions): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Modifier chords belong to the browser: Ctrl+R and friends still work.
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      if (event.key.toLowerCase() === ROLL_KEY) {
        if (!enabled()) return;
        onRoll();
        return;
      }

      if (!ARROW_KEYS.has(event.key)) return;
      event.preventDefault();
      // Recorded in every phase and consumed only while flying: a key pressed
      // during the launch tween would otherwise never register, since a held
      // key sends no further keydown until it repeats.
      held.current.add(event.key);
    };

    const onKeyUp = (event: KeyboardEvent) => {
      held.current.delete(event.key);
    };
    const onBlur = () => held.current.clear();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [held, onRoll, enabled]);
}
