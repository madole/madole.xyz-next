import { useEffect, useRef, type RefObject } from "react";
import {
  EARTH_RADIUS,
  VIEW_UNITS_PER_HALF_HEIGHT,
} from "../components/sceneConstants";

/** Where the globe sits on screen, in CSS px with y down, as the DOM reports it. */
export interface EarthAnchor {
  /** False when the globe's div is scrolled off screen or has no size yet. */
  valid: boolean;
  cx: number;
  cy: number;
  /** Projected radius of the globe in CSS px. */
  radius: number;
}

const OFFSCREEN: EarthAnchor = { valid: false, cx: 0, cy: 0, radius: 0 };

/**
 * Keeps a ref holding where the globe is on screen, re-measured on scroll and
 * resize.
 *
 * The Earth's tracking div is absolutely positioned inside the hero, so it
 * moves as the page scrolls while the rocket's canvas is fixed. Reading its
 * rect every frame would force a layout every frame, so this listens for the
 * two events that can move it instead and lets the frame callback read the
 * cached value.
 *
 * The rect is in viewport coordinates while the canvas size used by the orbit
 * and capture ring is in canvas pixels. Those agree only because the
 * background view the rocket flies in is a fixed, full-screen element. If that
 * stops being true, both sides need converting to a common space.
 *
 * The globe's radius in px comes from the Earth view's camera geometry: the
 * view's half-height covers VIEW_UNITS_PER_HALF_HEIGHT world units, so
 * EARTH_RADIUS of them is a fraction of the view's half-height.
 */
export function useEarthAnchor(
  trackRef: RefObject<HTMLElement | null>,
): RefObject<EarthAnchor> {
  const anchor = useRef<EarthAnchor>({ ...OFFSCREEN });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const rect = track.getBoundingClientRect();
      const a = anchor.current;
      a.cx = rect.left + rect.width / 2;
      a.cy = rect.top + rect.height / 2;
      a.radius =
        (EARTH_RADIUS / VIEW_UNITS_PER_HALF_HEIGHT) * (rect.height / 2);
      // Capture is only offered while the globe is actually on screen.
      a.valid =
        rect.width > 0 &&
        rect.bottom > 0 &&
        rect.top < window.innerHeight &&
        rect.right > 0 &&
        rect.left < window.innerWidth;
    };

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [trackRef]);

  return anchor;
}
