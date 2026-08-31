# Homepage 3D Overhaul — Implementation Plan

Rebuild the `madole.xyz` homepage: upgrade the three.js stack, collapse three competing
animation systems into one, rebuild the Earth properly, and give the page somewhere to go.

**Base branch:** `main` (`14578fd`)
**Stack prefix:** `home3d/`

---

## Context: what's wrong today

The homepage (`pages/index.tsx`) renders a fixed, non-scrolling hero with a WebGL scene
(`components/CombinedThreeScene.tsx`) plus two independent DOM animation layers. Audit findings:

### Bugs

| # | Finding | Location |
|---|---|---|
| B1 | **The Earth is not interactive at all.** `StarsBackground`'s canvas, `ShootingStars`' SVG and the content overlay are all `absolute inset-0` with `pointer-events: auto`, painting above the WebGL canvas. The empty `earthRef` tracking div sits at `z-10` above everything and swallows pointer events over the globe. `OrbitControls` drag, the hover `Outlines` and the cursor change are all dead paths in production. | `index.tsx:95`, `CombinedThreeScene.tsx:54` |
| B2 | **Day map is sampled as linear, not sRGB.** three's `TextureLoader` does not set `colorSpace` (verified in source) and neither does drei's `useTexture`. Default is `NoColorSpace`. The Earth's albedo has been rendering with the wrong gamma. | `Earth.tsx:19` |
| B3 | **`ShootingStars` does one full React render per frame.** `setStar` → state change → effect re-runs → schedules next rAF. ~60 reconciliations/second, forever. | `ui/shooting-stars.tsx:110-116` |
| B4 | **`ShootingStars` leaks its timer chain.** `setTimeout(createStar, randomDelay)` recurses; the effect cleanup is `return () => {}`. On unmount or prop change the chain keeps firing `setState` on a dead component, and prop changes stack parallel chains. | `ui/shooting-stars.tsx:77-80` |
| B5 | **Dead title state.** `title`/`setTitle` + `useInterval` compute a rotating title that is never rendered. Forces a full page re-render every 5s for nothing. `LayoutTextFlip` already runs its own 3s interval over the same array. | `index.tsx:33-42` |
| B6 | **`z-1` and `z-2` are not Tailwind classes.** The default z scale is `0,10,20,30,40,50,auto`. Both are no-ops; current stacking works by DOM order, accidentally. | `index.tsx:95`, `CombinedThreeScene.tsx:54` |
| B7 | **Skip link is unreachable.** Bare `sr-only` with no `focus:not-sr-only` — keyboard users can never see it. | `index.tsx:96`, `Layout/Layout.tsx` |
| B8 | **`LayoutTextFlip` is permanently light-mode.** `darkMode: ["class"]` and nothing ever adds the `dark` class, so the chip is a hard white box on the gradient. | `ui/layout-text-flip.tsx:36` |
| B9 | **`LayoutTextFlip` effect has stale deps.** `[]` while closing over `words` and `duration`. | `ui/layout-text-flip.tsx:23` |
| B10 | **Frame-rate dependent rotation.** Fixed per-frame increments — the Earth spins 2x as fast at 120Hz. Also `rotation.x -= Math.random() * 0.0001` is a one-directional random walk that accumulates permanent drift, not jitter. | `Earth.tsx:26-32` |
| B11 | **Cursor leak.** Direct `document.body.style.cursor` mutation with no cleanup; unmount while hovering leaves a pointer cursor. | `Earth.tsx:46,50` |
| B12 | **`.background` class does not exist** anywhere in CSS or Tailwind output. Inert. | `index.tsx:84`, `Layout/Layout.tsx` |
| B13 | **`castShadow` with no receivers** and no `shadows` on the `<Canvas>`. Setup cost, zero effect. | `CombinedThreeScene.tsx:106` |
| B14 | **`motion-reduce:hidden` hides the probes, not the render.** The Canvas still mounts, compiles shaders, uploads textures and renders every frame. Full cost, no visual. | `CombinedThreeScene.tsx:49,54` |

### Dead code

`components/EarthCanvas.tsx`, `FullPageClouds.tsx`, `FullPageThreeWrapper.tsx`, `Clouds.tsx`,
`SparksThatFollowTheMouse.tsx` — all unreferenced since `CombinedThreeScene` landed.

### Asset weight

