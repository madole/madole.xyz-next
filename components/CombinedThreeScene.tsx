import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, View, PerspectiveCamera } from "@react-three/drei";
import React, { Suspense, lazy, useRef, useState } from "react";
import BackgroundView from "./BackgroundView";
import Earth from "./Earth";
import type { RocketMode } from "../hooks/useRocketMode";

/**
 * The hidden-mode rocket is split into its own chunk and only requested once
 * someone types the code, so the homepage's first load carries none of it.
 */
const Rocket = lazy(() => import("./Rocket"));

/**
 * Component that triggers a callback after multiple frames are rendered
 * This ensures all textures are loaded, uploaded to GPU, and actually rendered
 */
const SceneReadyDetector: React.FC<{ onReady: () => void }> = ({ onReady }) => {
  const frameCount = useRef(0);
  const hasCalledReady = useRef(false);
  const FRAMES_TO_WAIT = 3; // Wait 3 frames to ensure GPU texture upload completion

  useFrame(() => {
    if (!hasCalledReady.current) {
      frameCount.current += 1;

      if (frameCount.current >= FRAMES_TO_WAIT) {
        hasCalledReady.current = true;
        onReady();
      }
    }
  });

  return null;
};

/**
 * Single WebGL context with multiple viewports using drei's View
 * - Background view: fullscreen clouds
 * - Earth view: positioned (centered mobile, bottom-right desktop)
 * This prevents "Context Lost" errors from multiple WebGL contexts
 */
export interface CombinedThreeSceneProps {
  /** Hidden rocket mode; "off" mounts nothing at all. */
  rocketMode?: RocketMode;
  /** Called once the departing rocket is off screen and can be unmounted. */
  onRocketExited?: () => void;
}

const CombinedThreeScene: React.FC<CombinedThreeSceneProps> = ({
  rocketMode = "off",
  onRocketExited = () => {},
}) => {
  const cloudsRef = useRef<HTMLDivElement>(null);
  const earthRef = useRef<HTMLDivElement>(null);
  const [isSceneReady, setIsSceneReady] = useState(false);

  return (
    <>
      {/* Fullscreen clouds view container.
          These tracking divs are the event surface, not just layout probes: drei's View
          calls setEvents({ connected: track.current }) and its compute only fires when
          event.target === track.current. They must keep pointer-events: auto. */}
      <div ref={cloudsRef} className="fixed inset-0 z-0 motion-reduce:hidden" />

      {/* Positioned Earth view container - centered mobile, bottom-right desktop.
          Absolute rather than fixed: the hero section is the containing block, so
          the globe scrolls away with the hero instead of tracking the viewport. */}
      <div
        ref={earthRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-auto md:left-auto md:translate-x-0 md:translate-y-0 md:bottom-10 md:right-10 z-10 motion-reduce:hidden h-80 w-80 md:h-96 md:w-96"
      />

      {/* Single Canvas with multiple Views.

          Positioning has to go through `style`, not `className`. r3f renders its
          wrapper div with an inline `position: relative; width: 100%; height: 100%`
          and spreads `style` over the top, so an inline rule is the only thing that
          can override it - a `fixed` utility class loses to inline styles every
          time. Until this section existed the canvas sat inside a `fixed inset-0`
          parent, so `relative` filled that parent and looked correct by accident.
          Here the parent is a flex column, so a relative canvas becomes a flex item
          a full viewport tall and pushes the hero content down below the fold. */}
      <Canvas
        className={`opacity-0 ${isSceneReady ? "animate-slowFadeIn" : ""}`}
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        }}
        dpr={[1, 2]}
        eventPrefix="client"
      >
        <Suspense fallback={null}>
          {/* Fullscreen background view: stars, clouds, shooting stars */}
          {/* @ts-expect-error - Its fine */}
          <View track={cloudsRef} index={1}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <BackgroundView />
            {/* Its own Suspense boundary: without one, the chunk loading
                would suspend the outer boundary and blank the whole scene. */}
            {rocketMode !== "off" && (
              <Suspense fallback={null}>
                <Rocket
                  leaving={rocketMode === "leaving"}
                  onExited={onRocketExited}
                />
              </Suspense>
            )}
          </View>

          {/* Positioned Earth view */}
          {/* @ts-expect-error - Its fine */}
          <View track={earthRef} index={2}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <OrbitControls
              makeDefault
              autoRotate
              autoRotateSpeed={0.2}
              enableDamping
              dampingFactor={0.08}
              rotateSpeed={0.5}
              enableRotate
              enableZoom={false}
              target={[0, -1, 0]}
            />
            {/* Lighting lives in Earth: the sun direction is shared with the
                night-lights shader mask, so the two cannot drift apart. */}
            <Earth />
          </View>

          {/* Detector to trigger fade-in only after scene is fully loaded and rendered */}
          <SceneReadyDetector onReady={() => setIsSceneReady(true)} />
        </Suspense>
      </Canvas>
    </>
  );
};

export default CombinedThreeScene;
