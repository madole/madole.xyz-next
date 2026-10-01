import React from "react";
import { AdditiveBlending, Group } from "three";

const HULL_COLOR = "#eef2f8";
/**
 * Exported because the hint rocket paints its banner stripes to match. Two
 * copies of a hex value drift apart the first time someone retunes one.
 */
export const NOSE_COLOR = "#ff5a5f";
const FIN_COLOR = "#ff5a5f";
const NOZZLE_COLOR = "#3a3f4b";
const WINDOW_COLOR = "#7fd0ff";
const FLAME_COLOR = "#ffb347";

/**
 * Where the nozzle hangs below the hull centre, in ship-local units.
 *
 * Exported because the hint rocket hangs its tow rope off the nozzle. It used
 * to hardcode the same -0.32, which meant nudging the nozzle here silently
 * detached the banner from the rope without any type or lint error.
 */
export const NOZZLE_OFFSET_Y = -0.32;
/** Half the nozzle's height: the mouth, and so the exhaust anchor, is this far below it. */
const NOZZLE_HALF_HEIGHT = 0.05;

const FLAME_RADIUS = 0.08;
const FLAME_LENGTH = 0.32;

export interface RocketMeshProps {
  /** The nozzle group. Exhaust trails anchor here. */
  nozzleRef?: React.RefObject<Group | null>;
  /**
   * The flame group, scaled per frame to burn or idle. Pivoted on the nozzle
   * mouth so scaling stretches the flame downwards instead of sliding it in
   * and out of the nozzle.
   */
  flameRef?: React.RefObject<Group | null>;
}

/**
 * The ship itself: hull, nose, porthole, fins and a nozzle with a flame.
 *
 * Shared by the playable rocket and the hint rocket that tows the banner, so
 * the two are unmistakably the same craft. Geometry only - every caller owns
 * its own placement, scale and animation, and drives the flame through
 * flameRef.
 *
 * Deliberately all primitives: no model file and no texture, which is what
 * keeps the hidden-mode chunks to a couple of kilobytes.
 */
const RocketMesh: React.FC<RocketMeshProps> = ({ nozzleRef, flameRef }) => (
  <>
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

    {/* Porthole. Two spheres back to back rather than one: a single sphere
        is front-face only, so during a barrel roll it shows as a hole in the
        hull for as long as the camera is behind it. Mirrored, it reads as a
        window from either side, which is what the roll needs. */}
    <group position={[0, 0.08, 0.11]}>
      <mesh>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial
          color={WINDOW_COLOR}
          emissive={WINDOW_COLOR}
          emissiveIntensity={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0, -0.07]} scale={0.85}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial
          color={WINDOW_COLOR}
          emissive={WINDOW_COLOR}
          emissiveIntensity={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>

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

    {/* Nozzle; exhaust trails anchor here */}
    <group ref={nozzleRef} position={[0, NOZZLE_OFFSET_Y, 0]}>
      <mesh>
        <cylinderGeometry args={[0.07, 0.1, NOZZLE_HALF_HEIGHT * 2, 16]} />
        <meshStandardMaterial
          color={NOZZLE_COLOR}
          roughness={0.7}
          metalness={0.4}
        />
      </mesh>

      {/* Flame: an inverted cone, additive so it glows over the sky. The
          extra group puts the scale pivot on the nozzle mouth, so the base
          stays welded to the nozzle however far the caller stretches it and
          only the tip extends. */}
      <group ref={flameRef} position={[0, -NOZZLE_HALF_HEIGHT, 0]}>
        <mesh position={[0, -FLAME_LENGTH / 2, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[FLAME_RADIUS, FLAME_LENGTH, 12]} />
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
  </>
);

/**
 * Lighting for the ship, shared by both rockets that fly it.
 *
 * The background view carries only a dim ambient light, which is all the
 * clouds need, so the key light lives with the rocket and exists only while
 * one is on screen.
 *
 * The fill matters as much as the key. A single light from the front leaves
 * everything behind the ship pure black, so the silhouette disappears
 * entirely through the second half of a barrel roll - the hull stops being a
 * solid object and becomes a shape cut out of the stars.
 */
export const RocketLight: React.FC = () => (
  <>
    <directionalLight position={[2, 3, 5]} intensity={2.2} />
    {/* Weak, from behind and below, to keep the far side readable. */}
    <directionalLight position={[-2, -1, -4]} intensity={0.35} />
  </>
);

export default RocketMesh;
