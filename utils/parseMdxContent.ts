import { remarkHighlightCodeBlocks } from "@tanstack/highlight/remark";
import frontmatter from "front-matter";
import { serialize } from "next-mdx-remote/serialize";
import readingTime from "reading-time";
import remarkGfm from "remark-gfm";
import { highlighter } from "./highlighter";

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
      // @ts-ignore
      remarkPlugins: [remarkGfm, [remarkHighlightCodeBlocks, { highlighter }]],
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