`public/earth/clouds.webp` is **2988 KB** (2048x1024 RGBA, near-lossless) — by far the heaviest
asset on the site, for a sphere rendered at 384 CSS px. Total Earth textures: **3527 KB**.

### Lighting

The Earth is lit by **five** lights across two files: `hemisphereLight 0.85` + `ambientLight 1.0`
+ `spotLight 0.8` in `CombinedThreeScene.tsx:99-108`, plus another `ambientLight` and
`directionalLight` in `Earth.tsx:38-39`. Result: uniform illumination, no day/night terminator,
flat ball. The terminator is the entire aesthetic of an earth render.

---

## Decisions taken

| Decision | Choice |
|---|---|
| **Backdrop** | Dark space on the homepage only. Other pages keep `--bg-gradient` (`#8900fe → #12b3dd`). |
| **Layout** | Scroll below the fold. Hero at 100vh with the 3D fixed behind it; recent posts scroll underneath. |
| **Globe scope** | Full interactive story — Belfast → Sydney markers, great-circle arc, hover labels, click-to-fly. |
| **Textures** | NASA (public domain). three.js example textures rejected — see below. |

### Texture provenance verdict

The three.js `examples/textures/planets` set was added by
[PR #29003](https://github.com/mrdoob/three.js/pull/29003) ("Examples: Add TSL Earth", 28 Jul 2024),
sourced from a **Three.js Journey** paid-course lesson. No licensing statement in the PR, no
discussion in comments, no README or LICENSE under `examples/textures/`. three.js's MIT licence
covers code; the repo makes no assertion about example asset licensing, and course assets are
normally licensed to course students.

**Not clean enough to ship. Using NASA Visible Earth instead — all public domain.**

---

## Asset plan

### Sources (all NASA Visible Earth, public domain)

| Channel | Source | Target |
|---|---|---|
| Day / albedo | Blue Marble NG w/ Topography & Bathymetry (`world.topo.bathy.*.3x5400x2700.jpg`) | 2048x1024 webp, **SRGBColorSpace** |
| Night lights | Black Marble 2016 (`BlackMarble_2016_01deg.jpg`) | 2048x1024 webp, **SRGBColorSpace** |
| **R** = bump | Blue Marble NG topography (`gebco_08_rev_elev_*.png`) | packed 1024x512 webp, NoColorSpace |
| **G** = roughness | Blue Marble NG water mask (`world.watermask.*.png`), inverted | packed |
| **B** = clouds | Blue Marble clouds (`cloud_combined_2048.jpg`) | packed |

Packing three data channels into one RGB texture follows the modern three.js earth pattern.
`sharp` (already a dependency) does it with `extractChannel` + `joinChannel`.

### Measured budget

Benchmarks run against the equivalent three.js set to size the target:

| | Current | Target |
|---|---|---|
| day / albedo | `earthmap1k.jpg` 336 KB @ 1000x500 | 2048 webp q82 → **~156 KB** |
| night lights | *(none)* | 2048 webp q80 → **~70 KB** |
| bump + roughness + clouds | 89 + 114 + **2988** KB | packed 1024 webp q85 → **~100 KB** |
| **Total** | **3527 KB** | **~326 KB** |

**~11x smaller at 2x albedo resolution, and gains night lights + a real roughness map.**

Sizing rationale: the Earth renders in a 384 CSS px box → 768 device px at DPR 2. The visible
hemisphere maps half the equirect width, so a 2048 albedo gives ~1024 texels across 768 px —
correctly sampled. 1024 is enough for the packed data texture.

**VRAM honesty:** 2048x1024 RGBA8 = 8 MB each, +33% for mips. Target: 8 + 8 + 2 = 18 MB → ~24 MB
with mips, vs ~19 MB today. Up slightly in VRAM, down 11x in download. KTX2/ETC1S would take all
three under 2 MB if mobile profiling later shows pressure — deferred, not in this stack.

### Sandbox constraint

This dev environment has a network allowlist: only `github.com` and `registry.npmjs.org` resolve.
`eoimages.gsfc.nasa.gov` and `visibleearth.nasa.gov` are unreachable from inside it. The download
step in `scripts/optimise-earth-textures.mjs` must be run outside the sandbox, or the source
images fetched manually.

---

## Dependency upgrade

| Package | Current | Target |
|---|---|---|
| `three` | 0.166.1 (Jul 2024) | **0.185.1** |
| `@types/three` | 0.166.0 | **0.185.4** |
| `@react-three/fiber` | 9.4.0 | **9.7.0** |
| `@react-three/drei` | 10.7.6 | **10.7.8** |

Peers all satisfied: drei wants `three >=0.159`, `react ^19`, `@react-three/fiber ^9.0.0`;
fiber wants `three >=0.156`, `react >=19 <19.3`. Project is on React 19.2.0.
`npm install --dry-run` is clean — no peer conflicts; adds `meshoptimizer`, drops `scheduler`
and `@types/react-reconciler`.

**Blast radius is tiny.** The whole repo imports from `three` in two files:
`Earth.tsx:4-10` (type-only) and `SparksThatFollowTheMouse.tsx:3` (dead code). Everything else
goes through drei/fiber.

### Migration deltas r166 → r185 that touch this code

Filtered from the official three.js migration guide:

| Release | Change | Impact |
|---|---|---|
| r169→r170 | Mipmaps always generated when `generateMipmaps` is true, regardless of filter settings | Slight VRAM increase; accounted for above |
| r180→r181 | Indirect specular light computation for PBR materials changed | **Relevant** — tune lighting *after* the upgrade, not before |
| r180→r181 | PMREM reflections improved | Only if `<Environment>` is used (it is not — see CDN traps) |
| r181→r182 | `PCFSoftShadowMap` deprecated for `WebGLRenderer`, use `PCFShadowMap` | Moot — `castShadow` is removed |
| r176→r177 | `ColorManagement.toWorkingColorSpace()` → `colorSpaceToWorking()` | Not used directly; drei handles it |

Nothing removes `MeshPhongMaterial`, `SphereGeometry`, `Points`, `ShaderMaterial` or `OrbitControls`.
The guide advises stepping in increments of 10 releases; with two import sites, a direct jump is fine.

### Risks

- **`three-stdlib`** (drei dep, `^2.35.6`, peer `three >=0.128.0`) powers `OrbitControls`. If anything
  breaks it is here. Verify `npm ls three` shows exactly one hoisted copy — two copies produce
  confusing `instanceof` failures.
- `next.config.js` sets `turbopack: {}`. Watch for resolution issues with three's `exports` map
  (r177+ split `three/webgpu` and `three/tsl`). If dev breaks but `next build` works, that's the tell.

### CDN traps to avoid

Grepped drei's source for hardcoded URLs:

- **`<Environment preset="...">` fetches HDRIs from `https://raw.githack.com/pmndrs/drei-assets/...`**
  — third-party CDN on the homepage critical path of a statically-exported site. **Do not use.**
  A proper directional sun makes it unnecessary.
- **`useKTX2`'s default `basisPath` is `https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@master/basis/`.**
  If KTX2 is adopted later, self-host `basis_transcoder.js` + `.wasm` and pass `basisPath`.

---

## The stack

Each branch bases on its predecessor. Bottom of the stack targets `main`.

| # | Branch | Scope |
|---|---|---|
| 00 | `home3d/00-plan` | This document |
| 01 | `home3d/01-deps-upgrade` | three 0.185 / r3f 9.7 / drei 10.7.8, nothing else |
| 02 | `home3d/02-remove-dead-code` | 5 dead components, dead title state, `useInterval` |
| 03 | `home3d/03-fix-layering` | z-index, pointer-events, skip link, `LayoutTextFlip` |
| 04 | `home3d/04-stars-in-r3f` | Stars + shooting stars into the scene; instanced clouds |
| 05 | `home3d/05-scroll-dark-backdrop` | Page scrolls; dark space backdrop on home only |
| 06 | `home3d/06-earth-rebuild` | NASA textures, sRGB fix, standard material, one sun, atmosphere |
| 07 | `home3d/07-perf-adaptivity` | Preload, PerformanceMonitor, AdaptiveDpr, reduced motion, offscreen pause |
| 08 | `home3d/08-recent-posts` | 3 recent blog posts + 3 recent TILs below the fold |
| 09 | `home3d/09-globe-markers` | Belfast → Sydney markers, arc, click-to-fly |

Ordering note: 05 lands **before** 06 deliberately — tuning a day/night terminator against a
purple gradient that is about to be deleted would mean tuning it twice.

---

## Phase 00 — Plan (this document)

**Acceptance:** `docs/homepage-3d-overhaul-plan.md` committed on `home3d/00-plan` off `main`.

---

## Phase 01 — Dependency upgrade

```
npm install three@0.185.1 @types/three@0.185.4 @react-three/fiber@9.7.0 @react-three/drei@10.7.8
```

Nothing else in this commit. An upgrade regression must not be able to hide behind a refactor.

**Acceptance**
- `npm ls three` → exactly one copy
- `npm run ci` (tsc + oxlint) green
- `npm run build` green
- Homepage renders exactly as before

---

## Phase 02 — Subtraction

No behaviour is added.

1. Delete `components/EarthCanvas.tsx`, `FullPageClouds.tsx`, `FullPageThreeWrapper.tsx`,
   `Clouds.tsx`, `SparksThatFollowTheMouse.tsx` (B: dead code).
2. Remove `title`/`setTitle`/`useInterval` from `index.tsx` (B5). Delete `hooks/useInterval.ts`
   if it has no other consumer.
3. Remove the dead `background` class from `index.tsx` and `Layout/Layout.tsx` (B12).

**Acceptance:** `npm run ci` green; page visually identical.

---

## Phase 03 — Layering and interactivity

Establish one explicit stacking contract:

| Layer | z-index | pointer-events |
|---|---|---|
| WebGL `<Canvas>` | `0` | `auto` |
| View tracking divs (`cloudsRef`, `earthRef`) | `0` | **`none`** — layout probes only |
| Content overlay | `20` | **`none`** |
| Nav / links / cards inside the overlay | — | `auto` |

1. Fix `z-1` → `z-20` in `index.tsx:95`; clean the duplicated `z-2`/`z-10` in
   `CombinedThreeScene.tsx:54` (B6).
2. Apply the pointer-events contract (B1).
3. Skip link: add `focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white
   focus:text-black` in both `index.tsx` and `Layout/Layout.tsx` (B7).
4. `LayoutTextFlip`: drop the empty `text=""` span; fix effect deps (B9); rewrite the chip's base
   styles as frosted glass (`bg-white/10 backdrop-blur border-white/20 text-white`) rather than
   relying on a `dark:` variant that never activates (B8).

**Verify during implementation:** with the Canvas at `pointer-events: auto` across the viewport,
confirm drei's `<View>` scopes `<OrbitControls>` drag to the Earth view's rect and a drag elsewhere
on the page does not rotate the globe. If it does not scope cleanly, drop `OrbitControls` and drive
rotation from `onPointerDown`/`onPointerMove` on the mesh — simpler for a decorative globe and it
removes `three-stdlib`'s controls from the critical path.

**Acceptance:** the Earth can be dragged and shows its hover outline — for the first time in production.

---

## Phase 04 — One animation system

Move both DOM layers into the existing `<View index={1}>` background view.

1. **Stars** → drei `<Stars radius={100} depth={50} count={...} factor={4} saturation={0} fade speed={0.5} />`.
   One `Points`, one draw call, twinkle in the shader. Current density (`0.00015` x viewport)
   is ~300 stars at 1080p; start at 800–1500 since 3D depth spreads them out.
2. **Shooting stars** → a small emissive mesh on a randomised path with drei `<Trail>`, driven
   entirely inside `useFrame` mutating `ref.current.position`. Respawn state in a ref. **Zero React renders.**
   Fixes B3 and B4.
3. Delete `components/ui/stars-background.tsx` and `components/ui/shooting-stars.tsx`.
4. **Clouds** → drei's instanced batching:
   `<Clouds material={THREE.MeshBasicMaterial} limit={400}>` with 2–4 `<Cloud>` children.
   One instanced draw call; `MeshBasicMaterial` skips lighting for the backdrop entirely.
   Replaces the single `color="black" opacity={0.4}` smudge.
5. **Pointer parallax** — lerp the background camera by a fraction of `state.pointer` in `useFrame`,
   clamped to ~±0.15 units. Two lines; makes the backdrop read as a space rather than a wallpaper.
   Only possible now that the stars are in 3D.

**Acceptance:** one rAF loop total (DevTools Performance), one canvas element in the DOM,
React DevTools profiler shows zero renders while idle.

---

## Phase 05 — Scroll and dark backdrop

1. Drop `fixed inset-0` from the page root. Hero becomes a 100vh section; the `<Canvas>` stays
   `fixed` behind it.
2. Move the Earth's tracking div from `fixed bottom-10 right-10` to `absolute` within the hero,
   so it scrolls away instead of following the viewport.
3. Dark backdrop, homepage only. `styles/globals.css:10` sets
   `html, body { background: var(--bg-gradient) fixed }` globally, so a page wrapper alone is not
   enough — overscroll would flash purple. Needs a route-scoped body override (a `<Head>` style tag
   on the homepage is the least invasive option in the pages router).
   `Layout.tsx` is not used by `index.tsx`, so no other page is affected.
4. Add the empty content section below the fold that Phase 08 fills.

**Acceptance:** page scrolls; no purple visible anywhere on `/` including overscroll; every other
page unchanged.

---

## Phase 06 — Earth rebuild

1. **Texture pipeline** — `scripts/optimise-earth-textures.mjs` using `sharp`
   (pattern: `scripts/generate-og-image.js`). Downloads NASA sources, resizes, packs R/G/B,
   encodes webp. Commit outputs to `public/earth/`; delete the four old files.
   *Download step must run outside the sandbox.*
2. **Colour space (B2)** — set explicitly per texture: day + night → `THREE.SRGBColorSpace`;
   packed data → leave `NoColorSpace`. Getting this backwards on the data texture is as wrong as
   the current state, so set both sides deliberately.
3. **Material** — `meshPhongMaterial` → `meshStandardMaterial`:
   - `map` = day (sRGB)
   - `emissiveMap` = night lights, `emissive` white, `emissiveIntensity` ~1
   - `roughnessMap` = packed **green**, `metalness: 0`
   - `bumpMap` = packed **red**, `bumpScale` retuned from scratch (it became UV-scale-invariant
     in r158, so old values do not transfer)
4. **Night-lights masking** — naively the `emissiveMap` glows on the sunlit side too. Use an
   `onBeforeCompile` patch multiplying the emissive contribution by
   `smoothstep(0.0, 0.2, -dot(normal, sunDirection))`. ~10 lines of GLSL injection; the difference
   between "textured sphere" and "planet".
5. **Lighting** — delete all five current lights. Replace with one `<directionalLight>` as the sun
   (intensity ~2–3, off to one side) plus `<ambientLight intensity={0.02}>` to keep the night side
   from going pure black. Remove `castShadow` (B13).
6. **Cloud shell** — separate sphere at 1.02x, packed **blue** channel as `alphaMap` on a white
   `meshStandardMaterial`. Keeping it lit means night-side clouds darken and catch the terminator.
7. **Atmosphere** — back-face sphere at ~1.03x with a fresnel shader via drei's `shaderMaterial()`:
   `pow(1.0 - dot(vNormal, viewDir), 3.0)`, `side: BackSide`, `transparent`, `AdditiveBlending`,
   `depthWrite: false`. ~25 lines. The most recognisable "good earth" cue currently missing.
8. **Geometry** — `[1.5, 32, 32]` → `[1.5, 64, 64]`. 32 segments is visibly faceted at 384 px.
9. **Animation (B10)** — `useFrame((state, delta) => ...)`, multiply by `delta`. Delete the
   `rotation.x -= Math.random() * 0.0001` random walk.
10. **Hover (B11)** — replace manual cursor mutation with drei's `useCursor(hovered)`.
11. **Controls** — add `enableDamping` and `makeDefault` to `<OrbitControls>`.

**Acceptance:** visible day/night terminator; city lights on the dark side only; atmospheric rim;
Earth texture payload under 400 KB total; no console warnings.

---

## Phase 07 — Performance and adaptivity

1. **`<Preload all />`** replaces `SceneReadyDetector`'s 3-frame counting hack
   (`CombinedThreeScene.tsx:16-33`). drei's `useTexture` already calls `gl.initTexture()`
   (verified in source); `<Preload all />` compiles and uploads everything before the first
   visible frame. Add `useProgress` if a real progress signal is wanted for the fade-in.
2. **Adaptive quality** — wrap the scene in `<PerformanceMonitor>` with `<AdaptiveDpr pixelated={false} />`
   and `<AdaptiveEvents />`. Drive DPR from the monitor's `factor`.
3. **DPR** — `dpr={[1, 2]}` → `[1, 1.5]` as the static ceiling; let `PerformanceMonitor` manage it
   dynamically above that.
4. **Reduced motion (B14)** — add `usePrefersReducedMotion` (matchMedia + change listener) beside
   the existing hooks. When reduced: do not mount `<CombinedThreeScene>` at all; render a
   pre-generated static poster PNG instead. Add `frameloop` as a defensive fallback for
   mid-session media-query changes.
5. **Pause offscreen** — reuse `hooks/useMultiIntersectionObserver.ts` to watch the hero and set
   `frameloop="never"` once it scrolls out of view. Only became possible with the Phase 05 scroll change.

**Acceptance:** `prefers-reduced-motion: reduce` forced in DevTools → no WebGL context created at all;
scrolling past the hero drops GPU usage to idle.

---

## Phase 08 — Recent posts

62 blog posts and 22 TILs, and the homepage surfaces zero of them.

1. Add `getStaticProps` to `pages/index.tsx` returning the 3 most recent blog posts and 3 most
   recent TILs. `main`'s `blog-index.tsx:67-90` has the pattern (flat-file `readdirSync` +
   `frontmatter` + `readingTime` + date sort). Factor the shared logic out rather than duplicating.
   *Note:* the `feature/keystatic-mdx-content-components` branch replaces this with
   `getBlogPostEntries()` / `getTilPostEntries()` in `utils/`, which also handle
   `<dir>/index.mdx` posts. When that merges, this should adopt those utils.
