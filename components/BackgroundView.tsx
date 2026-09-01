import { useFrame, useThree } from "@react-three/fiber";
import { Cloud, Clouds, Float, Stars } from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import { MeshBasicMaterial } from "three";
import ShootingStars from "./ShootingStars";

/** How far the camera drifts from centre at the edges of the viewport. */
const PARALLAX_RANGE = 0.15;
const PARALLAX_EASE = 1.5;

/**
 * Eases the background camera towards the pointer. Small enough to read as
 * depth rather than as an effect, and only worthwhile now that the starfield is
 * in the scene rather than flat in a DOM canvas above it.
 *
 * This deliberately uses a window listener rather than R3F's state.pointer.
 * drei's View calls setEvents({ connected: track.current }) on mount, so with
 * two views the last one mounted owns the DOM listeners - here that is the
 * Earth's tracking div. This view's state.pointer would never update, and the
 * parallax would silently do nothing.
 */
const PointerParallax: React.FC = () => {
  const camera = useThree((state) => state.camera);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      target.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  useFrame((_, delta) => {
    // Frame-rate independent easing towards the target offset.
    const t = 1 - Math.exp(-PARALLAX_EASE * delta);
    camera.position.x += (target.current.x * PARALLAX_RANGE - camera.position.x) * t;
    camera.position.y += (target.current.y * PARALLAX_RANGE - camera.position.y) * t;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

/**
 * Contents of the fullscreen background view: starfield, drifting clouds and an
 * occasional shooting star.
 *
 * These were previously three independent systems - a WebGL canvas, a 2D canvas
 * redrawing every star every frame, and an SVG driven by React state - stacked
 * on top of each other. Consolidating them leaves one rAF loop, one compositing
 * layer, and lets the stars sit behind the clouds with real depth.
 */
export const BackgroundView: React.FC = () => (
  <>
    <ambientLight intensity={0.3} />
    <PointerParallax />

    {/*
      `factor` is the only size knob drei exposes: it seeds a per-star size of
      (0.5 + 0.5 * random) * factor, which the shader turns into
      gl_PointSize = size * (30 / -z) * (3 + sin(time)).

      At factor 3, with stars sitting 80-120 units out, that worked out to
      roughly 1-3.5 device pixels - under half a CSS pixel at the small end on a
      2x display, which is why they read as dust on the screen rather than sky.
      7 puts the typical star near 2.5 CSS px, still small but unmistakably a
      star, and `fade` keeps the edges soft so they do not turn into squares.
    */}
    <Stars
      radius={80}
      depth={40}
      count={1200}
      factor={7}
      saturation={0}
      fade
      speed={0.4}
    />

    <ShootingStars />

    {/*
      Clouds (plural) batches every child Cloud into a single instanced draw
      call, and MeshBasicMaterial skips lighting entirely - the backdrop does not
      need it. Several layered instances read far better than the single cloud
      this replaces.
    */}
    <Float speed={0.6} rotationIntensity={0.2} floatIntensity={0.4}>
      <Clouds material={MeshBasicMaterial} limit={300}>
        <Cloud
          seed={20}
          bounds={[6, 1.5, 1.5]}
          volume={5}
          color="#0d0a17"
          opacity={0.22}
          speed={0.05}
          concentrate="random"
          position={[0, 0, 0]}
        />
        <Cloud
          seed={7}
          bounds={[8, 2, 1]}
          volume={4}
          color="#1a1433"
          opacity={0.16}
          speed={0.08}
          concentrate="outside"
          position={[-1.5, -0.6, -1.5]}
        />
        <Cloud
          seed={13}
          bounds={[5, 1.5, 1]}
          volume={3}
          color="#3c306b"
          opacity={0.18}
          speed={0.04}
          concentrate="inside"
          position={[2, 0.8, -0.8]}
        />
      </Clouds>
    </Float>
  </>
);

export default BackgroundView;
