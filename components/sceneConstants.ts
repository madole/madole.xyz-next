/**
 * Camera geometry shared by both drei Views in CombinedThreeScene.
 *
 * The rocket lives in the background view but orbits the globe drawn by the
 * Earth view, so it has to reason about where the Earth lands on screen. That
 * maths and the cameras themselves read from these values so the two cannot
 * drift apart.
 */

/** Both View cameras sit here, looking down -Z at the origin of their scene. */
export const VIEW_CAMERA_Z = 5;

/**
 * Vertical field of view in degrees. This is three's PerspectiveCamera default
 * - drei's PerspectiveCamera does not override it - stated explicitly because
 * the value is easy to misremember as r3f's 75 degree default Canvas camera.
 */
export const VIEW_FOV = 50;

/**
 * Depth the rocket flies at, in the background view's world units.
 *
 * Both Views share one depth buffer - drei's View turns autoClear off and
 * never clears between visible views - so depth alone decides whether a rocket
 * draws in front of the globe or behind it. z=2 is 3 units from the camera,
 * comfortably in front of the globe's nearest surface at about 3.5.
 *
 * Shared by the playable rocket and the hint rocket so both fly in one plane.
 */
export const FLIGHT_Z = 2;
export const FLIGHT_DISTANCE = VIEW_CAMERA_Z - FLIGHT_Z;
