import { Cloud, Float } from "@react-three/drei";
import React, { Suspense } from "react";

const Clouds: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <Float>
        <Cloud
          position={[4, 2, 0]}
          opacity={0.7}
          speed={0.4} // Rotation speed
          width={20} // Width of the full cloud
          depth={2} // Z-dir depth
          segments={10} // Number of particles
        />
      </Float>
    </Suspense>
  );
};

export default Clouds;
