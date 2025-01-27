import rehypePrism from "@mapbox/rehype-prism";
import frontmatter from "front-matter";
import { serialize } from "next-mdx-remote/serialize";
import readingTime from "reading-time";
import remarkGfm from "remark-gfm";

interface BaseMdxContent {
  title: string;
  date: string;
}
export async function parseMdxContent<T extends BaseMdxContent>(
  content: string,
  mdxSerialize: typeof serialize
) {
  const data = frontmatter<T>(content);
  const timeToRead = readingTime(data.body).text;
  const compiledBody = await mdxSerialize(data.body, {
    mdxOptions: {
      rehypePlugins: [rehypePrism],
      // @ts-ignore
      remarkPlugins: [remarkGfm],
    },
  });
  return {
    ...data,
    attributes: {
      ...data.attributes,
      timeToRead,
      date: data.attributes.date.toString(),
    },
    body: compiledBody,
  };
}
