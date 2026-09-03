import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import {
  CanvasTexture,
  DoubleSide,
  Group,
  MathUtils,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  SRGBColorSpace,
} from "three";
import { HINT_TEXT } from "../hooks/useRocketHint";
import RocketMesh from "./RocketMesh";
import { FLIGHT_DISTANCE, FLIGHT_Z } from "./sceneConstants";

/** World units per second. About a third of the view width per second: readable at a glance. */
const SPEED = 1.1;
/**
 * Height of the flight path as a fraction of the view's half-height. The hero
 * heading sits near the middle on desktop and the canvas renders behind it, so
 * the banner flies through the empty band above the name rather than behind it.
 */
const PATH_Y = 0.66;
/** Gentle vertical drift, in world units, so the tow does not look on rails. */
const BOB_AMPLITUDE = 0.05;
const BOB_SPEED = 0.9;
/** Slight roll of the ship, in radians, for the same reason. */
const ROLL_AMPLITUDE = 0.05;
const ROLL_SPEED = 1.3;

const SHIP_SCALE = 0.55;
/** Where the nozzle ends up once the ship is turned to point along +X. */
const NOZZLE_OFFSET = -0.32 * SHIP_SCALE;
const ROPE_LENGTH = 0.3;
const ROPE_RADIUS = 0.008;
const ROPE_COLOR = "#cfd6e4";

const BANNER_WIDTH = 1.4;
const BANNER_HEIGHT = 0.35;
/** Segments across the banner; the ripple is applied per vertex each frame. */
const BANNER_SEGMENTS_X = 24;
const BANNER_SEGMENTS_Y = 3;

/** Travelling wave along the banner: amplitude in world units, frequency per unit. */
const WAVE_AMPLITUDE = 0.07;
const WAVE_FREQUENCY = 9;
const WAVE_SPEED = 5;
/** How far the free end sags below the tow point. */
const DROOP = 0.05;

/** Ship points +Y in its own space; -PI/2 turns it to fly along +X. */
const HEADING_RIGHT = -Math.PI / 2;

/**
 * Painted at a size that stays crisp on a 2x display: the banner covers a bit
 * under a third of the view width, so ~800 device pixels is the worst case.
 */
const TEXTURE_WIDTH = 1024;
const TEXTURE_HEIGHT = Math.round(
  (TEXTURE_WIDTH * BANNER_HEIGHT) / BANNER_WIDTH,
);
const BANNER_FILL = "#f6f1e4";
const BANNER_STRIPE = "#ff5a5f";
const BANNER_INK = "#171436";

/**
 * The banner artwork, drawn into a 2D canvas and uploaded as a texture.
 *
 * drei's <Text> would be the obvious way to put words in the scene, but it
 * pulls in troika-three-text - close to a megabyte before minification, plus a
 * font to fetch - for one short string. A canvas costs nothing extra and
 * matches how Satellite and ShootingStars build their textures.
 */
