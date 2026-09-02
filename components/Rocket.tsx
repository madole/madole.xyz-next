import { Trail, type MeshLineGeometry } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  Camera,
  Color,
  Group,
  Material,
  MathUtils,
  Mesh,
  PerspectiveCamera,
  ShaderMaterial,
  Vector2,
  Vector3,
} from "three";
import { EARTH_RADIUS } from "./Earth";
import { VIEW_CAMERA_Z, VIEW_FOV } from "./sceneConstants";

/**
 * Depth, in the background view's world units.
 *
 * Both Views share one depth buffer - drei's View turns autoClear off and never
 * clears between visible views - so depth alone decides whether the rocket
 * shows in front of the globe or behind it. The Earth view's camera geometry
 * matches this one, so distances compare directly: the globe's nearest surface
 * is about 3.5 units from its camera and its centre 5.
 *
 * Free flight happens at z=2 (3 units from the camera), comfortably in front
 * of the globe. The orbit dips to z=-1 (6 units out) on its far half, well
 * behind the surface, which is what hides the rocket as it passes round the
 * back.
 */
const FLIGHT_Z = 2;
const FLIGHT_DISTANCE = VIEW_CAMERA_Z - FLIGHT_Z;
const ORBIT_Z_MID = 0.5;
const ORBIT_Z_AMP = 1.5;

/**
 * Apparent size is scale / distance, so the rocket would double in size
 * between the far and near halves of the orbit. Half of that is compensated
 * away; the remainder is what reads as depth.
 */
const SHIP_SCALE = 0.5;
const DEPTH_SCALE_POWER = 0.5;

/** Acceleration while an arrow is held, units per second squared. */
const THRUST = 10;
/** Exponential velocity decay per second; higher stops sooner. */
const DRAG = 2.4;
const MAX_SPEED = 4.5;
/** Velocity kept (and reversed) when the rocket hits the edge of the view. */
const EDGE_BOUNCE = 0.35;
/** Keeps the nose inside the view rather than the origin. */
const EDGE_MARGIN = 0.3;
/** How fast the nose swings round to follow the velocity, per second. */
const TURN_RATE = 8;
/** Below this speed the heading is held rather than chased, so idling does not jitter. */
const HEADING_MIN_SPEED = 0.15;
/** How fast z eases back to the flight plane after leaving orbit, per second. */
const DEPTH_RETURN_RATE = 5;

/** Seconds the entrance tween takes to bring the rocket up from the bottom edge. */
const LAUNCH_DURATION = 0.9;
/** Where the entrance ends, as a fraction of the half-height below centre. */
const LAUNCH_REST_Y = -0.25;
/** Straight-up speed on departure. */
const EXIT_SPEED = 6;

/**
 * Orbit, sized in screen space off the globe's projected radius so it hugs the
 * planet at every breakpoint.
 */
/** Orbit radius as a multiple of the globe's screen radius. */
const ORBIT_RADIUS_FACTOR = 1.4;
/** Vertical squash of the on-screen ellipse: the orbit is seen from slightly above. */
const ORBIT_SQUASH = 0.38;
/** Seconds per revolution. The satellite takes 9, so the two never lock step. */
const ORBIT_PERIOD = 6;
const ORBIT_SPEED = (Math.PI * 2) / ORBIT_PERIOD;
/** Coasting inside this many globe radii of the centre is what gets you captured. */
const CAPTURE_RING_FACTOR = 1.6;
/** Seconds to blend from free flight onto the orbit path. */
const CAPTURE_DURATION = 0.6;

/** Rocket points +Y in its own space; heading is measured from +X. */
const UP_HEADING = Math.PI / 2;

const HULL_COLOR = "#eef2f8";
const NOSE_COLOR = "#ff5a5f";
const FIN_COLOR = "#ff5a5f";
const NOZZLE_COLOR = "#3a3f4b";
const WINDOW_COLOR = "#7fd0ff";
const FLAME_COLOR = "#ffb347";
const TRAIL_HEAD_COLOR = "#ff9a3c";
/** Additive blend: black contributes nothing, which is what fades the tail out. */
const TRAIL_TAIL_COLOR = "#000000";

/** MeshLine's lineWidth is 0.1 * width in world units, so this is ~9 px at flight depth. */
const TRAIL_WIDTH = 0.8;
/**
 * Trail buffers length * 10 points and consumes `decay` per frame, so this
 * tail covers 40 frames - two thirds of a second at 60 Hz.
 */
