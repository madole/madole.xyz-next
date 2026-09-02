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
