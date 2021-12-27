import React from "react";
import Head from "next/head";
import fs from "fs";
import path from "path";
import frontmatter from "front-matter";
import readingTime from "reading-time";
import { useRouter } from "next/router";
import { Layout } from "../components/Layout";
import { IndexListItem } from "../components/IndexListItem";

export interface TodayILearnedProps {
  postsMetadata: {
    timeToRead: string;
    filename: string;
    date: string;
    title: string;
    slug: string;
  }[];
}

const TodayILearned: React.FC<TodayILearnedProps> = (props) => {
  const { postsMetadata } = props;
  return (
    <Layout>
      <section
        id="main-content"
        className="w-11/12 p-8 md:py-8 md:px-20 my-4 overflow-hidden bg-white rounded lg:w-4/6 lg:shadow-lg h-full mb-6 "
      >
        <h1 className="prose pb-1 text-2xl font-semibold text-center lg:text-4xl">
          Today I learned
        </h1>
        {postsMetadata.map((post) => (
          <IndexListItem
            title={post.title}
            date={post.date}
            timeToRead={post.timeToRead}
            slug={
              "today-i-learned/" + post.slug ??
              `${post.title.split(" ").join("-")}`
            }
            key={post.title}
          />
        ))}
        <div className="flex justify-center">
          Post count: {postsMetadata.length}
        </div>
      </section>
    </Layout>
  );
};

export default TodayILearned;

export function getStaticProps() {
  const filenames = fs.readdirSync(
    path.join(process.cwd(), "content/today-i-learned")
  );
  const postsMetadata = filenames
    .map((filename) => {
      // use frontmatter to read the titles of each blog post
      const file = fs.readFileSync(
        path.join(process.cwd(), "content/today-i-learned", filename),
        "utf8"
      );
      const data = frontmatter<{
        title: string;
        date: Date;
        timeToRead: number;
      }>(file);
      const timeToRead = readingTime(data.body).text;
      return {
        ...data.attributes,
        timeToRead,
        filename,
        slug: filename.replace(".md", ""),
        date: data.attributes.date.toString(),
      };
    })
    .sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));
  return { props: { postsMetadata } };
}