2. `components/IndexListItem.tsx` is styled for the white-card `Layout` and will not drop straight
   onto the hero — needs a hero variant. Cards need `pointer-events-auto` per the Phase 03 contract.
3. **Mobile nav** — `components/Navigation.tsx:13` hides the entire mobile nav when `isHomepage`.
   On a phone the homepage currently has no route to the blog. Fix now that there is content to navigate to.
4. **Competing titles** — the `<h1>` says "Technical Leader, Geospatial Expert & Tech Writer" while
   the chip beneath cycles "Full Stack Software Engineer / Systems Architect / Team Leader / Samba
   Drummer / …". Two overlapping lists that dilute each other. Keep the flipper (the non-work
   entries are the good bit) and make the `<h1>` a single static, specific claim.

**Acceptance:** 6 internal links from the highest-authority page; static export still builds.

---

## Phase 09 — Globe markers

The headline says "Geospatial Expert" and there is a globe on the page doing nothing but spinning.
Connect them.

Career arc from `data/resumeData.ts`: **Asidua, Belfast (2010–2013)** → **Pace Sydney (2013)** →
**Mi9 (2014)** → **Propeller Aero (2016)** → **Kablamo (2021–present)**. Belfast to Sydney.

1. `latLonToVector3` helper + great-circle arc (slerp points, or `QuadraticBezierCurve3` lifted off
   the surface). This is the one piece of the work with real logic — `__tests__/` exists but is empty
   and nothing in `package.json` runs it, so add assertions and a runner, or verify inline.
