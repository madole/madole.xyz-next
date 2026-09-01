import { Trail, type MeshLineGeometry } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  Color,
  DataTexture,
  Group,
  Material,
  RGBAFormat,
  ShaderMaterial,
  SRGBColorSpace,
} from "three";

/** Seconds for one full orbit. */
const ORBIT_PERIOD = 9;
const ORBIT_SPEED = (Math.PI * 2) / ORBIT_PERIOD;

/**
 * Tilt of the orbital plane, in radians. X inclines the plane so the satellite
 * passes above and below the equator rather than tracking a flat line across
 * the middle; Z rolls that ellipse on screen so it does not read as a level
 * hoop.
 */
const ORBIT_TILT: [number, number, number] = [0.42, 0, 0.28];

/**
 * The Earth view is 320-384 CSS px wide with the camera 5.1 units back, which
 * works out at roughly 67 px per world unit. A 0.035 core is about 4.7 px
 * across - the same trap documented on the starfield in BackgroundView, where
 * a physically sensible size disappears at this scale.
 */
const CORE_RADIUS = 0.035;
const GLOW_SIZE = 0.3;

const CORE_COLOR = "#eaf6ff";
const GLOW_COLOR = "#7fd0ff";
const TRAIL_HEAD_COLOR = "#8fd8ff";
/**
 * The trail blends additively, so black contributes nothing. Fading the
 * gradient to black is what makes the tail disappear rather than stopping dead.
 */
const TRAIL_TAIL_COLOR = "#000000";

/** MeshLine's lineWidth is 0.1 * width in world units, so this is ~4 px. */
const TRAIL_WIDTH = 0.6;
/**
 * Trail buffers length * 10 points and consumes `decay` of them per frame, not
 * per second, so the tail covers 120 frames - about two seconds and a third of
 * the orbit at 60 Hz, proportionally shorter on a 120 Hz display.
 */
const TRAIL_LENGTH = 12;
const TRAIL_DECAY = 1;
const TRAIL_WARMUP_FRAMES = Math.ceil((TRAIL_LENGTH * 10) / TRAIL_DECAY);

/**
 * Radial falloff used as the glow sprite. Built once at 64px, which is ample
 * for something that covers ~20 CSS px.
 */
function useGlowTexture(color: string) {
  return useMemo(() => {
    const size = 64;
    const tint = new Color(color);
    const data = new Uint8Array(size * size * 4);
    const centre = (size - 1) / 2;

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const dx = (x - centre) / centre;
        const dy = (y - centre) / centre;
        const distance = Math.min(1, Math.hypot(dx, dy));
        // Fourth power keeps a tight bright centre with a long soft skirt.
        // Anything gentler reads as a translucent disc rather than a glow.
        const alpha = (1 - distance) ** 4;

        const i = (y * size + x) * 4;
        data[i + 0] = tint.r * 255;
        data[i + 1] = tint.g * 255;
        data[i + 2] = tint.b * 255;
        data[i + 3] = Math.round(alpha * 255);
      }
    }

    const texture = new DataTexture(data, size, size, RGBAFormat);
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [color]);
}

export interface SatelliteProps {
  /** Distance from the centre of the globe, in world units. */
  orbitRadius: number;
}

/**
 * A glowing dot orbiting the globe, with a tapering trail behind it.
 *
 * Meant to be rendered inside Earth's group so the orbit stays centred on the
 * planet under OrbitControls - the controls target and the group share the same
 * origin, and a satellite parented anywhere else would drift off it.
 *
 * The orbit is two nested groups rather than trigonometry: the outer one holds
 * the inclination, the inner one spins, and the satellite sits at a fixed
 * offset on the inner one. That keeps the per-frame work to a single rotation.
 */
const Satellite: React.FC<SatelliteProps> = ({ orbitRadius }) => {
  const orbitRef = useRef<Group>(null);
  const satelliteRef = useRef<Group>(null);
  const trailRef = useRef<MeshLineGeometry>(null);
  const glowTexture = useGlowTexture(GLOW_COLOR);

  /**
   * Trail's material is memoised on the canvas size, so it is rebuilt from
   * defaults on every resize and any styling applied once in an effect is
   * silently lost. Reapplying on identity change costs a reference comparison
   * per frame and survives that rebuild.
   */
  const styledMaterial = useRef<Material | null>(null);
  const frameCount = useRef(0);

  useFrame((_, delta) => {
    // Clamp so a backgrounded tab returning after a long pause does not jump.
    const step = Math.min(delta, 0.1);
    if (orbitRef.current) orbitRef.current.rotation.y += ORBIT_SPEED * step;

    const trail = trailRef.current;
    if (!trail) return;

    /**
     * Trail seeds its buffer from the target's *local* position, so until every
     * seeded point has been shifted out the line runs from a stale point near
     * the pole to the satellite. Counting frames rather than seconds because
     * the buffer drains per frame.
     */
    if (frameCount.current <= TRAIL_WARMUP_FRAMES) {
      frameCount.current += 1;
      trail.visible = false;
      return;
    }
    trail.visible = true;

    const material = trail.material;
    if (material === styledMaterial.current) return;
    if (!(material instanceof ShaderMaterial)) return;

    // Additive over the night sky, and depth-tested so the globe occludes the
    // trail as the satellite passes behind it. The atmosphere shell writes no
    // depth, so only the surface occludes - which is what we want.
    material.transparent = true;
    material.depthWrite = false;
    material.blending = AdditiveBlending;
    // The canvas tone maps with ACES, whose toe would swallow the tail.
    material.toneMapped = false;

    // MeshLine's own gradient: mix(gradient[0], gradient[1], counters), where
    // counters runs 0 at the oldest point to 1 at the head. `attenuation` only
    // tapers width; this is what fades the tail out.
    material.uniforms.useGradient.value = 1;
    material.uniforms.gradient.value = [
      new Color(TRAIL_TAIL_COLOR),
      new Color(TRAIL_HEAD_COLOR),
    ];

    styledMaterial.current = material;
  });

  return (
    <group rotation={ORBIT_TILT}>
      <group ref={orbitRef}>
        <Trail
          ref={trailRef}
          /* drei types target as RefObject<Object3D>, which predates React 19
             making useRef(null) yield RefObject<T | null>. The ref is set by
             the time Trail reads it in an effect. */
          target={satelliteRef as React.RefObject<Group>}
          width={TRAIL_WIDTH}
          length={TRAIL_LENGTH}
          decay={TRAIL_DECAY}
          color={TRAIL_HEAD_COLOR}
          attenuation={(t) => t * t}
        />

        <group ref={satelliteRef} position={[orbitRadius, 0, 0]}>
          <mesh>
            <sphereGeometry args={[CORE_RADIUS, 12, 12]} />
            <meshBasicMaterial color={CORE_COLOR} toneMapped={false} />
          </mesh>

          {/* A sprite rather than a shell so the glow always faces the camera
              and stays the same shape as OrbitControls swings around. */}
          <sprite scale={GLOW_SIZE}>
            <spriteMaterial
              map={glowTexture}
              transparent
              depthWrite={false}
              blending={AdditiveBlending}
              toneMapped={false}
            />
          </sprite>
        </group>
      </group>
    </group>
  );
};

export default Satellite;
