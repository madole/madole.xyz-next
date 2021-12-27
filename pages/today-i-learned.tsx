import React from "react";
import Head from "next/head";
import fs from "fs";
import path from "path";
import frontmatter from "front-matter";
import readingTime from "reading-time";
import { useRouter } from "next/router";
import { Layout } from "../components/Layout";

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
  const router = useRouter();
  return (
    <Layout>
      <Head>
        <title>Today I Learned | Madole.xyz</title>
      </Head>
      <section className="flex items-center flex-col w-full">
        <h1 className="text-4xl text-white text-center m-5">Today I learned</h1>
        <table
          className="bg-white rounded-xl overflow-hidden mb-5 w-10/12"
          cellPadding="20"
        >
          <thead>
            <tr>
              <th className="hidden md:table-cell">Title</th>
              <th className="hidden md:table-cell">Time To Read</th>
              <th className="hidden md:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {postsMetadata.map((post) => {
              const link = `/today-i-learned/${post.slug}`;
              return (
                <tr
                  key={post.filename}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    router.push(link);
                  }}
                >
                  <td className="border-2 md:border-0">{post.title}</td>
                  <td className="hidden md:table-cell">
                    {post.timeToRead} minute
                  </td>
                  <td className="hidden md:table-cell">
                    {new Date(post.date).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </Layout>
  );
};

export default TodayILearned;

export function getStaticProps() {
  const filenames = fs.readdirSync(
    path.join(process.cwd(), "content/today-i-learned")
  );
  const postsMetadata = filenames.map((filename) => {
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
  });
  return { props: { postsMetadata } };
}
