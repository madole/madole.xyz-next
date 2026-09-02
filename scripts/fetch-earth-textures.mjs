#!/usr/bin/env node
/**
 * Fetch NASA public-domain earth imagery and produce the packed texture set.
 *
 * Outputs into public/earth/:
 *   earth-day-2048.webp     albedo, ocean lifted         (sample as sRGB)
 *   earth-night-2048.webp   city lights                  (sample as sRGB)
 *   earth-brc-1024.webp     R=bump G=roughness B=clouds  (sample as NoColorSpace)
 *
 * Only three sources are required: day, night, clouds. Roughness is derived
 * from the day map rather than downloaded, because NASA's water mask only
 * exists as a 200MB+ full-resolution PNG. Bump is optional for the same reason:
 * if the topography record cannot be reached the R channel is left flat and the
 * material simply omits bumpMap, which is barely perceptible at the size this
 * globe renders anyway.
 *
 * Must run OUTSIDE the dev sandbox - eoimages.gsfc.nasa.gov is not on the
 * container's network allowlist.
 *
 *   node fetch-earth-textures.mjs --probe      report which URLs resolve
 *   node fetch-earth-textures.mjs --discover   scrape Visible Earth for real filenames
 *   node fetch-earth-textures.mjs              download and process
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const OUT = path.join(process.cwd(), "public/earth");
const CACHE = path.join(process.cwd(), ".earth-sources");
const PROBE = process.argv.includes("--probe");
const DISCOVER = process.argv.includes("--discover");
const KEEP = process.argv.includes("--keep-sources");
const TIMEOUT = 45_000;

/** Visible Earth record pages, scraped when the direct candidates fail. */
const RECORDS = {
  day: "https://visibleearth.nasa.gov/images/73909/december-blue-marble-next-generation-w-topography-and-bathymetry",
  night: "https://visibleearth.nasa.gov/images/144898/earth-at-night-black-marble-2016-color-maps",
  clouds: "https://visibleearth.nasa.gov/images/57747/blue-marble-clouds",
  topo: "https://visibleearth.nasa.gov/images/73934/topography",
};

const CANDIDATES = {
  day: [
    "https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x5400x2700.jpg",
    "https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x4096x2048.jpg",
    "https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73776/world.topo.200412.3x5400x2700.jpg",
  ],
  night: [
    "https://eoimages.gsfc.nasa.gov/images/imagerecords/144000/144898/BlackMarble_2016_01deg.jpg",
  ],
  clouds: [
    "https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57747/cloud_combined_2048.jpg",
  ],
  topo: [
    "https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/topography/gebco_08_rev_elev_5400x2700.jpg",
    "https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73934/gebco_08_rev_elev_2048x1024.png",
  ],
};

const REQUIRED = ["day", "night", "clouds"];
const mb = (n) => (n / 1048576).toFixed(1) + "MB";
const kb = (n) => (n / 1024).toFixed(0) + "KB";

function withTimeout(ms) {
  const c = new AbortController();
  const id = setTimeout(() => c.abort(), ms);
  return { signal: c.signal, done: () => clearTimeout(id) };
}

/**
 * HEAD first, then a one-byte ranged GET. Plenty of CDNs reject or stall on
 * HEAD while serving GET perfectly well, which is the likeliest explanation for
 * the ETIMEDOUTs seen on the 73909 and 73934 paths.
 */
async function probeUrl(url) {
  for (const init of [{ method: "HEAD" }, { method: "GET", headers: { Range: "bytes=0-0" } }]) {
    const t = withTimeout(TIMEOUT);
    try {
      const res = await fetch(url, { ...init, redirect: "follow", signal: t.signal });
      t.done();
      if (res.ok || res.status === 206) {
        const range = res.headers.get("content-range");
        const size = range
          ? Number(range.split("/")[1])
          : Number(res.headers.get("content-length") || 0);
        return { url, size, via: init.method };
      }
      if (res.status === 404) return { failed: `404 (${init.method})` };
    } catch (err) {
      t.done();
      if (init.method === "GET") {
        return { failed: err.name === "AbortError" ? "timeout" : err.cause?.code || err.message };
      }
    }
  }
  return { failed: "unreachable" };
}

