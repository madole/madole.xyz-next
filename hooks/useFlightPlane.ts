import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils, type PerspectiveCamera } from "three";
import {
  FLIGHT_DISTANCE,
  VIEW_CAMERA_Z,
  VIEW_FOV,
} from "../components/sceneConstants";

/**
 * Largest frame delta the flight maths will integrate over. A backgrounded tab
 * returning after a long pause would otherwise teleport everything.
 */
const MAX_FRAME_DT = 0.1;

/**
 * Smallest frame delta. Dividing by a zero delta yields Infinity or NaN, and
 * NaN cannot be recovered from once it reaches a position.
 */
const MIN_FRAME_DT = 0.0001;

/** Half the field of view as a sine/cosine pair, computed once. */
const HALF_FOV = MathUtils.degToRad(VIEW_FOV / 2);
const TAN_HALF_FOV = Math.tan(HALF_FOV);

export interface FlightPlane {
  /** Clamped frame delta in seconds. */
  dt: number;
  /** Half the flight plane's height, in world units. */
  halfH: number;
  /** Half the flight plane's width, in world units. */
  halfW: number;
}

/**
 * The rocket's frame delta and the extent of the plane it flies in, refreshed
 * each frame.
 *
 * Both the playable rocket and the banner rocket need the same three numbers
 * and derived them the same way, which meant the camera geometry was being
 * re-derived in two places - and sceneConstants exists precisely so those
 * cannot drift apart.
 *
 * Returns one stable object rather than a fresh one per frame: callers read
 * it inside useFrame, so re-creating it would allocate sixty times a second
 * for nothing.
 */
export function useFlightPlane(): FlightPlane {
  const plane = useRef<FlightPlane>({ dt: 0, halfH: 0, halfW: 0 });

  useFrame((state, delta) => {
    const camera = state.camera as PerspectiveCamera;
    const halfH = FLIGHT_DISTANCE * TAN_HALF_FOV;
    plane.current.dt = Math.min(Math.max(delta, MIN_FRAME_DT), MAX_FRAME_DT);
    plane.current.halfH = halfH;
    // The camera's aspect is the view's own.
    plane.current.halfW = halfH * camera.aspect;
  });

  return plane.current;
}

/**
 * Half the flight plane's height in world units, for code that needs it
 * outside a frame callback - the hint rocket's starting position, for one.
 */
export function flightPlaneHalfHeight(): number {
  return FLIGHT_DISTANCE * TAN_HALF_FOV;
}

/**
 * Conversion from a view's half-height in world units to its half-height in
 * CSS pixels, for anything sized against the drawn globe.
 */
export const VIEW_UNITS_PER_HALF_HEIGHT = VIEW_CAMERA_Z * TAN_HALF_FOV;