2. Markers via drei `<Billboard>` so they always face the camera; `<Html>` labels on hover.
3. Arc via drei `<Line>`.
4. Click → swap `<OrbitControls>` for drei `<CameraControls>`, fly to the marker, open a role card.
   **Re-verify the Phase 03 pointer-events contract after this swap** — `CameraControls` has its own
   event attachment behaviour inside a `<View>`.

**Acceptance:** both pins sit at correct lat/lon through a full rotation; arc follows the surface;
click flies the camera and opens the card; keyboard-accessible alternative exists.

---

## Verification (every phase)

- `npm run ci` (tsc + oxlint) and `npm run build`. No test runner is configured — `__tests__/` is
  empty and `package.json` has no `test` script — so verification is typecheck + lint + build +
  manual browser checks.
- Compare against the Phase 00 baseline: First Load JS for `/`, total transferred bytes, idle frame
  time, rAF loop count (target: 1), React renders while idle (target: 0).
- Lighthouse on `/`.
- Manual matrix: desktop drag/hover, mobile touch, keyboard tab order (skip link visible on focus),
  `prefers-reduced-motion: reduce`.
- Network tab: no requests to `raw.githack.com` or `cdn.jsdelivr.net`.
- Regression check `/`, `/blog-index`, `/today-i-learned`, `/side-projects`, `/resume` — the
  Tailwind and Layout changes touch shared surfaces.
