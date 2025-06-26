
const fs = require('fs');
const path = require('path');
const frontmatter = require('front-matter');

const getMdxFiles = (dir) => {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = [...files, ...getMdxFiles(fullPath)];
    } else if (path.extname(item.name) === '.mdx') {
      files.push(fullPath);
    }
  }
  return files;
};

async function generateSitemap() {
  const pagesDir = path.join(process.cwd(), 'pages');
  const contentDir = path.join(process.cwd(), 'content');
  const publicDir = path.join(process.cwd(), 'public');

  const siteUrl = 'https://madole.xyz';

  const staticPages = fs
    .readdirSync(pagesDir)
    .filter((file) => !file.startsWith('_') && !file.startsWith('[') && file.endsWith('.tsx'))
    .map((file) => {
      const slug = file.replace('.tsx', '');
      return `${siteUrl}/${slug === 'index' ? '' : slug}`;
    });

  const blogPosts = getMdxFiles(path.join(contentDir, 'blog')).map((file) => {
    const fileContent = fs.readFileSync(file, 'utf8');
    const { attributes } = frontmatter(fileContent);
    return `${siteUrl}/blog/${attributes.slug}`;
  });
  
  const tilPosts = getMdxFiles(path.join(contentDir, 'today-i-learned')).map((file) => {
    const fileContent = fs.readFileSync(file, 'utf8');
    const { attributes } = frontmatter(fileContent);
    return `${siteUrl}/today-i-learned/${attributes.slug}`;
  });

  const allUrls = [...staticPages, ...blogPosts, ...tilPosts];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map((url) => {
      return `
    <url>
      <loc>${url}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>
  `;
    })
    .join('')}
</urlset>`;

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
}

generateSitemap();