/** Pull every eoimages asset link out of a Visible Earth record page. */
async function discover(name) {
  const page = RECORDS[name];
  if (!page) return [];
  const t = withTimeout(TIMEOUT);
  try {
    const res = await fetch(page, { redirect: "follow", signal: t.signal });
    t.done();
    if (!res.ok) {
      console.log(`  ${name.padEnd(10)} record page HTTP ${res.status}`);
      return [];
    }
    const html = await res.text();
    const found = [
      ...new Set(
        [...html.matchAll(/https:\/\/(?:eoimages\.gsfc|assets\.science)\.nasa\.gov\/(?!dynamicimage)[^\s"'<>)]+\.(?:jpg|jpeg|png|tif)/gi)]
          .map((m) => m[0])
      ),
    ];
    console.log(`  ${name.padEnd(10)} record page lists ${found.length} asset(s):`);
    found.forEach((u) => console.log(`             ${u}`));
    return found;
  } catch (err) {
    t.done();
    console.log(`  ${name.padEnd(10)} record page failed (${err.name === "AbortError" ? "timeout" : err.message})`);
    return [];
  }
}

async function resolveAsset(name) {
  for (const url of CANDIDATES[name] ?? []) {
    const r = await probeUrl(url);
    if (r.url) {
      console.log(`  ${name.padEnd(10)} OK   ${mb(r.size).padStart(8)}  via ${r.via}  ${url}`);
      return r;
    }
    console.log(`  ${name.padEnd(10)} ${String(r.failed).padEnd(12)} ${url}`);
  }

  // Direct candidates exhausted: ask Visible Earth what actually exists.
  console.log(`  ${name.padEnd(10)} falling back to record-page discovery…`);
  for (const url of await discover(name)) {
    const r = await probeUrl(url);
    if (r.url) {
      console.log(`  ${name.padEnd(10)} OK   ${mb(r.size).padStart(8)}  discovered  ${url}`);
      return r;
    }
  }
  return null;
}

async function download(name, url) {
  fs.mkdirSync(CACHE, { recursive: true });
  const dest = path.join(CACHE, name + path.extname(new URL(url).pathname));
  if (fs.existsSync(dest)) {
    console.log(`  ${name.padEnd(10)} cached  ${mb(fs.statSync(dest).size)}`);
    return dest;
  }
  process.stdout.write(`  ${name.padEnd(10)} downloading… `);
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  console.log(mb(fs.statSync(dest).size));
  return dest;
}

/**
 * Ocean test against the Blue Marble albedo. Open water is the only large
 * feature that is consistently blue-dominant and dark, so `blue > red` with a
 * margin separates it cleanly from land, ice and cloud.
 *
 * Calibrated against world.topo.bathy: the mask holds steady around 72% ocean
 * by surface area (true figure 70.8%) from margin 10 through 17, then collapses
 * to 58% at 18 because deep ocean in this map sits at almost exactly b-r = 17.
 * 15 keeps a couple of steps of clearance from that cliff.
 *
 * The abyssal plains sit right on that cliff and some of their pixels fall
 * through the margin anyway. They are unambiguously water - nothing else on the
 * map is this dark and at least as blue as it is red - so the second clause
 * catches them. Without it they survive the ocean lift below as black speckles
 * scattered across the deep Pacific.
 */
function isWater(r, g, b) {
  const MARGIN = 15;
  return b > r + MARGIN || (b >= r && (r + g + b) / 3 < 45);
}

/**
 * Blue Marble renders ocean depth, so the deep Pacific comes out near-black
 * (mean rgb 3,7,24) while the shallower Atlantic reads 15,23,42. On a globe
 * that is not perceived as bathymetry, only as dark blotches on one side.
 *
 * NASA publishes no lighter variant - the non-bathymetry Blue Marble is flat,
 * not brighter, and its asset URLs 404 - so flatten it here instead: blend
 * every water pixel toward a single mid-ocean blue. Land is untouched, and at
 * 0.62 the mid-ocean ridges still show through faintly.
 */
async function liftOcean(dayFile, width, height) {
  const OCEAN = [20, 52, 96];
  const LIFT = 0.62;

  const { data } = await sharp(dayFile)
    .resize(width, height)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < width * height; i += 1) {
    const p = i * 3;
    if (!isWater(data[p], data[p + 1], data[p + 2])) continue;
    for (let c = 0; c < 3; c += 1) {
      data[p + c] = Math.round(data[p + c] + (OCEAN[c] - data[p + c]) * LIFT);
    }
  }
  return data;
}

/**
 * Returns roughness: 255 = rough (land), 0 = smooth (water), so sunlight glints
 * off the oceans and not off the continents.
 */
async function deriveRoughness(dayFile, width) {
  const height = width / 2;
  const { data } = await sharp(dayFile)
    .resize(width, height)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(width * height);

  // Equirectangular over-represents the poles, so weight the sanity check by
  // cos(latitude). Unweighted, a correct mask reads as only ~62% and looks wrong.
  let weightedWater = 0;
  let weightedTotal = 0;

  for (let y = 0; y < height; y += 1) {
    const weight = Math.cos((y / height - 0.5) * Math.PI);
    for (let x = 0; x < width; x += 1) {
      const i = y * width + x;
      const water = isWater(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]);
      out[i] = water ? 10 : 235;
      weightedTotal += weight;
      if (water) weightedWater += weight;
    }
  }

  const fraction = weightedWater / weightedTotal;
  console.log(
    `  roughness  derived from albedo: ${(fraction * 100).toFixed(1)}% ocean by area ` +
      `(Earth is 70.8%)`
  );
  if (fraction < 0.6 || fraction > 0.8) {
    console.log("  roughness  WARNING: outside the expected range, check the result visually");
  }
  // A light blur hides JPEG blocking along coastlines. Stay in raw single-channel
  // form: sharp's png() encoder would widen this to 3-channel sRGB and the packing
  // loop below reads it with a stride of 1.
  return sharp(out, { raw: { width, height, channels: 1 } })
    .blur(0.6)
    .toColourspace("b-w")
    .raw()
    .toBuffer();
}

async function main() {
  console.log("Resolving NASA sources…\n");

  if (DISCOVER) {
    for (const name of Object.keys(RECORDS)) await discover(name);
    return;
  }

  const resolved = {};
  for (const name of Object.keys(CANDIDATES)) resolved[name] = await resolveAsset(name);

  const missing = REQUIRED.filter((n) => !resolved[n]);
  if (missing.length) {
    console.error(`\nRequired source(s) unresolved: ${missing.join(", ")}`);
    console.error("Run with --discover and paste the output.");
    process.exitCode = 1;
    return;
  }
  if (!resolved.topo) {
    console.log("\n  topo unavailable - packing a flat bump channel; the material omits bumpMap.");
  }
  if (PROBE) {
    console.log("\nAll required sources resolve. Re-run without --probe to download and process.");
    return;
  }

  console.log("\nDownloading…");
  const files = {};
  for (const [name, r] of Object.entries(resolved)) {
    if (r) files[name] = await download(name, r.url);
  }

  fs.mkdirSync(OUT, { recursive: true });
  console.log("\nProcessing…");

  // q78 rather than the usual q82: it saves 38KB and keeps the whole set under
  // the 400KB budget, and the globe renders at 384 CSS px so the difference is
  // not resolvable.
  const DAY_W = 2048;
  const DAY_H = DAY_W / 2;
  const day = await liftOcean(files.day, DAY_W, DAY_H);
  await sharp(day, { raw: { width: DAY_W, height: DAY_H, channels: 3 } })
    .webp({ quality: 78 })
    .toFile(path.join(OUT, "earth-day-2048.webp"));
  await sharp(files.night).resize(2048, 1024).webp({ quality: 80 })
    .toFile(path.join(OUT, "earth-night-2048.webp"));

  const W = 1024;
  const H = W / 2;
  const flat = Buffer.alloc(W * H, 0);
  const bump = files.topo
    ? await sharp(files.topo).resize(W, H).greyscale().toColourspace("b-w").raw().toBuffer()
    : flat;
  const rough = await deriveRoughness(files.day, W);
  const cloud = await sharp(files.clouds).resize(W, H).greyscale().toColourspace("b-w").raw().toBuffer();

  // Each source must be exactly one byte per pixel or the packing loop below
  // silently reads with the wrong stride and the channel comes out striped.
  for (const [name, buf] of [["bump", bump], ["roughness", rough], ["clouds", cloud]]) {
    if (buf.length !== W * H) {
      throw new Error(`${name}: expected ${W * H} bytes (1 channel), got ${buf.length}`);
    }
  }

  const packed = Buffer.alloc(W * H * 3);
  for (let i = 0; i < W * H; i += 1) {
    packed[i * 3] = bump[i];
    packed[i * 3 + 1] = rough[i];
    packed[i * 3 + 2] = cloud[i];
  }
  await sharp(packed, { raw: { width: W, height: H, channels: 3 } })
    .webp({ quality: 85 })
    .toFile(path.join(OUT, "earth-brc-1024.webp"));

  console.log("\nWrote to public/earth/:");
  let total = 0;
  for (const f of ["earth-day-2048.webp", "earth-night-2048.webp", "earth-brc-1024.webp"]) {
    const s = fs.statSync(path.join(OUT, f)).size;
    total += s;
    console.log(`  ${f.padEnd(24)} ${kb(s).padStart(8)}`);
  }
  console.log(`  ${"TOTAL".padEnd(24)} ${kb(total).padStart(8)}   (replacing 3527KB)`);
  console.log(`  bumpMap: ${files.topo ? "packed in R" : "not available, R is flat"}`);

  if (!KEEP) {
    fs.rmSync(CACHE, { recursive: true, force: true });
    console.log("\nRemoved .earth-sources (pass --keep-sources to retain).");
  }
}

main().catch((e) => { console.error("\n" + e.stack); process.exit(1); });
