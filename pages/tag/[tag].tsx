import React from "react";
import * as fs from "fs";
import path from "path";
import frontmatter from "front-matter";
import { IndexListItem } from "../../components/IndexListItem";
import readingTime from "reading-time";
import Head from "next/head";
import Link from "next/link";
import { IndexHeader } from "../../components/IndexHeader";
import { Layout } from "../../components/Layout/Layout";
import { ThemeToggle } from "../../components/ThemeToggle";
import { tagItems } from "../../utils/tags";

function readBlogPosts(): {
  filename: string;
  attributes: Post;
  body: string;
}[] {
  const dir = path.join(process.cwd(), "content/blog");
  return fs.readdirSync(dir).map((filename) => {
    const file = fs.readFileSync(path.join(dir, filename), "utf8");
    const data = frontmatter<Post>(file);
    return { filename, attributes: data.attributes, body: data.body };
  });
}

interface Post {
  title: string;
  date: string;
  slug: string;
  tags?: string[];
  timeToRead: {
    text: string;
    minutes: number;
    time: number;
  };
}

export interface TagPageProps {
  blogPostsMetadata: Post[];
  tag: string;
}

const TagPage: React.FC<TagPageProps> = (props) => {
  const { blogPostsMetadata, tag } = props;
  return (
    <Layout reading>
      <Head>
        <title>{`#${tag}`} | Madole.xyz</title>
        <meta
          name="description"
          content={`Posts tagged ${tag} on Madole.xyz`}
        />
      </Head>
      <IndexHeader
        title={`#${tag}`}
        subtitle={`${blogPostsMetadata.length} ${
          blogPostsMetadata.length === 1 ? "post" : "posts"
        }`}
        action={
          <div className="flex items-center gap-4">
            <Link
              href="/blog-index"
              className="text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              All posts
            </Link>
            <ThemeToggle className="-mx-2" />
          </div>
        }
      />
      <div>
        {blogPostsMetadata.map((post) => (
          <IndexListItem
            title={post.title}
            date={post.date}
            timeToRead={post.timeToRead.text}
            slug={
              post.slug
                ? "blog/" + post.slug
                : `blog/${post.title.split(" ").join("-")}`
            }
            tags={post.tags}
            key={post.title}
          />
        ))}
      </div>
    </Layout>
  );
};

export default TagPage;

export function getStaticPaths() {
  /*
    Every tag page is keyed by its normalised slug, and the set is a Set so
    "Javascript" and "javascript" cannot produce the same path twice.
  */
  const slugs = new Set<string>();
  for (const { attributes } of readBlogPosts()) {
    for (const { slug } of tagItems(attributes.tags)) slugs.add(slug);
  }
  return {
    paths: Array.from(slugs).map((slug) => "/tag/" + slug),
    fallback: false,
  };
}

export const getStaticProps = (context: { params: { tag: string } }) => {
  const {
    params: { tag },
  } = context;

  const blogPostsMetadata = readBlogPosts()
    .map(({ filename, attributes, body }) => {
      const slugs = tagItems(attributes.tags).map((item) => item.slug);
      if (!slugs.includes(tag)) return null;
      const timeToRead = readingTime(body);
      return {
        ...(attributes as {}),
        timeToRead,
        date: attributes.date.toString(),
        slug: filename.split(".mdx")[0],
      };
    })
    .filter((post) => post !== null)
    // @ts-ignore -> Filtering out nulls above
    .sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));
  return { props: { blogPostsMetadata, tag } };
};
