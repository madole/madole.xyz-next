import { useCallback, useEffect, useState } from "react";
import {
  hasFoundRocket,
  hasHintedThisSession,
  markHintedThisSession,
} from "./rocketDiscovery";

/**
 * What the banner says, and what the live region announces.
 *
 * It lives here rather than in HintRocket because the homepage needs the words
 * too: a static import from HintRocket would pull that whole module - three,
 * the ship geometry, the banner artwork - back into the first load and quietly
 * undo the code splitting.
 */
export const HINT_TEXT = "Type 'rocket'";

/**
 * How long to leave someone alone before advertising the easter egg.
 *
 * TEMPORARY: lowered from 25s to 5s while the hint is being worked on. Put it
 * back to 25_000 before this ships.
 */
const DELAY_MS = 5_000;
/** How often to re-check once the delay has passed but conditions are not right. */
const RECHECK_MS = 2_000;
/** The hero must still be roughly on screen, measured against the viewport. */
const HERO_SCROLL_FRACTION = 0.5;

/**
 * Add ?rocket-hint to the URL to replay the banner.
 *
 * The two "already seen it" flags are deliberately sticky, which makes the
 * hint awkward to work on: the session flag survives a refresh (sessionStorage
 * lives until the tab closes, not until the page reloads) and the found flag
 * is permanent, so typing the code even once retires the banner on that
 * browser for good. This bypasses both, without setting either, and reports
 * what every gate decided so a hint that still refuses to fly explains itself.
 */
const FORCE_PARAM = "rocket-hint";

function isForced(): boolean {
  try {
    return new URLSearchParams(window.location.search).has(FORCE_PARAM);
  } catch {
    return false;
  }
}

/**
 * Decides whether the banner rocket should fly, and when.
 *
 * The gates matter more than the timing:
 *
 * - Coarse pointers never see it. The easter egg needs a keyboard, so
 *   advertising it to someone on a phone promises what it cannot deliver.
 * - Reduced motion never sees it, matching the background view it flies in,
 *   which is hidden under that preference anyway.
 * - Anyone who has already flown the rocket never sees it again.
 * - At most once per session, and only while the tab is actually visible and
 *   the hero is still on screen. Without the visibility check the one pass
 *   would run down in a background tab, where rAF is throttled, and be wasted.
 *
 * Nothing here is heavier than a timer and a couple of matchMedia calls, which
 * matters because - unlike the rocket itself - this runs on every homepage
 * load.
 */
export function useRocketHint(suppressed: boolean): {
  hintFlying: boolean;
  onHintDone: () => void;
} {
  const [state, setState] = useState<"idle" | "flying" | "done">("idle");

  useEffect(() => {
    if (state !== "idle") return;
    // The rocket is already out, so there is nothing left to advertise.
    if (suppressed) {
      setState("done");
      return;
    }

    const forced = isForced();
    const wantsMotion = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const found = hasFoundRocket();
    const hinted = hasHintedThisSession();

    if (forced) {
      // eslint-disable-next-line no-console
      console.info("[rocket-hint] gates", {
        finePointer,
        wantsMotion,
        alreadyFound: found,
        alreadyHintedThisSession: hinted,
        note: "found/hinted are bypassed by ?rocket-hint",
      });
    }

    if (!wantsMotion || !finePointer || (!forced && (found || hinted))) {
      setState("done");
      return;
    }

    let recheck: ReturnType<typeof setInterval> | undefined;

    const readyToFly = () =>
      document.visibilityState === "visible" &&
      window.scrollY < window.innerHeight * HERO_SCROLL_FRACTION;

    const attempt = () => {
      if (!readyToFly()) return;
      if (recheck) clearInterval(recheck);
      // Not recorded when forced, so repeated refreshes keep replaying it.
      if (!forced) markHintedThisSession();
      setState("flying");
    };

    const delay = setTimeout(() => {
      attempt();
      // Still not a good moment - wait for one rather than giving up.
      if (!readyToFly()) recheck = setInterval(attempt, RECHECK_MS);
    }, DELAY_MS);

    return () => {
      clearTimeout(delay);
      if (recheck) clearInterval(recheck);
    };
  }, [state, suppressed]);

  // Typing the code mid-flight retires the banner: the real rocket is better.
  useEffect(() => {
    if (suppressed && state === "flying") setState("done");
  }, [suppressed, state]);

  const onHintDone = useCallback(() => setState("done"), []);

  return { hintFlying: state === "flying", onHintDone };
}

export default useRocketHint;
