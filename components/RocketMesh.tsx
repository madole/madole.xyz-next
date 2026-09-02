import React from "react";
import { AdditiveBlending, Group, Mesh } from "three";

const HULL_COLOR = "#eef2f8";
const NOSE_COLOR = "#ff5a5f";
const FIN_COLOR = "#ff5a5f";
const NOZZLE_COLOR = "#3a3f4b";
const WINDOW_COLOR = "#7fd0ff";
const FLAME_COLOR = "#ffb347";

export interface RocketMeshProps {
  /** The nozzle group. Exhaust trails anchor here. */
  nozzleRef?: React.RefObject<Group | null>;
  /** The flame cone, scaled per frame to burn or idle. */
  flameRef?: React.RefObject<Mesh | null>;
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

    {/* Nozzle; exhaust trails anchor here */}
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
      <mesh ref={flameRef} position={[0, -0.2, 0]} rotation={[Math.PI, 0, 0]}>
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
  </>
);

export default RocketMesh;
