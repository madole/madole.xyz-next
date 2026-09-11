import frontmatter from "front-matter";
import * as fs from "fs";
import Head from "next/head";
import path from "path";
import React from "react";
import readingTime from "reading-time";
import { IndexListItem } from "../components/IndexListItem";
import { Layout } from "../components/Layout/Layout";
import RssIcon from "../components/RSSIcon";

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
    <Layout minimal>
      <Head>
        <title>Blog | Madole.xyz</title>
        <meta name="description" content="Blog index for Madole.xyz" />
      </Head>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
          <p className="mt-1 text-sm font-light text-neutral-500">
            {blogPostsMetadata.length} posts
          </p>
        </div>
        <a
          href="feed://madole.xyz/rss.atom"
          title="RSS"
          className="text-neutral-400 hover:text-neutral-900"
        >
          <RssIcon />
        </a>
      </header>
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
        "utf8"
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
