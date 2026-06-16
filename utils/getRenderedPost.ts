import rehypePrism from "@mapbox/rehype-prism";
import { serialize } from "next-mdx-remote/serialize";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import readingTime from "reading-time";
import remarkGfm from "remark-gfm";
import { reader } from "../keystatic/reader";

export interface RenderedPost {
  attributes: {
    title: string;
    date: string;
    slug: string;
    tags: string[];
    timeToRead: string;
    description: string | null;
    og_image: string | null;
  };
  body: MDXRemoteSerializeResult;
}

export async function listPostSlugs(): Promise<string[]> {
  return reader.collections.posts.list();
}

export async function getRenderedPost(slug: string): Promise<RenderedPost> {
  const entry = await reader.collections.posts.readOrThrow(slug);
  const source = await entry.content();
  const timeToRead = readingTime(source).text;
  const body = await serialize(source, {
    mdxOptions: {
      rehypePlugins: [rehypePrism],
      remarkPlugins: [remarkGfm],
    },
  });

  return {
    attributes: {
      title: entry.title,
      date: entry.date ?? "",
      slug,
      tags: [...entry.tags],
      timeToRead,
      description: entry.description || null,
      og_image: entry.og_image || null,
    },
    body,
  };
}
