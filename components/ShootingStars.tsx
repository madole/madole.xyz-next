import { useFrame, useThree } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  Color,
  DataTexture,
  Mesh,
  RGBAFormat,
  SRGBColorSpace,
} from "three";

export interface ShootingStarsProps {
  /** Seconds between one star leaving the screen and the next appearing. */
  minDelay?: number;
  maxDelay?: number;
  /** World units per second. */
  minSpeed?: number;
  maxSpeed?: number;
  /** Length and thickness of the streak, in world units. */
  length?: number;
  thickness?: number;
  headColor?: string;
  tailColor?: string;
}

/**
 * A one-dimensional gradient running from a transparent tail to an opaque head,
 * used as the streak's colour ramp. Built once; 64 texels is plenty for a
 * smooth falloff at this size.
 */
function useStreakTexture(headColor: string, tailColor: string) {
  return useMemo(() => {
    const width = 64;
    const head = new Color(headColor);
    const tail = new Color(tailColor);
    const data = new Uint8Array(width * 4);

    for (let i = 0; i < width; i += 1) {
      const t = i / (width - 1);
      const colour = tail.clone().lerp(head, t);
      data[i * 4 + 0] = colour.r * 255;
      data[i * 4 + 1] = colour.g * 255;
      data[i * 4 + 2] = colour.b * 255;
      // Squared so the tail fades out quickly and the head stays bright.
      data[i * 4 + 3] = Math.round(t * t * 255);
    }

    const texture = new DataTexture(data, width, 1, RGBAFormat);
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [headColor, tailColor]);
}

/**
 * A single shooting star crossing the background view.
 *
 * Everything lives in refs and is mutated inside useFrame, so this renders once
 * and never again. The previous DOM implementation drove position through React
 * state, which cost a full reconciliation every frame while a star was in flight.
 */
export const ShootingStars: React.FC<ShootingStarsProps> = ({
  minDelay = 10,
  maxDelay = 30,
  minSpeed = 1.5,
  maxSpeed = 3.5,
  length = 0.9,
  thickness = 0.02,
  headColor = "#9E00FF",
  tailColor = "#2EB9DF",
}) => {
  const meshRef = useRef<Mesh>(null);
  const texture = useStreakTexture(headColor, tailColor);
  const viewport = useThree((state) => state.viewport);

  // Start hidden, with the first star due after a short random delay.
  const flight = useRef({
    active: false,
    nextAt: minDelay * Math.random(),
    vx: 0,
    vy: 0,
  });

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const now = state.clock.elapsedTime;
    const current = flight.current;
    // Half-extents plus a margin, so stars enter and leave fully off-screen.
    const halfWidth = viewport.width / 2 + length;
    const halfHeight = viewport.height / 2 + length;

    if (!current.active) {
      if (now < current.nextAt) {
        mesh.visible = false;
        return;
      }

      // Enter from the top or the left, travelling diagonally across and down.
      const fromTop = Math.random() < 0.5;
      const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
      const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.6;

      current.vx = Math.cos(angle) * speed;
      current.vy = Math.sin(angle) * speed;
      current.active = true;

      mesh.position.set(
        fromTop ? (Math.random() - 0.5) * viewport.width : -halfWidth,
        fromTop ? halfHeight : (Math.random() - 0.5) * viewport.height,
        0
      );
      mesh.rotation.z = angle;
    }

    mesh.visible = true;
    mesh.position.x += current.vx * delta;
    mesh.position.y += current.vy * delta;

    const escaped =
      mesh.position.x > halfWidth ||
      mesh.position.x < -halfWidth ||
      mesh.position.y > halfHeight ||
      mesh.position.y < -halfHeight;

    if (escaped) {
      current.active = false;
      current.nextAt = now + minDelay + Math.random() * (maxDelay - minDelay);
      mesh.visible = false;
    }
  });

  return (
    <mesh ref={meshRef} visible={false} scale={[length, thickness, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
};

export default ShootingStars;
