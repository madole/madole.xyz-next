import { useFrame, useThree } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import { Sparkles, Trail } from "@react-three/drei";

/**
 * A component that renders the Sparkles ReactThree Drei component and it follows the mouse around the screen.
 * @constructor
 */
export const SparksThatFollowTheMouse = () => {
  const canvas = useThree((state) => state.gl.domElement);
  const camera = useThree((state) => state.camera);
  const [mousePosition, setMousePosition] = useState({ x: -20000, y: -200000 });
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const sparklesRef = useRef<any>();

  useFrame(() => {
    const { x, y } = mousePosition;
    const vec = new Vector3(x, y, 0);
    vec.unproject(camera);
    const dir = vec.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const position = camera.position.clone().add(dir.multiplyScalar(distance));
    sparklesRef.current.position.copy(position);
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const updateMousePosition = (event: MouseEvent) => {
      clearTimeout(timeoutId);
      const { clientX, clientY } = event;
      const { left, top, width, height } = canvas.getBoundingClientRect();
      const x = ((clientX - left) / width) * 2 - 1;
      const y = -((clientY - top) / height) * 2 + 1;
      setMousePosition({ x, y });
      setIsMouseMoving(true);
      timeoutId = setTimeout(() => {
        setIsMouseMoving(false);
      }, 300); // Adjust the timeout duration as needed
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      clearTimeout(timeoutId);
    };
  }, [canvas]);

  return (
    <Suspense fallback={null}>
      <Trail
        width={0.1}
        color={"skyblue"} // Color of the line
        length={1} // Length of the line
        decay={0.5} // How fast the line fades away
        local={true} // Wether to use the target's world or local positions
        stride={0} // Min distance between previous and current point
        interval={1} // Number of frames to wait before next calculation
        target={undefined} // Optional target. This object will produce the trail.
        attenuation={(width) => width} // A function to define the width in each point along it.
      >
        <Sparkles
          count={10}
          size={3}
          color={"skyblue"}
          ref={sparklesRef}
          opacity={isMouseMoving ? 0 : 1}
        />
      </Trail>
    </Suspense>
  );
};
