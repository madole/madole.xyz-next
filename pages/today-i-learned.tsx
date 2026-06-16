import frontmatter from "front-matter";
import * as fs from "fs";
import React from "react";
import readingTime from "reading-time";
import { IndexListItem } from "../components/IndexListItem";
import { Layout } from "../components/Layout/Layout";
import { getTilPostEntries } from "../utils/tilPosts";

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
  const postsMetadata = getTilPostEntries()
    .map(({ slug, filePath }) => {
      const file = fs.readFileSync(filePath, "utf8");
      const data = frontmatter<{
        title: string;
        date: Date;
        slug?: string;
      }>(file);
      const timeToRead = readingTime(data.body).text;
      return {
        ...data.attributes,
        timeToRead,
        filename: filePath.split("/").pop() ?? slug,
        slug: data.attributes.slug ?? slug,
        date: data.attributes.date.toString(),
      };
    })
    .sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));
  return { props: { postsMetadata } };
}
