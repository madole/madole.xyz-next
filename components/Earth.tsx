import { useCursor, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  BackSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  NoColorSpace,
  SRGBColorSpace,
  Texture,
  Vector3,
} from "three";
import { AtmosphereMaterial } from "./earthAtmosphere";
import Satellite from "./Satellite";

/**
 * Direction the sun comes from, in world space. The directional light and the
 * night-lights shader mask both derive from this single value - if they drift
 * apart, city lights appear on the daylit side.
 */
export const SUN_DIRECTION = new Vector3(-1.4, 0.4, 0.9).normalize();
const SUN_DISTANCE = 12;

const EARTH_RADIUS = 1.5;
const CLOUD_RADIUS = EARTH_RADIUS * 1.012;
const ATMOSPHERE_RADIUS = EARTH_RADIUS * 1.035;
const SEGMENTS = 64;

/** Clear of the atmosphere shell, and still inside the view's scissor box. */
const SATELLITE_ORBIT_RADIUS = EARTH_RADIUS * 1.28;

/** Radians per second, applied against delta so the rate is display independent. */
const EARTH_SPIN = 0.02;
const CLOUD_SPIN = 0.03;

type EarthTextures = {
  day: Texture;
  night: Texture;
  /** R = elevation bump, G = roughness, B = cloud coverage. */
  brc: Texture;
};

/**
 * String replacement into three's shader source, which fails loudly.
 *
 * A miss here is invisible at runtime - String.replace just returns the source
 * unchanged and the shader compiles fine, it simply does the wrong thing. Both
 * of the patches below already regressed once this way, because
 * onBeforeCompile runs before three resolves #include directives.
 */
function patchShader(
  source: string,
  anchor: string,
  replacement: string,
  label: string
): string {
  if (!source.includes(anchor)) {
    const message =
      `Earth shader patch "${label}" found no anchor ${anchor}. ` +
      "three's shader chunks have probably changed.";
    if (process.env.NODE_ENV !== "production") throw new Error(message);
    console.error(message);
    return source;
  }
  return source.replace(anchor, replacement);
}

