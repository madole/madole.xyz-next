const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const yaml = require("js-yaml");
const frontMatter = require("front-matter");

const [slug, imageUrl] = process.argv.slice(2);

if (!slug || !imageUrl) {
  console.error("Usage: node scripts/generate-og-image.js <slug> <image-url>");
  process.exit(1);
}

const blogPostPath = path.join(process.cwd(), "content", "blog", `${slug}.mdx`);

if (!fs.existsSync(blogPostPath)) {
  console.error(`Blog post not found at: ${blogPostPath}`);
  process.exit(1);
}

const generateImage = async () => {
  try {
    const fileContent = fs.readFileSync(blogPostPath, "utf8");
    const { attributes: postAttributes, body } = frontMatter(fileContent);
    const { title } = postAttributes;

    const response = await fetch(imageUrl);
    const imageBuffer = await response.arrayBuffer();

    const width = 1200;
    const height = 630;

    const svgText = `
      <svg width="${width}" height="${height}">
        <style>
          .title {
            fill: white;
            font-size: 60px;
            font-weight: bold;
            font-family: sans-serif;
          }
          .site-name {
            fill: white;
            font-size: 40px;
            font-family: sans-serif;
          }
        </style>
        <!-- Decorative Corners -->
        <rect x="32" y="32" width="8" height="40" fill="#fff" />
        <rect x="32" y="32" width="40" height="8" fill="#fff" />
        <rect x="${width - 40 - 32}" y="32" width="40" height="8" fill="#fff" />
        <rect x="${width - 32 - 8}" y="32" width="8" height="40" fill="#fff" />
        <rect x="32" y="${height - 40 - 32}" width="8" height="40" fill="#fff" />
        <rect x="32" y="${height - 32 - 8}" width="40" height="8" fill="#fff" />
        <rect x="${width - 40 - 32}" y="${height - 32 - 8}" width="40" height="8" fill="#fff" />
        <rect x="${width - 32 - 8}" y="${height - 40 - 32}" width="8" height="40" fill="#fff" />
        <g style="background: rgba(0, 0, 0, 0.5);">
          <rect x="0" y="0" width="${width}" height="${height}" fill="rgba(0,0,0,0.4)" />
          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" class="title">${title.toUpperCase()}</text>
          <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" class="site-name">MADOLE.XYZ</text>
        </g>
      </svg>
    `;

    const outputImagePath = path.join(
      process.cwd(),
      "public",
      "og",
      `${slug}.png`
    );

    await sharp(imageBuffer)
      .resize(width, height)
      .composite([
        {
          input: Buffer.from(svgText),
          top: 0,
          left: 0,
        },
      ])
      .toFile(outputImagePath);

    console.log(`Successfully generated OG image at: ${outputImagePath}`);

    const updatedAttributes = {
      ...postAttributes,
      og_image: `/og/${slug}.png`,
    };
    const updatedFileContent = `---
${yaml.dump(updatedAttributes)}---
${body}`;

    fs.writeFileSync(blogPostPath, updatedFileContent);

    console.log(`Successfully updated frontmatter in: ${blogPostPath}`);
  } catch (error) {
    console.error("Error generating OG image:", error);
  }
};

generateImage();
