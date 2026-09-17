import frontmatter from "front-matter";
import * as fs from "fs";
import Head from "next/head";
import Link from "next/link";
import path from "path";
import React from "react";
import readingTime from "reading-time";
import { IndexListItem } from "../components/IndexListItem";
import { IndexHeader } from "../components/IndexHeader";
import { Layout } from "../components/Layout/Layout";
import RssIcon from "../components/RSSIcon";
import { ThemeToggle } from "../components/ThemeToggle";

interface Post {
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
  slug: string;
  timeToRead: {
    text: string;
    minutes: number;
    time: number;
  };
}

export interface BlogIndexProps {
  blogPostsMetadata: Post[];
}

const BlogIndex: React.FC<BlogIndexProps> = (props) => {
  const { blogPostsMetadata } = props;
  return (
    <Layout reading>
      <Head>
        <title>Blog | Madole.xyz</title>
        <meta name="description" content="Blog index for Madole.xyz" />
      </Head>
      <IndexHeader
        title="Blog"
        subtitle={`${blogPostsMetadata.length} posts`}
        action={
          <div className="flex items-center gap-4">
            <Link
              href="/tags"
              className="text-sm text-neutral-400 underline-offset-4 hover:text-neutral-900 hover:underline dark:text-neutral-500 dark:hover:text-neutral-100"
            >
              Tags
            </Link>
            <a
              href="feed://madole.xyz/rss.atom"
              title="RSS"
              aria-label="RSS feed"
              className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              <RssIcon />
            </a>
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
                : `${post.title.split(" ").join("-")}`
            }
            tags={post.tags}
            key={post.title}
          />
        ))}
      </div>
    </Layout>
  );
};

export default BlogIndex;

export const getStaticProps = () => {
  const filenames = fs.readdirSync(path.join(process.cwd(), "content/blog"));
  const blogPostsMetadata = filenames
    .map((filename) => {
      // use frontmatter to read the titles of each blog post
      const file = fs.readFileSync(
        path.join(process.cwd(), "content/blog", filename),
        "utf8",
      );
      const data = frontmatter<Post>(file);
      const timeToRead = readingTime(data.body);
      return {
        ...(data.attributes as {}),
        timeToRead,
        date: data.attributes.date.toString(),
        slug: data.attributes.slug ?? filename.split(".mdx")[0],
      };
    })
    .sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));
  return { props: { blogPostsMetadata } };
};
