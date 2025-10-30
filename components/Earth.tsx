import React, { useRef } from "react";
import { Outlines, Sphere, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  BufferGeometry,
  Color,
  Material,
  Mesh,
  NormalBufferAttributes,
} from "three"; // ref type for React Three Drei Sphere

// ref type for React Three Drei Sphere
type SphereType = Mesh<
  BufferGeometry<NormalBufferAttributes>,
  Material | Material[]
>;

const Earth = () => {
  const texture = useTexture("/earth/earthmap1k.jpg");
  const bumpMap = useTexture("/earth/earthbump1k.jpg");
  const specMap = useTexture("/earth/earthspec1k.jpg");
  const clouds = useTexture("/earth/clouds.webp");
  const earthRef = useRef<SphereType | null>(null);
  const cloudRef = useRef<SphereType | null>(null);

  useFrame(() => {
    if (!earthRef.current || !cloudRef.current) return;
    earthRef.current.rotation.y = earthRef.current.rotation.y - 0.002;
    cloudRef.current.rotation.y = cloudRef.current.rotation.y - 0.0005;
    cloudRef.current.rotation.x = cloudRef.current.rotation.x - 0.0005;
  });

  const [hovering, setHovering] = React.useState(false);

  return (
    <group position={[0, -1, 0]}>
      <ambientLight />
      <directionalLight position={[10, 10, 20]} />
      <Sphere
        args={[1.5, 32, 32]}
        /* @ts-ignore*/
        ref={earthRef}
        onPointerEnter={() => {
          setHovering(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setHovering(false);
          document.body.style.cursor = "auto";
        }}
      >
        <meshPhongMaterial
          map={texture}
          bumpMap={bumpMap}
          bumpScale={0.2}
          specularMap={specMap}
          specular={new Color("grey")}
        />
        {hovering && (
          <Outlines
            screenspace={false}
            thickness={0.06}
            color="white"
            angle={0}
            opacity={0.5}
            transparent={true}
          />
        )}
      </Sphere>
      {/* @ts-ignore*/}
      <Sphere args={[1.52, 32, 32]} ref={cloudRef}>
        <meshPhongMaterial map={clouds} transparent={true} opacity={0.8} />
      </Sphere>
    </group>
  );
};

export default Earth;
