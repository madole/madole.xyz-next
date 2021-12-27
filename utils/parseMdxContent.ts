import frontmatter from "front-matter";
import readingTime from "reading-time";
import { serialize } from "next-mdx-remote/serialize";
import rehypePrism from "@mapbox/rehype-prism";

interface BaseMdxContent {
  title: string;
  date: string;
}
export async function parseMdxContent<T extends BaseMdxContent>(
  content: string
) {
  const data = frontmatter<T>(content);
  const timeToRead = readingTime(data.body).text;
  const compiledBody = await serialize(data.body, {
    mdxOptions: {
      rehypePlugins: [rehypePrism],
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
