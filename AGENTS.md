<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# madole.xyz

Personal blog and portfolio. Static-exported Next.js (Pages Router) with MDX
content and a three.js homepage. The block above is maintained by `next dev`, not
by hand.

## Commands

| Command                     | Purpose                                                                                         |
| --------------------------- | ----------------------------------------------------------------------------------------------- |
| `npm run ci`                | **The gate.** `tsc` then `oxlint`. Run before calling anything done.                            |
| `npm run build`             | Production build. Catches route and JSX errors that `tsc` does not.                             |
| `npm run dev`               | Turbopack dev server on :3000.                                                                  |
| `npm run prettier`          | Formats the repo. No config file exists, so prettier defaults apply: double quotes, 80 columns. |
| `npm run new-post`          | Interactive scaffold into `content/`.                                                           |
| `npm run generate-rss`      | Writes `public/rss.{xml,atom,json}`.                                                            |
| `npm run generate-sitemap`  | Writes `public/sitemap.xml`.                                                                    |
| `npm run generate-og-image` | Writes `public/og/*.png`.                                                                       |
| `npm run earth-textures`    | Fetches NASA imagery and packs `public/earth/*.webp`. See below.                                |

**There is no test runner.** No `test` script, no test files, no test dependency.
Verification is `npm run ci`, `npm run build`, and looking at the page.

Feeds, sitemap and OG images are committed artefacts rather than build output.
Regenerate them when you add or rename a post.

`npm run earth-textures` produces the packed globe texture set from NASA
public-domain imagery. It has to run outside the network sandbox, because
`eoimages.gsfc.nasa.gov` is not on the allowlist, and it takes `--probe` to
report which source URLs resolve. See the header of
`scripts/fetch-earth-textures.mjs` for the output contract.

## CI

`.github/workflows/node.js.yml` runs on PRs to `main`: install, `generate-rss`,
then force-push the result back to the branch as "RSS feeds updated". It does not
typecheck and it does not build, so `npm run ci` is the only thing between a type
error and `main`.

## Architecture

### Content

Posts are files: `content/blog/*.mdx` and `content/today-i-learned/*.md`. Pages
read them off disk in `getStaticProps` and `getStaticPaths`. There is no CMS and
no runtime data layer.

- Frontmatter is parsed by `front-matter`; the body is compiled by
  `next-mdx-remote` in `utils/parseMdxContent.ts`, with highlighting from
  `@tanstack/highlight` and GFM from `remark-gfm`.
- Custom MDX elements are mapped in `components/mdx/mdx-components.tsx`.
- Tag slugs come from `utils/tags.ts` and nowhere else. Tags are hand-written, so
  the same subject arrives as "Javascript", "javascript" and "js"; deriving the
  slug anywhere else is what 404s a link on a case-sensitive host.

### The homepage scene

`components/CombinedThreeScene.tsx` renders one `<Canvas>` holding two drei
`<View>` viewports: a fullscreen starfield and cloud background, and the globe
bottom-right (centred on mobile). The views share a single depth buffer, so depth
alone decides what draws in front of what.

- `components/sceneConstants.ts` is the one source of truth for camera geometry
  that both views and the rocket have to agree on. Duplicating those numbers is
  what makes an orbit drift out of its depth ordering.
- `components/Earth.tsx` owns the globe, its sun direction and its textures.
- `Rocket.tsx`, `HintRocket.tsx` and `Satellite.tsx` animate entirely inside
  `useFrame` through refs. They never set React state.
- The rocket is an easter egg, activated by typing `rocket`. It sits behind
  `React.lazy` deliberately: a static import pulls three, the ship geometry and
  the trail into the first load. Keep anything not needed on first paint behind a
  lazy boundary.
- `docs/homepage-3d-overhaul-plan.md` records the design decisions, the
  measurements behind them and the bugs they fixed. Read it before reworking the
  scene.

## House style

Not preferences. This is what the code does; match it.

**Comments explain why.** A module whose purpose is not obvious from its name
gets a block comment: what it is for, what breaks without it, why the choice was
made. Constants carrying a unit or a trade-off get the same. The comments worth
imitating cite a measurement or a source line rather than an adjective.

**Animation reads refs.** A component that animates renders once, then mutates
objects in `useFrame`. Anything re-rendering per frame is a bug.

**Constants are module-scope and named**, never inline in a frame callback, with
units stated in the name or the comment.

**Strict TypeScript, no `any`.** `@ts-expect-error` is acceptable only where a
third-party type is genuinely wrong, and needs a comment saying so.

**Relative imports**, matching the bulk of the codebase. `@/` appears only in
files shadcn generated.

**Tailwind for styling**, inline utilities, with `cn()` from `lib/utils.ts` for
conditional composition. `styles/globals.css` holds the shadcn variables and the
`--bg-gradient` used by every page except the homepage.

**Dark mode** is the `dark` class on `<html>`, applied before first paint by an
inline script in `_document.tsx`. `useTheme` treats the DOM as the source of
truth rather than localStorage, because that script may have resolved a system
preference the storage does not hold.

## Gotchas

- **Blog posts are `.mdx`; TILs are `.md`.** Both routes hardcode the extension,
  so the wrong one in the wrong directory fails the build on a missing file.
- **Every file in a content directory is treated as a post.** The readers use a
  non-recursive `readdirSync` with no filtering, and both routes set
  `fallback: false`. A stray `.DS_Store`, a draft or a subdirectory fails the
  build, and the error names a missing field rather than the stray file. Keep
  drafts out of `content/`.
- **A blog post's frontmatter `slug` must match its filename.** The index links to
  the slug, but `getStaticPaths` derives the route from the filename, so a
  mismatch 404s the post without failing the build. `npm run new-post` derives
  both from the title. TILs ignore frontmatter `slug` and always use the
  filename.
- **`next-env.d.ts` flips** between `.next/dev/types` and `.next/types` according
  to whether `dev` or `build` ran last. Neither state is more correct; do not
  sweep it into an unrelated commit.
- **`AGENTS.md` and `CLAUDE.md` are partly generated.** `next dev` rewrites
  everything between the `nextjs-agent-rules` markers and preserves everything
  outside them. Put project content below the markers, as this is.
