/**
 * Whether this visitor has already met the hidden rocket.
 *
 * Storage is wrapped because it is not always there to be read: Safari's
 * private mode has historically thrown on write, and a sandboxed iframe throws
 * on access. A failure here only means the hint may show again, so every path
 * degrades to "not found yet" rather than breaking the page.
 */

/** Survives across visits: once you have flown it, the hint retires for good. */
const FOUND_KEY = "madole:rocket-found";
/** Cleared with the tab, so at most one banner per session. */
const HINTED_KEY = "madole:rocket-hinted";

function readFlag(storage: "localStorage" | "sessionStorage", key: string) {
  try {
    return window[storage].getItem(key) !== null;
  } catch {
    return false;
  }
}

function writeFlag(storage: "localStorage" | "sessionStorage", key: string) {
  try {
    window[storage].setItem(key, "1");
  } catch {
    // Nothing to do: the hint may simply show again another time.
  }
}

export const hasFoundRocket = () => readFlag("localStorage", FOUND_KEY);
export const markRocketFound = () => writeFlag("localStorage", FOUND_KEY);
export const hasHintedThisSession = () =>
  readFlag("sessionStorage", HINTED_KEY);
export const markHintedThisSession = () =>
  writeFlag("sessionStorage", HINTED_KEY);
