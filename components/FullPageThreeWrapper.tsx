import { Canvas } from "@react-three/fiber";
import React from "react";

export interface ThreeWrapperProps {
  children: React.ReactNode;
}

const FullPageThreeWrapper: React.FC<ThreeWrapperProps> = (props) => {
  const { children } = props;
  return (
    <div className="inset-0 animate-slowFadeIn z-0 motion-reduce:hidden fixed">
      <Canvas camera={{ position: [0, 0, 2] }}>
        <mesh />
        <ambientLight />
        {children}
      </Canvas>
    </div>
  );
};

export default FullPageThreeWrapper;
