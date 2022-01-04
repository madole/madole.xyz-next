import { Cloud, Float } from "@react-three/drei";
import React, { Suspense } from "react";

export interface CloudsProps {}

const Clouds: React.FC<CloudsProps> = (props) => {
  return (
    <Suspense fallback={null}>
      <Float>
        <Cloud
          position={[4, 2, 0]}
          opacity={0.3}
          speed={0.4} // Rotation speed
          width={20} // Width of the full cloud
          depth={0.5} // Z-dir depth
          segments={20} // Number of particles
        />
      </Float>
    </Suspense>
  );
};

export default Clouds;
