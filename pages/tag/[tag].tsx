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

function dedupeArray<T>(arr: T[]) {
  return Array.from(new Set(arr));
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
        <meta name="description" content={`Posts tagged ${tag} on Madole.xyz`} />
      </Head>
      <IndexHeader
        title={`#${tag}`}
        subtitle={`${blogPostsMetadata.length} ${
          blogPostsMetadata.length === 1 ? "post" : "posts"
        }`}
        action={
          <Link
            href="/blog-index"
            className="text-sm text-neutral-500 hover:text-neutral-900"
          >
            All posts
          </Link>
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
  const filenames = fs.readdirSync(path.join(process.cwd(), "content/blog"));
  const tags = dedupeArray<string>(
    filenames.flatMap((filename) => {
      // use frontmatter to read the titles of each blog post
      const file = fs.readFileSync(
        path.join(process.cwd(), "content/blog", filename),
        "utf8",
      );
      const data = frontmatter<Post>(file);
      return data.attributes.tags as string[];
    }),
  );
  return {
    /*
      Lowercased to match both the comparison in getStaticProps and the hrefs
      the Tags components emit, so a generated page finds its own posts.
    */
    paths: tags.map(
      (tag) => "/tag/" + tag?.split(" ").join("-").toLocaleLowerCase(),
    ),
    fallback: false,
  };
}

export const getStaticProps = (context: { params: { tag: string } }) => {
  const {
    params: { tag },
  } = context;
  const filenames = fs.readdirSync(path.join(process.cwd(), "content/blog"));

  const blogPostsMetadata = filenames
    .map((filename) => {
      const file = fs.readFileSync(
        path.join(process.cwd(), "content/blog", filename),
        "utf8",
      );
      const data = frontmatter<Post>(file);
      const lowercaseTags =
        data.attributes.tags?.map((tag) => tag.toLowerCase()) ?? [];
      if (
        !lowercaseTags.includes(tag) &&
        !lowercaseTags.includes(tag.split("-").join(" "))
      ) {
        return null;
      }
      const timeToRead = readingTime(data.body);
      return {
        ...(data.attributes as {}),
        timeToRead,
        date: data.attributes.date.toString(),
        slug: filename.split(".mdx")[0],
      };
    })
    .filter((post) => post !== null)
    // @ts-ignore -> Filtering out nulls above
    .sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));
  return { props: { blogPostsMetadata, tag } };
};
