import frontmatter from "front-matter";
import * as fs from "fs";
import Head from "next/head";
import React from "react";
import readingTime from "reading-time";
import { IndexListItem } from "../components/IndexListItem";
import { Layout } from "../components/Layout/Layout";
import RssIcon from "../components/RSSIcon";
import { getBlogPostEntries } from "../utils/blogPosts";

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
    <Layout isIndexPage>
      <Head>
        <title>Blog | Madole.xyz</title>
        <meta name="description" content="Blog index for Madole.xyz" />
      </Head>
      <section id="main-content">
        <h1 className="prose text-2xl font-semibold text-center lg:text-4xl flex justify-center items-center  w-full">
          Latest Blog Posts
          <a href="feed://madole.xyz/rss.atom" className="pl-3" title="RSS">
            <RssIcon />
          </a>
        </h1>
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
        <div className="flex justify-center">
          Post count: {blogPostsMetadata.length}
        </div>
      </section>
    </Layout>
  );
};

export default BlogIndex;

export const getStaticProps = () => {
  const blogPostsMetadata = getBlogPostEntries()
    .map(({ slug, filePath }) => {
      const file = fs.readFileSync(filePath, "utf8");
      const data = frontmatter<Post>(file);
      const timeToRead = readingTime(data.body);
      return {
        ...(data.attributes as {}),
        timeToRead,
        date: data.attributes.date.toString(),
        slug: data.attributes.slug ?? slug,
      };
    })
    .sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));
  return { props: { blogPostsMetadata } };
};
