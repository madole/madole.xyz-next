import React from "react";
import * as fs from "fs";
import path from "path";
import frontmatter from "front-matter";
import Link from "next/link";
import { IndexListItem } from "../components/IndexListItem";
import readingTime from "reading-time";
import { Layout } from "../components/Layout";
import Head from "next/head";

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
    <Layout>
      <Head>
        <title>Blog | Madole.xyz</title>
        <meta name="description" content="Blog index for Madole.xyz" />
      </Head>
      <section
        id="main-content"
        className="w-11/12 p-8 md:py-8 md:px-20 my-4 overflow-hidden bg-white rounded lg:w-4/6 lg:shadow-lg h-full mb-6 "
      >
        <h1 className="prose pb-1 text-2xl font-semibold text-center lg:text-4xl">
          Latest Blog Posts
        </h1>
        {blogPostsMetadata.map((post) => (
          <IndexListItem
            title={post.title}
            date={post.date}
            timeToRead={post.timeToRead.text}
            slug={"blog/" + post.slug ?? `${post.title.split(" ").join("-")}`}
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
        slug: filename.split(".mdx")[0],
      };
    })
    .sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));
  return { props: { blogPostsMetadata } };
};
