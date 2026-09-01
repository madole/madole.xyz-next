import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";
import { Color, Vector3 } from "three";

/**
 * Additive fresnel shell rendered on the back faces of a sphere slightly larger
 * than the globe. The rim brightens towards the silhouette, and the whole thing
 * is damped on the night side so the glow follows the terminator rather than
 * ringing the planet evenly.
 */
export const AtmosphereMaterial = shaderMaterial(
  {
    uColor: new Color("#4a8fdd"),
    uSunDirection: new Vector3(1, 0, 0),
    uIntensity: 1.0,
    uPower: 3.0,
  },
  /* glsl */ `
    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;

    void main() {
      vWorldNormal = normalize(mat3(modelMatrix) * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  /* glsl */ `
    uniform vec3 uColor;
    uniform vec3 uSunDirection;
    uniform float uIntensity;
    uniform float uPower;

    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;

    void main() {
      vec3 normal = normalize(vWorldNormal);
      vec3 viewDirection = normalize(cameraPosition - vWorldPosition);

      // Rendered with side: BackSide, so the normal faces away from the camera.
      // abs() gives the same rim falloff without needing to flip it.
      float fresnel = pow(1.0 - abs(dot(normal, viewDirection)), uPower);

      // Fade the glow out across the terminator and into the night side.
      float daylight = smoothstep(-0.35, 0.35, dot(normal, uSunDirection));

      float alpha = fresnel * uIntensity * mix(0.12, 1.0, daylight);
      gl_FragColor = vec4(uColor, clamp(alpha, 0.0, 1.0));
    }
  `
);

extend({ AtmosphereMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    atmosphereMaterial: ThreeElement<typeof AtmosphereMaterial>;
  }
}
