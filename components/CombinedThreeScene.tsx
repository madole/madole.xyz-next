import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Cloud,
  Float,
  View,
  PerspectiveCamera,
} from "@react-three/drei";
import React, { Suspense, useRef } from "react";
import Earth from "./Earth";

/**
 * Single WebGL context with multiple viewports using drei's View
 * - Background view: fullscreen clouds
 * - Earth view: positioned (centered mobile, bottom-right desktop)
 * This prevents "Context Lost" errors from multiple WebGL contexts
 */
const CombinedThreeScene: React.FC = () => {
  const cloudsRef = useRef<HTMLDivElement>(null);
  const earthRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Fullscreen clouds view container */}
      <div
        ref={cloudsRef}
        className="fixed inset-0 animate-slowFadeIn z-0 motion-reduce:hidden"
      />

      {/* Positioned Earth view container - centered mobile, bottom-right desktop */}
      <div
        ref={earthRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-auto md:left-auto md:translate-x-0 md:translate-y-0 md:bottom-10 md:right-10 animate-slowFadeIn z-2 motion-reduce:hidden h-80 w-80 md:h-96 md:w-96 z-10"
      />

      {/* Single Canvas with multiple Views */}
      <Canvas
        className="fixed inset-0"
        style={{ zIndex: 0 }}
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
          {/* Fullscreen clouds view */}
          {/* @ts-expect-error - Its fine */}
          <View track={cloudsRef} index={1}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight intensity={0.3} />
            <Float>
              <Cloud
                seed={20}
                color={"black"}
                opacity={0.4}
                speed={0.05}
                concentrate={"random"}
                position={[0, 0, 0]}
              />
            </Float>
          </View>

          {/* Positioned Earth view */}
          {/* @ts-expect-error - Its fine */}
          <View track={earthRef} index={2}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <OrbitControls
              autoRotate={true}
              autoRotateSpeed={0.2}
              enableRotate
              enableZoom={false}
              target={[0, -1, 0]}
            />
            <hemisphereLight intensity={0.85} />
            <ambientLight intensity={1} />
            <spotLight
              position={[-200, 100, 50]}
              angle={0.3}
              penumbra={0.5}
              intensity={0.8}
              castShadow
              color={"white"}
            />
            <Earth />
          </View>
        </Suspense>
      </Canvas>
    </>
  );
};

export default CombinedThreeScene;
