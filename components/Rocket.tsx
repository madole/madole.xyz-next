import { Trail, type MeshLineGeometry } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  Color,
  Group,
  Material,
  Mesh,
  ShaderMaterial,
  Vector2,
} from "three";

/**
 * Tuning, in world units. The background camera sits 5 units back with a 75
 * degree field of view, so the z=0 plane the rocket flies in is about 7.7
 * units tall regardless of window size - roughly 115 CSS px per unit on a
 * 900 px tall viewport.
 */
/** Acceleration while an arrow is held, units per second squared. */
const THRUST = 16;
/** Exponential velocity decay per second; higher stops sooner. */
const DRAG = 2.4;
const MAX_SPEED = 7;
/** Velocity kept (and reversed) when the rocket hits the edge of the view. */
const EDGE_BOUNCE = 0.35;
/** Keeps the nose inside the view rather than the origin. */
const EDGE_MARGIN = 0.45;
/** How fast the nose swings round to follow the velocity, per second. */
const TURN_RATE = 8;
/** Below this speed the heading is held rather than chased, so idling does not jitter. */
const HEADING_MIN_SPEED = 0.25;

/** Seconds the entrance tween takes to bring the rocket up from the bottom edge. */
const LAUNCH_DURATION = 0.9;
/** Where the entrance ends, as a fraction of the half-height below centre. */
const LAUNCH_REST_Y = -0.25;
/** Straight-up speed on departure. */
const EXIT_SPEED = 9;

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

/** MeshLine's lineWidth is 0.1 * width in world units, so this is ~9 px. */
const TRAIL_WIDTH = 1.4;
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

type Phase = "launching" | "flying" | "exiting";

const ARROW_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

/** Shortest signed distance between two angles, in (-PI, PI]. */
function angleDelta(from: number, to: number): number {
  let d = (to - from) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}

export interface RocketProps {
  /** Once true the rocket ignores input, flies off the top and calls onExited. */
  leaving: boolean;
  onExited: () => void;
}

/**
 * The hidden-mode rocket: a small procedural ship that rises from the bottom
 * of the background view, then flies wherever the arrow keys push it, banking
 * to follow its velocity and leaving an exhaust trail.
 *
 * Only ever mounted while the mode is active, and loaded through React.lazy
 * from CombinedThreeScene, so it costs nothing until someone types the code.
 * There are no textures or model files: every part is a primitive, and the
 * trail reuses the drei Trail already in the bundle for the satellite.
 *
 * All motion lives in refs and is applied inside useFrame, so the component
 * renders once and never again - the same discipline as ShootingStars.
 */
const Rocket: React.FC<RocketProps> = ({ leaving, onExited }) => {
  const shipRef = useRef<Group>(null);
  const nozzleRef = useRef<Group>(null);
  const flameRef = useRef<Mesh>(null);
  const trailRef = useRef<MeshLineGeometry>(null);
  const viewport = useThree((state) => state.viewport);

  const phase = useRef<Phase>("launching");
  const elapsed = useRef(0);
  const velocity = useRef(new Vector2(0, 0));
  const heading = useRef(UP_HEADING);
  const held = useRef(new Set<string>());
  const frameCount = useRef(0);
  const styledMaterial = useRef<Material | null>(null);
  const exited = useRef(false);

  // Reusable scratch to avoid a per-frame allocation.
  const thrustDir = useRef(new Vector2());

  useEffect(() => {
    if (leaving && phase.current !== "exiting") {
      phase.current = "exiting";
      held.current.clear();
    }
  }, [leaving]);

  /**
   * Arrow keys are read as a held set and consumed in useFrame, so movement
   * is frame-rate independent and does not depend on key-repeat timing.
   * preventDefault only while the rocket is flying: otherwise arrows would
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

    // Clamp so a backgrounded tab returning after a long pause does not jump.
    const dt = Math.min(delta, 0.1);
    const halfW = viewport.width / 2;
    const halfH = viewport.height / 2;
    const vel = velocity.current;

    if (phase.current === "launching") {
      elapsed.current += dt;
      const t = Math.min(1, elapsed.current / LAUNCH_DURATION);
      const from = -halfH - 1;
      const to = halfH * LAUNCH_REST_Y;
      ship.position.set(0, from + (to - from) * easeOutCubic(t), 0);
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
      heading.current = UP_HEADING;
      if (ship.position.y > halfH + 1.5 && !exited.current) {
        exited.current = true;
        onExited();
      }
    } else {
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
    }

    // Swing the nose towards the heading along the shortest arc.
    const want = heading.current - UP_HEADING;
    const turn = 1 - Math.exp(-TURN_RATE * dt);
    ship.rotation.z += angleDelta(ship.rotation.z, want) * turn;

    // Flame: long while thrusting or launching, a flicker otherwise.
    const flame = flameRef.current;
    if (flame) {
      const burning = phase.current !== "flying" || held.current.size > 0;
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

      <group ref={shipRef} position={[0, -100, 0]} scale={0.85}>
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
