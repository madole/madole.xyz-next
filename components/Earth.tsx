import React, { useRef } from "react";
import { Sphere, useTexture } from "@react-three/drei";
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
  const earthRef = useRef<SphereType>();
  const cloudRef = useRef<SphereType>();

  useFrame(() => {
    if (!earthRef.current || !cloudRef.current) return;
    earthRef.current.rotation.y = earthRef.current.rotation.y - 0.002;
    cloudRef.current.rotation.y = cloudRef.current.rotation.y - 0.0005;
    cloudRef.current.rotation.x = cloudRef.current.rotation.x - 0.0005;
  });

  return (
    <group position={[0, 0, 0]}>
      <ambientLight />
      <directionalLight position={[10, 10, 20]} />
      {/* @ts-ignore*/}
      <Sphere args={[1, 32, 32]} ref={earthRef}>
        <meshPhongMaterial
          map={texture}
          bumpMap={bumpMap}
          bumpScale={0.2}
          specularMap={specMap}
          specular={new Color("grey")}
        />
      </Sphere>
      {/* @ts-ignore*/}
      <Sphere args={[1.02, 32, 32]} ref={cloudRef}>
        <meshPhongMaterial map={clouds} transparent={true} opacity={0.8} />
      </Sphere>
    </group>
  );
};

export default Earth;
