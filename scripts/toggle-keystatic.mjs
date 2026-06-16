import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const root = process.cwd();
const appDir = path.join(root, "app");
const configFile = path.join(root, "keystatic.config.ts");
const stashRoot = path.join(root, ".keystatic-stash");
const stashAppDir = path.join(stashRoot, "app");
const stashConfigFile = path.join(stashRoot, "keystatic.config.ts");
const command = process.argv[2];

function stash() {
  fs.rmSync(stashRoot, { recursive: true, force: true });
  fs.mkdirSync(stashRoot, { recursive: true });

  // Only the app/ admin routes break static export (catch-all routes without
  // generateStaticParams). keystatic.config.ts must stay in place because the
  // blog pages read content with the Keystatic Reader API inside getStaticProps.
  if (fs.existsSync(appDir)) {
    fs.renameSync(appDir, stashAppDir);
    console.log("Stashed app/ for static export build.");
  } else {
    console.log("No app/ directory — nothing to stash.");
  }
}

function restore() {
  if (!fs.existsSync(stashRoot)) {
    console.log("No Keystatic stash — assuming routes are in place.");
    return;
  }

  if (!fs.existsSync(appDir) && fs.existsSync(stashAppDir)) {
    fs.renameSync(stashAppDir, appDir);
    console.log("Restored app/ for local Keystatic dev.");
  }

  if (!fs.existsSync(configFile) && fs.existsSync(stashConfigFile)) {
    fs.renameSync(stashConfigFile, configFile);
    console.log("Restored keystatic.config.ts for local Keystatic dev.");
  }

  if (fs.existsSync(stashRoot)) {
    fs.rmSync(stashRoot, { recursive: true, force: true });
  }
}

function withBuild() {
  const buildArgs = process.argv.slice(3);
  if (buildArgs.length === 0) {
    console.error("Usage: node scripts/toggle-keystatic.mjs with-build <command> [args...]");
    process.exit(1);
  }

  stash();
  const result = spawnSync(buildArgs[0], buildArgs.slice(1), {
    cwd: root,
    stdio: "inherit",
    shell: true,
    env: { ...process.env, STATIC_EXPORT: "true" },
  });
  restore();
  process.exit(result.status ?? 1);
}

if (command === "stash") stash();
else if (command === "restore") restore();
else if (command === "with-build") withBuild();
else {
  console.error("Usage: node scripts/toggle-keystatic.mjs <stash|restore|with-build>");
  process.exit(1);
}