const TRAIL_LENGTH = 8;
const TRAIL_DECAY = 2;
/**
 * Trail seeds its buffer from the target's *local* position, so for the first
 * buffer's worth of frames the line runs from the wrong place. Hidden until
 * every seeded point has drained, exactly as the satellite does.
 */
const TRAIL_WARMUP_FRAMES = Math.ceil((TRAIL_LENGTH * 10) / TRAIL_DECAY);

type Phase = "launching" | "flying" | "capturing" | "orbiting" | "exiting";

const ARROW_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

/** Where the globe sits on screen, in CSS px with y down, as the DOM reports it. */
interface EarthAnchor {
  valid: boolean;
  cx: number;
  cy: number;
  /** Projected radius of the globe in CSS px. */
  radius: number;
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

/** Shortest signed distance between two angles, in (-PI, PI]. */
function angleDelta(from: number, to: number): number {
  let d = (to - from) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}

// Module-level scratch so the per-frame maths never allocates.
const _ray = new Vector3();
const _ndc = new Vector3();

/**
 * World point where the camera ray through a screen position (CSS px, y down)
 * crosses the plane z = planeZ. Going through the camera rather than a fixed
 * conversion matters because the pointer parallax moves the camera each frame.
 */
function screenToWorldAtZ(
  camera: Camera,
  sx: number,
  sy: number,
  width: number,
  height: number,
  planeZ: number,
  out: Vector3,
): Vector3 {
  const nx = (sx / width) * 2 - 1;
  const ny = -((sy / height) * 2 - 1);
  _ray.set(nx, ny, 0.5).unproject(camera).sub(camera.position).normalize();
  const t = (planeZ - camera.position.z) / _ray.z;
  return out.copy(camera.position).addScaledVector(_ray, t);
}

/** Screen position (CSS px, y down) of a world point. */
function worldToScreen(
  camera: Camera,
  point: Vector3,
  width: number,
  height: number,
  out: Vector2,
): Vector2 {
  _ndc.copy(point).project(camera);
  return out.set(((_ndc.x + 1) / 2) * width, ((1 - _ndc.y) / 2) * height);
}

export interface RocketProps {
  /** Once true the rocket ignores input, flies off the top and calls onExited. */
  leaving: boolean;
  onExited: () => void;
  /** The Earth view's tracking div: its rect is where the globe is on screen. */
  earthTrackRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * The hidden-mode rocket: a small procedural ship that rises from the bottom
 * of the background view, then flies wherever the arrow keys push it, banking
 * to follow its velocity and leaving an exhaust trail.
 *
 * Coast close to the globe with no arrow held and it is captured into orbit:
 * a screen-space ellipse around the Earth's projected centre whose depth
 * swings from in front of the planet to behind it, so the shared depth buffer
 * hides the rocket on the far pass. Pressing any arrow breaks orbit along the
 * current tangent. Capture only re-arms once the rocket has left the ring, so
 * an escape cannot be swallowed straight back.
 *
 * Only ever mounted while the mode is active, and loaded through React.lazy
 * from CombinedThreeScene, so it costs nothing until someone types the code.
 * There are no textures or model files: every part is a primitive, and the
 * trail reuses the drei Trail already in the bundle for the satellite.
 *
 * All motion lives in refs and is applied inside useFrame, so the component
 * renders once and never again - the same discipline as ShootingStars.
 */
const Rocket: React.FC<RocketProps> = ({
  leaving,
  onExited,
  earthTrackRef,
}) => {
  const shipRef = useRef<Group>(null);
  const nozzleRef = useRef<Group>(null);
  const flameRef = useRef<Mesh>(null);
  const trailRef = useRef<MeshLineGeometry>(null);

  const phase = useRef<Phase>("launching");
  const elapsed = useRef(0);
  const velocity = useRef(new Vector2(0, 0));
  const heading = useRef(UP_HEADING);
  const held = useRef(new Set<string>());
  const frameCount = useRef(0);
  const styledMaterial = useRef<Material | null>(null);
  const exited = useRef(false);

  const anchor = useRef<EarthAnchor>({ valid: false, cx: 0, cy: 0, radius: 0 });
  /** Cleared on capture and escape; set again once the rocket leaves the ring. */
  const captureArmed = useRef(true);
  const orbitAngle = useRef(0);
  /** +1 anticlockwise on screen, -1 clockwise. */
  const orbitDirection = useRef(1);
  const captureStart = useRef(new Vector3());
  const prevPosition = useRef(new Vector3());

  // Reusable scratch to avoid per-frame allocations.
  const thrustDir = useRef(new Vector2());
  const screenPos = useRef(new Vector2());
  const orbitTarget = useRef(new Vector3());

  useEffect(() => {
    if (leaving && phase.current !== "exiting") {
      phase.current = "exiting";
      held.current.clear();
    }
  }, [leaving]);

  /**
   * Where the globe is on screen. The Earth's tracking div is absolute inside
   * the hero, so it moves on scroll while this canvas is fixed; the rect is
   * re-read on scroll and resize rather than every frame, which would force a
   * layout each time.
   *
   * The globe's radius in px follows from the Earth view's camera geometry:
   * the view's half-height covers VIEW_CAMERA_Z * tan(fov / 2) world units.
   */
  useEffect(() => {
    const track = earthTrackRef.current;
    if (!track) return;
    const halfFov = MathUtils.degToRad(VIEW_FOV / 2);
    const unitsPerHalfHeight = VIEW_CAMERA_Z * Math.tan(halfFov);

    const measure = () => {
      const rect = track.getBoundingClientRect();
      const a = anchor.current;
      a.cx = rect.left + rect.width / 2;
      a.cy = rect.top + rect.height / 2;
      a.radius = (EARTH_RADIUS / unitsPerHalfHeight) * (rect.height / 2);
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
  }, [earthTrackRef]);

  /**
   * Arrow keys are read as a held set and consumed in useFrame, so movement
   * is frame-rate independent and does not depend on key-repeat timing.
   * preventDefault only while the rocket is mounted: otherwise arrows would
   * stop scrolling the page for everyone, and Lighthouse would never see this
   * listener anyway because the component is not mounted until activation.
   */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!ARROW_KEYS.has(event.key)) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      event.preventDefault();
      // Recorded in every phase, consumed only while flying: a key pressed
      // during the launch tween would otherwise never register, since a held
      // key sends no further keydown until it repeats.
      held.current.add(event.key);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      held.current.delete(event.key);
    };
    // A key held while the window loses focus never sends keyup.
    const onBlur = () => held.current.clear();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  useFrame((state, delta) => {
    const ship = shipRef.current;
    if (!ship) return;

    const camera = state.camera as PerspectiveCamera;
    const { width, height } = state.size;
    // Clamp so a backgrounded tab returning after a long pause does not jump.
    const dt = Math.min(delta, 0.1);
    // Extent of the flight plane. The camera's aspect is the view's own.
    const halfH =
      FLIGHT_DISTANCE * Math.tan(MathUtils.degToRad(camera.fov / 2));
    const halfW = halfH * camera.aspect;
    const vel = velocity.current;
    const earth = anchor.current;

    /**
     * A point on the orbit for a given angle: an ellipse in screen space round
     * the globe's centre, pushed to a depth that swings from in front of the
     * planet at the bottom of the ellipse to behind it at the top - the near
     * side of a ring seen from slightly above.
     */
    const orbitPoint = (angle: number, out: Vector3) => {
      const r = earth.radius * ORBIT_RADIUS_FACTOR;
      const sx = earth.cx + r * Math.cos(angle);
      const sy = earth.cy - r * ORBIT_SQUASH * Math.sin(angle);
      const z = ORBIT_Z_MID - ORBIT_Z_AMP * Math.sin(angle);
      return screenToWorldAtZ(camera, sx, sy, width, height, z, out);
    };

    /** Heading along the ellipse, from its screen-space derivative (y up). */
    const orbitHeading = (angle: number) => {
      const d = orbitDirection.current;
      return Math.atan2(
        ORBIT_SQUASH * Math.cos(angle) * d,
        -Math.sin(angle) * d,
      );
    };

    prevPosition.current.copy(ship.position);

    if (phase.current === "launching") {
      elapsed.current += dt;
      const t = Math.min(1, elapsed.current / LAUNCH_DURATION);
      const from = -halfH - 1;
      const to = halfH * LAUNCH_REST_Y;
      ship.position.set(0, from + (to - from) * easeOutCubic(t), FLIGHT_Z);
      heading.current = UP_HEADING;
      if (t >= 1) {
        phase.current = "flying";
        vel.set(0, 0);
      }
    } else if (phase.current === "exiting") {
      vel.x *= Math.exp(-DRAG * dt);
      vel.y = Math.min(MAX_SPEED * 1.3, vel.y + EXIT_SPEED * dt * 2);
      ship.position.x += vel.x * dt;
      ship.position.y += vel.y * dt;
      ship.position.z +=
        (FLIGHT_Z - ship.position.z) * (1 - Math.exp(-DEPTH_RETURN_RATE * dt));
      heading.current = UP_HEADING;
      if (ship.position.y > halfH + 1.5 && !exited.current) {
        exited.current = true;
        onExited();
      }
    } else if (phase.current === "capturing" || phase.current === "orbiting") {
      if (held.current.size > 0) {
        // Break orbit along the tangent: last frame's motion is the velocity,
        // and the thrust that was just pressed adds to it from here.
        phase.current = "flying";
        captureArmed.current = false;
        vel.set(
          (ship.position.x - prevPosition.current.x) / dt,
          (ship.position.y - prevPosition.current.y) / dt,
        );
        if (vel.length() > MAX_SPEED) vel.setLength(MAX_SPEED);
      } else if (phase.current === "capturing") {
        elapsed.current += dt;
        const t = Math.min(1, elapsed.current / CAPTURE_DURATION);
        orbitAngle.current += orbitDirection.current * ORBIT_SPEED * dt;
        orbitPoint(orbitAngle.current, orbitTarget.current);
        ship.position.lerpVectors(
          captureStart.current,
          orbitTarget.current,
          easeInOutCubic(t),
        );
        heading.current = orbitHeading(orbitAngle.current);
        if (t >= 1) phase.current = "orbiting";
      } else {
        orbitAngle.current += orbitDirection.current * ORBIT_SPEED * dt;
        orbitPoint(orbitAngle.current, ship.position);
        heading.current = orbitHeading(orbitAngle.current);
      }
    }

    if (phase.current === "flying") {
      const dir = thrustDir.current.set(0, 0);
      const keys = held.current;
      if (keys.has("ArrowLeft")) dir.x -= 1;
      if (keys.has("ArrowRight")) dir.x += 1;
      if (keys.has("ArrowUp")) dir.y += 1;
      if (keys.has("ArrowDown")) dir.y -= 1;
      const thrusting = dir.lengthSq() > 0;
      if (thrusting) {
        dir.normalize().multiplyScalar(THRUST * dt);
        vel.add(dir);
        if (vel.length() > MAX_SPEED) vel.setLength(MAX_SPEED);
      }
      // Frame-rate independent drag.
      vel.multiplyScalar(Math.exp(-DRAG * dt));

      ship.position.x += vel.x * dt;
      ship.position.y += vel.y * dt;
      // Back to the flight plane after an orbit left us at another depth.
      ship.position.z +=
        (FLIGHT_Z - ship.position.z) * (1 - Math.exp(-DEPTH_RETURN_RATE * dt));

      // Soft bounce off the edges of the view.
      const maxX = halfW - EDGE_MARGIN;
      const maxY = halfH - EDGE_MARGIN;
      if (ship.position.x > maxX) {
        ship.position.x = maxX;
        vel.x = -Math.abs(vel.x) * EDGE_BOUNCE;
      } else if (ship.position.x < -maxX) {
        ship.position.x = -maxX;
        vel.x = Math.abs(vel.x) * EDGE_BOUNCE;
      }
      if (ship.position.y > maxY) {
        ship.position.y = maxY;
        vel.y = -Math.abs(vel.y) * EDGE_BOUNCE;
      } else if (ship.position.y < -maxY) {
        ship.position.y = -maxY;
        vel.y = Math.abs(vel.y) * EDGE_BOUNCE;
      }

      if (vel.length() > HEADING_MIN_SPEED) {
        heading.current = Math.atan2(vel.y, vel.x);
      }

      // Capture check, in screen space so it matches the drawn globe.
      if (earth.valid) {
        const s = worldToScreen(
          camera,
          ship.position,
          width,
          height,
          screenPos.current,
        );
        const dx = s.x - earth.cx;
        // Flip to y-up so the angle and the cross product read conventionally.
        const dy = -(s.y - earth.cy);
        const insideRing =
          Math.hypot(dx, dy) < earth.radius * CAPTURE_RING_FACTOR;

        if (!insideRing) {
          captureArmed.current = true;
        } else if (captureArmed.current && !thrusting) {
          phase.current = "capturing";
          captureArmed.current = false;
          elapsed.current = 0;
          captureStart.current.copy(ship.position);
          // Keep circling the way we were already going round the planet.
          const cross = dx * vel.y - dy * vel.x;
          orbitDirection.current = cross < 0 ? -1 : 1;
          // Nearest angle on the ellipse to where the rocket is now.
          orbitAngle.current = Math.atan2(dy / ORBIT_SQUASH, dx);
        }
      }
    }

    // Swing the nose towards the heading along the shortest arc.
    const want = heading.current - UP_HEADING;
    const turn = 1 - Math.exp(-TURN_RATE * dt);
    ship.rotation.z += angleDelta(ship.rotation.z, want) * turn;

    // Partial perspective compensation, see DEPTH_SCALE_POWER.
    const distance = camera.position.z - ship.position.z;
    ship.scale.setScalar(
      SHIP_SCALE * (distance / FLIGHT_DISTANCE) ** DEPTH_SCALE_POWER,
    );

    // Flame: long while thrusting or launching, a flicker otherwise.
    const flame = flameRef.current;
    if (flame) {
      const burning =
        phase.current === "launching" ||
        phase.current === "exiting" ||
        (phase.current === "flying" && held.current.size > 0);
      const base = burning ? 1 : 0.35;
      const flicker = 0.85 + 0.15 * Math.sin(state.clock.elapsedTime * 47);
      flame.scale.set(
        base * flicker,
        base * (0.9 + 0.3 * flicker),
        base * flicker,
      );
    }

    const trail = trailRef.current;
    if (!trail) return;
    if (frameCount.current <= TRAIL_WARMUP_FRAMES) {
      frameCount.current += 1;
      trail.visible = false;
      return;
    }
    trail.visible = true;

    const material = trail.material;
    if (material === styledMaterial.current) return;
    if (!(material instanceof ShaderMaterial)) return;
    // Same treatment as the satellite trail: additive, no depth write, and
    // MeshLine's own gradient to fade the tail. Reapplied whenever Trail
    // rebuilds its material on resize.
    material.transparent = true;
    material.depthWrite = false;
    material.blending = AdditiveBlending;
    material.toneMapped = false;
    material.uniforms.useGradient.value = 1;
    material.uniforms.gradient.value = [
      new Color(TRAIL_TAIL_COLOR),
      new Color(TRAIL_HEAD_COLOR),
    ];
    styledMaterial.current = material;
  });

