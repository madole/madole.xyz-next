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
          segments={10} // Number of particles
        />
      </Float>
    </Suspense>
  );
};

export default Clouds;