function useBannerTexture(text: string): CanvasTexture | null {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = TEXTURE_WIDTH;
    canvas.height = TEXTURE_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const radius = TEXTURE_HEIGHT * 0.18;
    const inset = TEXTURE_HEIGHT * 0.06;
    const w = TEXTURE_WIDTH - inset * 2;
    const h = TEXTURE_HEIGHT - inset * 2;

    ctx.fillStyle = BANNER_FILL;
    ctx.beginPath();
    // roundRect is everywhere current, but a plain rect is a fine fallback.
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(inset, inset, w, h, radius);
    } else {
      ctx.rect(inset, inset, w, h);
    }
    ctx.fill();

    // Stripes top and bottom pick up the rocket's nose colour.
    const stripe = TEXTURE_HEIGHT * 0.045;
    ctx.fillStyle = BANNER_STRIPE;
    ctx.fillRect(inset + radius, inset, w - radius * 2, stripe);
    ctx.fillRect(inset + radius, inset + h - stripe, w - radius * 2, stripe);

    ctx.fillStyle = BANNER_INK;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const font = (size: number) =>
      `bold ${size}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
    // Shrink to fit rather than trusting one hard-coded size across platforms,
    // where the fallback font may be wider than the one measured against.
    let size = Math.round(TEXTURE_HEIGHT * 0.46);
    ctx.font = font(size);
    const maxWidth = w * 0.84;
    while (ctx.measureText(text).width > maxWidth && size > 8) {
      size -= 4;
      ctx.font = font(size);
    }
    ctx.fillText(text, TEXTURE_WIDTH / 2, TEXTURE_HEIGHT / 2);

    const result = new CanvasTexture(canvas);
    result.colorSpace = SRGBColorSpace;
    result.needsUpdate = true;
    return result;
  }, [text]);

  // Unlike the always-mounted scene textures, this one goes away after a
  // single pass, so it gives its GPU memory back.
  useEffect(() => () => texture?.dispose(), [texture]);

  return texture;
}

export interface HintRocketProps {
  /** Called once the whole tow has cleared the far edge. */
  onDone: () => void;
}

/**
 * A rocket that tows a banner across the sky once, advertising the hidden
 * mode, in the manner of a light aircraft over a beach.
 *
 * Lives in the background view alongside the playable rocket and shares its
 * geometry through RocketMesh, so it is recognisably the same craft as the one
 * you get for typing the code. It takes no input and never interacts with the
 * globe; the homepage decides whether it should ever appear at all - see
 * useRocketHint for the pointer, motion, visibility and once-only gates.
 *
 * The ship and banner are siblings under one moving group rather than parent
 * and child, so the banner stays level while the ship rolls.
 */
const HintRocket: React.FC<HintRocketProps> = ({ onDone }) => {
  const groupRef = useRef<Group>(null);
  const shipRef = useRef<Group>(null);
  const flameRef = useRef<Mesh>(null);
  const bannerRef = useRef<Mesh>(null);
  const texture = useBannerTexture(HINT_TEXT);

  const done = useRef(false);
  const started = useRef(false);
  /** The plane's vertices as generated, before any ripple is applied. */
  const restPositions = useRef<Float32Array | null>(null);

  /** Nose to banner tail: how far past the edge the group must travel. */
  const towLength = ROPE_LENGTH + BANNER_WIDTH + 1;

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const camera = state.camera as PerspectiveCamera;
    const dt = Math.min(delta, 0.1);
    const halfH =
      FLIGHT_DISTANCE * Math.tan(MathUtils.degToRad(camera.fov / 2));
    const halfW = halfH * camera.aspect;
    const time = state.clock.elapsedTime;

    // Start off the left edge, far enough out that the banner is off too.
    if (!started.current) {
      started.current = true;
      group.position.set(-halfW - towLength, halfH * PATH_Y, FLIGHT_Z);
    }

    group.position.x += SPEED * dt;
    group.position.y =
      halfH * PATH_Y + Math.sin(time * BOB_SPEED) * BOB_AMPLITUDE;

    if (shipRef.current) {
      shipRef.current.rotation.z =
        HEADING_RIGHT + Math.sin(time * ROLL_SPEED) * ROLL_AMPLITUDE;
    }

    if (group.position.x > halfW + towLength && !done.current) {
      done.current = true;
      onDone();
    }

    // Flame flickers steadily: it is towing something, so it never idles.
    const flame = flameRef.current;
    if (flame) {
      const flicker = 0.85 + 0.15 * Math.sin(time * 47);
      flame.scale.set(flicker, 0.9 + 0.3 * flicker, flicker);
    }

    // Ripple the banner like fabric. A flat plane reads as a rigid board.
    const banner = bannerRef.current;
    if (!banner) return;
    const attribute = (banner.geometry as PlaneGeometry).attributes.position;
    if (!restPositions.current) {
      restPositions.current = Float32Array.from(attribute.array);
    }
    const rest = restPositions.current;
    for (let i = 0; i < attribute.count; i += 1) {
      const x = rest[i * 3];
      const y = rest[i * 3 + 1];
      // 0 at the towed edge, 1 at the free end: the wave and the sag both grow
      // with distance from where the rope holds it.
      const slack = (BANNER_WIDTH / 2 - x) / BANNER_WIDTH;
      attribute.setZ(
        i,
        Math.sin(x * WAVE_FREQUENCY - time * WAVE_SPEED) *
          WAVE_AMPLITUDE *
          slack,
      );
      attribute.setY(i, y - DROOP * slack * slack);
    }
    attribute.needsUpdate = true;
  });

  return (
    <group ref={groupRef} position={[0, -100, FLIGHT_Z]}>
      {/* The background view carries only a dim ambient light for the clouds;
          the hull needs a key light to read as a solid. */}
      <directionalLight position={[2, 3, 5]} intensity={2.2} />

      <group ref={shipRef} scale={SHIP_SCALE} rotation={[0, 0, HEADING_RIGHT]}>
        <RocketMesh flameRef={flameRef} />
      </group>

      {/* Tow rope, from the nozzle back to the banner's leading edge */}
      <mesh
        position={[NOZZLE_OFFSET - ROPE_LENGTH / 2, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[ROPE_RADIUS, ROPE_RADIUS, ROPE_LENGTH, 6]} />
        <meshBasicMaterial color={ROPE_COLOR} toneMapped={false} />
      </mesh>

      <mesh
        ref={bannerRef}
        position={[NOZZLE_OFFSET - ROPE_LENGTH - BANNER_WIDTH / 2, 0, 0]}
      >
        <planeGeometry
          args={[
            BANNER_WIDTH,
            BANNER_HEIGHT,
            BANNER_SEGMENTS_X,
            BANNER_SEGMENTS_Y,
          ]}
        />
        {/* Unlit so the words stay evenly readable, and double sided because
            the ripple turns parts of it away from the camera. */}
        <meshBasicMaterial
          map={texture}
          transparent
          side={DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

export default HintRocket;
