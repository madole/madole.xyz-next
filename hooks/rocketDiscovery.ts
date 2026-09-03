/**
 * Whether this visitor has already met the hidden rocket.
 *
 * Storage is wrapped because it is not always there to be read: Safari's
 * private mode has historically thrown on write, and a sandboxed iframe throws
 * on access. A failure here only means the hint may show again, so every path
 * degrades to "not found yet" rather than breaking the page.
 */

/**
 * Set when the rocket is flown, and holds the time it happened rather than a
 * bare flag so it can lapse. Someone who found the easter egg last year has
 * long since forgotten it, and should get the banner again.
 */
const FOUND_KEY = "madole:rocket-found";
/** Cleared with the tab, so at most one banner per session. */
const HINTED_KEY = "madole:rocket-hinted";

/** How long finding the rocket suppresses the hint: about six months. */
const FOUND_TTL_MS = 180 * 24 * 60 * 60 * 1000;

/**
 * True while a recorded find is still recent enough to suppress the hint.
 *
 * A lapsed or unreadable entry is deleted on the way past, so the key does not
 * linger once it stops meaning anything. This also cleans up the flag's
 * earlier form, when it was the string "1": that parses as a millisecond in
 * 1970, so it reads as long expired and clears itself.
 */
export function hasFoundRocket(): boolean {
  try {
    const raw = window.localStorage.getItem(FOUND_KEY);
    if (raw === null) return false;

    const foundAt = Number(raw);
    const fresh =
      Number.isFinite(foundAt) && Date.now() - foundAt < FOUND_TTL_MS;
    if (fresh) return true;

    window.localStorage.removeItem(FOUND_KEY);
    return false;
  } catch {
    return false;
  }
}

/** Rewritten on every activation, so flying it again restarts the clock. */
export function markRocketFound(): void {
  try {
    window.localStorage.setItem(FOUND_KEY, String(Date.now()));
  } catch {
    // Nothing to do: the hint may simply show again another time.
  }
}

export function hasHintedThisSession(): boolean {
  try {
    return window.sessionStorage.getItem(HINTED_KEY) !== null;
  } catch {
    return false;
  }
}

export function markHintedThisSession(): void {
  try {
    window.sessionStorage.setItem(HINTED_KEY, "1");
  } catch {
    // As above: worst case the banner flies once more.
  }
}
