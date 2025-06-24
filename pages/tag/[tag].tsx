import React from "react";
import * as fs from "fs";
import path from "path";
import frontmatter from "front-matter";
import { IndexListItem } from "../../components/IndexListItem";
import readingTime from "reading-time";
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
    <Layout>
      <section
        id="main-content"
        className="w-11/12 p-8 md:py-8 md:px-20 my-4 overflow-hidden bg-white rounded lg:w-4/6 lg:shadow-lg h-full mb-6 "
      >
        <h1 className="prose pb-1 text-2xl font-semibold text-center lg:text-4xl">
          Tag: {tag}
        </h1>
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
        <div className="flex justify-center">
          Post count: {blogPostsMetadata.length}
        </div>
      </section>
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
    paths: tags.map(
      (tag) => "/tag/" + tag?.split(" ").join("-").toLocaleUpperCase(),
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