const Earth: React.FC = () => {
  const maxAnisotropy = useThree((state) =>
    state.gl.capabilities.getMaxAnisotropy()
  );

  const { day, night, brc } = useTexture({
    day: "/earth/earth-day-2048.webp",
    night: "/earth/earth-night-2048.webp",
    brc: "/earth/earth-brc-1024.webp",
  }) as EarthTextures;

  /**
   * Configured here rather than through useTexture's onLoad callback. Given an
   * object of urls, drei hands the callback the raw useLoader result - a
   * positional array - and only the value it returns is keyed back up. So
   * destructuring names out of the callback argument yields undefined, and the
   * first assignment throws.
   *
   * useMemo rather than an effect because three bakes colorSpace into the
   * shader program: it has to be right before the materials below first
   * compile, not a frame later.
   */
  useMemo(() => {
    // Neither three's TextureLoader nor drei's useTexture sets colorSpace, so
    // the default is NoColorSpace. The albedo and city lights are sRGB-encoded
    // and must say so or they render with the wrong gamma. The packed texture
    // is non-colour data and must stay linear.
    day.colorSpace = SRGBColorSpace;
    night.colorSpace = SRGBColorSpace;
    brc.colorSpace = NoColorSpace;
    day.anisotropy = maxAnisotropy;
    night.anisotropy = maxAnisotropy;
    brc.anisotropy = maxAnisotropy;
  }, [day, night, brc, maxAnisotropy]);

  const earthRef = useRef<Mesh>(null);
  const cloudRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  useCursor(hovered);

  /**
   * roughnessMap reads the green channel by convention (glTF ORM) and bumpMap
   * reads the red, which is exactly how the packed texture is laid out, so both
   * bind with no patching. The night lights do need a patch: emissivemap_fragment
   * multiplies unconditionally, which would light up cities on the day side too.
   */
  const earthMaterial = useMemo(() => {
    const material = new MeshStandardMaterial({
      map: day,
      emissiveMap: night,
      emissive: "#ffffff",
      emissiveIntensity: 1.4,
      roughnessMap: brc,
      roughness: 1,
      metalness: 0,
      bumpMap: brc,
      // bumpScale became UV-scale-invariant in r158, so the values in older
      // earth demos do not transfer. Real relief is a rounding error against a
      // 1.5 unit radius; this is a deliberate exaggeration, kept low enough that
      // it only shows as texture near the terminator.
      bumpScale: 0.04,
    });

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uSunDirection = { value: SUN_DIRECTION };

      shader.vertexShader = patchShader(
        patchShader(
          shader.vertexShader,
          "#include <common>",
          "#include <common>\nvarying vec3 vEarthWorldNormal;",
          "vertex varying declaration"
        ),
        "#include <worldpos_vertex>",
        "#include <worldpos_vertex>\nvEarthWorldNormal = normalize(mat3(modelMatrix) * objectNormal);",
        "vertex world normal"
      );

      // onBeforeCompile runs before three resolves #include directives
      // (WebGLRenderer.js:2216 vs WebGLProgram.js:790), so the chunk bodies are
      // not in the source yet. Anchor on the directive and inline the chunk.
      shader.fragmentShader = patchShader(
        patchShader(
          shader.fragmentShader,
          "#include <common>",
          "#include <common>\nuniform vec3 uSunDirection;\nvarying vec3 vEarthWorldNormal;",
          "fragment uniform declaration"
        ),
        "#include <emissivemap_fragment>",
          /* glsl */ `
          #ifdef USE_EMISSIVEMAP
            vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
            float sunAlignment = dot( normalize( vEarthWorldNormal ), uSunDirection );
            // Full brightness only well past the terminator, so the lights come
            // up as the surface turns away from the sun rather than snapping on.
            float nightMask = 1.0 - smoothstep( -0.12, 0.22, sunAlignment );
            totalEmissiveRadiance *= emissiveColor.rgb * nightMask;
          #endif
          `,
        "night lights terminator mask"
      );
    };

    // Without this three may hand back a cached program compiled from the
    // unpatched source.
    material.customProgramCacheKey = () => "earth-surface-night-mask";

    return material;
  }, [day, night, brc]);

  /**
   * alphamap_fragment samples `.g`, but cloud coverage is packed into `.b`.
   * Left unpatched this would silently use the ocean-roughness mask as cloud
   * cover, which looks plausible enough at a glance to be missed.
   */
  const cloudMaterial = useMemo(() => {
    const material = new MeshStandardMaterial({
      color: "#ffffff",
      alphaMap: brc,
      transparent: true,
      opacity: 0.85,
      roughness: 1,
      metalness: 0,
      depthWrite: false,
    });

    material.onBeforeCompile = (shader) => {
      // Same constraint as above: replace the directive, not the chunk body.
      shader.fragmentShader = patchShader(
        shader.fragmentShader,
        "#include <alphamap_fragment>",
        /* glsl */ `
        #ifdef USE_ALPHAMAP
          diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).b;
        #endif
        `,
        "cloud alpha from blue channel"
      );
    };
    material.customProgramCacheKey = () => "earth-cloud-alpha-from-blue";

    return material;
  }, [brc]);

  useFrame((_, delta) => {
    // Clamp so a backgrounded tab returning after a long pause does not jump.
    const step = Math.min(delta, 0.1);
    if (earthRef.current) earthRef.current.rotation.y += EARTH_SPIN * step;
    if (cloudRef.current) cloudRef.current.rotation.y += CLOUD_SPIN * step;
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/*
        Higher than it looks. three has been physically correct since r155, so a
        directional light's diffuse term carries a 1/PI factor, and r3f defaults
        the canvas to ACES filmic tone mapping, whose toe crushes shadows.

        The Blue Marble albedo is also strongly bimodal - ocean sits near 0.02
        linear luminance while ice and cloud are close to 1.0 - so raising the
        sun moves the two ends at very different rates. Pushing it through the
        ACES curve, ocean lands at sRGB 16 at intensity 2.6, 29 at 4.5 and 41 at
        6, while the ice caps go 217 / 232 / 240. 6 roughly doubles the apparent
        brightness of the water, which is what reads as "dark", and still leaves
        headroom in the highlights. Past about 8 the caps start flattening out.
      */}
      <directionalLight
        position={SUN_DIRECTION.clone().multiplyScalar(SUN_DISTANCE)}
        intensity={6}
      />
      {/* Just enough to keep the night side from crushing to pure black. */}
      <ambientLight intensity={0.03} />

      <mesh
        ref={earthRef}
        material={earthMaterial}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[EARTH_RADIUS, SEGMENTS, SEGMENTS]} />
      </mesh>

      <mesh ref={cloudRef} material={cloudMaterial}>
        <sphereGeometry args={[CLOUD_RADIUS, SEGMENTS, SEGMENTS]} />
      </mesh>

      <mesh>
        <sphereGeometry args={[ATMOSPHERE_RADIUS, SEGMENTS, SEGMENTS]} />
        <atmosphereMaterial
          key={AtmosphereMaterial.key}
          uSunDirection={SUN_DIRECTION}
          uIntensity={hovered ? 1.5 : 1.1}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          side={BackSide}
        />
      </mesh>

      <Satellite orbitRadius={SATELLITE_ORBIT_RADIUS} />
    </group>
  );
};

export default Earth;
