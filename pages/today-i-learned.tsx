import frontmatter from "front-matter";
import fs from "fs";
import path from "path";
import React from "react";
import readingTime from "reading-time";
import { IndexListItem } from "../components/IndexListItem";
import { Layout } from "../components/Layout/Layout";

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
    <Layout isIndexPage>
      <section id="main-content">
        <h1 className="prose text-2xl font-semibold text-center lg:text-4xl w-full">
          Today I learned
        </h1>
        {postsMetadata.map((post) => (
          <IndexListItem
            title={post.title}
            date={post.date}
            timeToRead={post.timeToRead}
            slug={
              "today-i-learned/" +
              (post.slug ?? `${post.title.split(" ").join("-")}`)
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
