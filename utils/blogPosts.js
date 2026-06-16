const fs = require("fs");
const path = require("path");

const BLOG_DIR = path.join(process.cwd(), "content/blog");

function getBlogPostEntries() {
  const entries = fs.readdirSync(BLOG_DIR, { withFileTypes: true });
  const posts = [];

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".mdx")) {
      posts.push({
        slug: entry.name.replace(/\.mdx$/, ""),
        filePath: path.join(BLOG_DIR, entry.name),
      });
      continue;
    }

    if (entry.isDirectory()) {
      const indexMdx = path.join(BLOG_DIR, entry.name, "index.mdx");
      if (fs.existsSync(indexMdx)) {
        posts.push({ slug: entry.name, filePath: indexMdx });
      }
    }
  }

  return posts;
}

function readBlogPostBySlug(slug) {
  const flatPath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (fs.existsSync(flatPath)) {
    return fs.readFileSync(flatPath, "utf8");
  }

  const indexPath = path.join(BLOG_DIR, slug, "index.mdx");
  if (fs.existsSync(indexPath)) {
    return fs.readFileSync(indexPath, "utf8");
  }

  throw new Error(`Blog post not found: ${slug}`);
}

module.exports = { getBlogPostEntries, readBlogPostBySlug };
