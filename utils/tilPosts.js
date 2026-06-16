const fs = require("fs");
const path = require("path");

const TIL_DIR = path.join(process.cwd(), "content/today-i-learned");

function getTilPostEntries() {
  const entries = fs.readdirSync(TIL_DIR, { withFileTypes: true });
  const posts = [];

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".md")) {
      posts.push({
        slug: entry.name.replace(/\.md$/, ""),
        filePath: path.join(TIL_DIR, entry.name),
      });
      continue;
    }

    if (entry.isDirectory()) {
      const indexMd = path.join(TIL_DIR, entry.name, "index.md");
      if (fs.existsSync(indexMd)) {
        posts.push({ slug: entry.name, filePath: indexMd });
      }
    }
  }

  return posts;
}

function readTilPostBySlug(slug) {
  const flatPath = path.join(TIL_DIR, `${slug}.md`);
  if (fs.existsSync(flatPath)) {
    return fs.readFileSync(flatPath, "utf8");
  }

  const indexPath = path.join(TIL_DIR, slug, "index.md");
  if (fs.existsSync(indexPath)) {
    return fs.readFileSync(indexPath, "utf8");
  }

  throw new Error(`Today I Learned post not found: ${slug}`);
}

module.exports = { getTilPostEntries, readTilPostBySlug };
