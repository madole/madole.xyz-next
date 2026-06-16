const fs = require('fs');
const path = require('path');
const frontmatter = require('front-matter');
const { getBlogPostEntries } = require('../utils/blogPosts');
const { getTilPostEntries } = require('../utils/tilPosts');

async function generateSitemap() {
  const pagesDir = path.join(process.cwd(), 'pages');
  const publicDir = path.join(process.cwd(), 'public');
  const siteUrl = 'https://madole.xyz';

  const staticPages = fs
    .readdirSync(pagesDir)
    .filter((file) => !file.startsWith('_') && !file.startsWith('[') && file.endsWith('.tsx'))
    .map((file) => {
      const slug = file.replace('.tsx', '');
      return `${siteUrl}/${slug === 'index' ? '' : slug}`;
    });

  const blogPosts = getBlogPostEntries().map(({ slug, filePath }) => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { attributes } = frontmatter(fileContent);
    return `${siteUrl}/blog/${attributes.slug ?? slug}`;
  });

  const tilPosts = getTilPostEntries().map(({ slug, filePath }) => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { attributes } = frontmatter(fileContent);
    return `${siteUrl}/today-i-learned/${attributes.slug ?? slug}`;
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
