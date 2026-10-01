import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import type { MeshLineGeometry } from "@react-three/drei";
import { AdditiveBlending, Color, Material, ShaderMaterial } from "three";

/**
 * Frames a Trail needs before its line is worth showing.
 *
 * Trail seeds its buffer from the target's *local* position, so until every
 * seeded point has been shifted out the line runs from a stale point to the
 * target - visible as a streak snapping across the sky. Counting frames
 * rather than seconds, because the buffer drains per frame.
 */
export function trailWarmupFrames(length: number, decay: number): number {
  return Math.ceil((length * 10) / decay);
}

/**
 * Per-frame upkeep for a drei Trail: hides it through its warm-up, then keeps
 * it styled.
 *
 * Two things need doing every frame that are easy to get wrong, and both were
 * duplicated verbatim across the satellite and the rocket:
 *
 * - Trail's material is memoised on the canvas size, so it is rebuilt from
 *   defaults on every resize and any styling applied once in an effect is
 *   silently lost. Applying it only when the material's identity changes costs
 *   a reference comparison per frame and survives the rebuild.
 * - The gradient has to be pushed into MeshLine's own uniforms rather than set
 *   through a prop, because `attenuation` only tapers width. This is what
 *   fades the tail out; fading to black matters specifically because the
 *   material blends additively, where black contributes nothing, so the tail
 *   disappears instead of stopping dead.
 *
 * The canvas tone maps with ACES, whose toe would otherwise swallow the dim
 * end of the gradient, so tone mapping is off.
 *
 * Call this once per frame from the caller's own useFrame, with the geometry
 * ref passed to <Trail ref={...}>.
 */
export function useTrailStyle(
  trailRef: RefObject<MeshLineGeometry | null>,
  options: { head: string; tail: string; length: number; decay: number },
): void {
  const { head, tail, length, decay } = options;
  const styledMaterial = useRef<Material | null>(null);
  const frameCount = useRef(0);
  const warmup = trailWarmupFrames(length, decay);

  useFrame(() => {
    const trail = trailRef.current;
    if (!trail) return;

    if (frameCount.current <= warmup) {
      frameCount.current += 1;
      trail.visible = false;
      return;
    }
    trail.visible = true;

    const material = trail.material;
    if (material === styledMaterial.current) return;
    if (!(material instanceof ShaderMaterial)) return;

    material.transparent = true;
    // Depth-tested on purpose: the globe occludes the trail as its object
    // passes behind. The atmosphere shell writes no depth, so only the surface
    // occludes, which is what we want.
    material.depthWrite = false;
    material.blending = AdditiveBlending;
    material.toneMapped = false;

    // mix(gradient[0], gradient[1], counters), where counters runs 0 at the
    // oldest point to 1 at the head.
    material.uniforms.useGradient.value = 1;
    material.uniforms.gradient.value = [new Color(tail), new Color(head)];

    styledMaterial.current = material;
  });
}
