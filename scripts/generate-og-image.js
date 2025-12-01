const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const yaml = require("js-yaml");
const frontMatter = require("front-matter");

const TITLE_LINE_SPACING = 8
const SITE_NAME_SPACING = 5

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

    let imageBuffer;
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      const response = await fetch(imageUrl);
      imageBuffer = await response.arrayBuffer();
    } else {
      // Local file path
      const localPath = path.isAbsolute(imageUrl) ? imageUrl : path.join(process.cwd(), imageUrl);
      imageBuffer = fs.readFileSync(localPath);
    }

    const width = 1200;
    const height = 630;

    // Pre-process the background image for better compression
    const optimizedBackgroundBuffer = await sharp(Buffer.from(imageBuffer))
      .resize(width, height)
      .jpeg({ quality: 85, progressive: true })
      .toBuffer();
    // Split title into lines of max 30 characters
    const splitNewLineTitle = title.split(" ").reduce((lines, word) => {
      if (!lines.length) return [word];
      const lastLine = lines[lines.length - 1];
      if ((lastLine + " " + word).length <= 30) {
        lines[lines.length - 1] = lastLine + " " + word;
      } else {
        lines.push(word);
      }
      return lines;
    }, []);

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
        ${splitNewLineTitle
          .map(
            (line, i) =>
              `<text x="50%" y="${50 + i * TITLE_LINE_SPACING}%" dominant-baseline="middle" text-anchor="middle" class="title">${line.toUpperCase()}</text>`
          )
          .join("\n")}
        <text x="50%" y="${60 + splitNewLineTitle.length * SITE_NAME_SPACING}%" dominant-baseline="middle" text-anchor="middle" class="site-name">MADOLE.XYZ</text>
      </g>
      </svg>
    `;

    const outputImagePath = path.join(
      process.cwd(),
      "public",
      "og",
      `${slug}.jpg`
    );

    await sharp(optimizedBackgroundBuffer)
      .jpeg({
        quality: 80,
        progressive: true,
        mozjpeg: true,
      })
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
      og_image: `/og/${slug}.jpg`,
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