  return (
    <group>
      {/* The background view only carries a dim ambient light, which is all
          the clouds need. The hull wants a key light to read as a solid, and
          it lives here so it exists only while the rocket does. */}
      <directionalLight position={[2, 3, 5]} intensity={2.2} />

      <Trail
        ref={trailRef}
        /* drei types target as RefObject<Object3D>, predating React 19's
           RefObject<T | null>. The ref is set before Trail reads it. */
        target={nozzleRef as React.RefObject<Group>}
        width={TRAIL_WIDTH}
        length={TRAIL_LENGTH}
        decay={TRAIL_DECAY}
        color={TRAIL_HEAD_COLOR}
        attenuation={(t) => t * t}
      />

      <group ref={shipRef} position={[0, -100, FLIGHT_Z]} scale={SHIP_SCALE}>
        {/* Hull */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.15, 0.55, 20]} />
          <meshStandardMaterial
            color={HULL_COLOR}
            roughness={0.45}
            metalness={0.15}
          />
        </mesh>

        {/* Nose cone */}
        <mesh position={[0, 0.42, 0]}>
          <coneGeometry args={[0.12, 0.3, 20]} />
          <meshStandardMaterial color={NOSE_COLOR} roughness={0.5} />
        </mesh>

        {/* Porthole, facing the camera */}
        <mesh position={[0, 0.08, 0.11]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial
            color={WINDOW_COLOR}
            emissive={WINDOW_COLOR}
            emissiveIntensity={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Three fins, one swept back on each visible side and one behind */}
        {[0, 1, 2].map((i) => {
          const angle = (i * Math.PI * 2) / 3 + Math.PI / 2;
          return (
            <group key={i} rotation={[0, angle, 0]}>
              <mesh position={[0.17, -0.22, 0]} rotation={[0, 0, 0.35]}>
                <boxGeometry args={[0.16, 0.22, 0.03]} />
                <meshStandardMaterial color={FIN_COLOR} roughness={0.5} />
              </mesh>
            </group>
          );
        })}

        {/* Nozzle; the trail is anchored here */}
        <group ref={nozzleRef} position={[0, -0.32, 0]}>
          <mesh>
            <cylinderGeometry args={[0.07, 0.1, 0.1, 16]} />
            <meshStandardMaterial
              color={NOZZLE_COLOR}
              roughness={0.7}
              metalness={0.4}
            />
          </mesh>

          {/* Flame: an inverted cone, additive so it glows over the sky */}
          <mesh
            ref={flameRef}
            position={[0, -0.2, 0]}
            rotation={[Math.PI, 0, 0]}
          >
            <coneGeometry args={[0.08, 0.32, 12]} />
            <meshBasicMaterial
              color={FLAME_COLOR}
              transparent
              opacity={0.9}
              depthWrite={false}
              blending={AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};

export default Rocket;
