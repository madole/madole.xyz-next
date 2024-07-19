import { Cloud, Float } from "@react-three/drei";
import React, { Suspense } from "react";

const Clouds: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <Float>
        <Cloud
          seed={20}
          color={"black"}
          opacity={0.4}
          speed={0.05} // Rotation speed
          concentrate={"random"}
        />
      </Float>
    </Suspense>
  );
};

export default Clouds;
