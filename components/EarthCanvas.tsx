import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import Earth from "./Earth";
import { OrbitControls } from "@react-three/drei";

const EarthCanvas: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <div className="md:absolute bottom-10 right-0 md:right-10 animate-slowFadeIn z-20 motion-reduce:hidden h-64 w-full md:w-64 cursor-pointer active:cursor-grabbing">
        <Canvas gl={{ alpha: true }} camera={{ position: [0, 0, 2] }}>
          <OrbitControls
            autoRotate={true}
            autoRotateSpeed={0.2}
            enableRotate
            enableZoom={false}
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
        </Canvas>
      </div>
    </Suspense>
  );
};

export default EarthCanvas;
