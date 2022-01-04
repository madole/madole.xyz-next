import { Canvas } from "@react-three/fiber";
import React from "react";

export interface ThreeWrapperProps {
  children: React.ReactNode;
}

const ThreeWrapper: React.FC<ThreeWrapperProps> = (props) => {
  const { children } = props;
  return (
    <div className="absolute inset-0 animate-slowFadeIn z-0 motion-reduce:hidden">
      <Canvas>
        <ambientLight />
        {children}
      </Canvas>
    </div>
  );
};

export default ThreeWrapper;
