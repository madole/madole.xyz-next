import frontmatter from "front-matter";
import fs from "fs";
import Head from "next/head";
import path from "path";
import React from "react";
import readingTime from "reading-time";
import { IndexHeader } from "../components/IndexHeader";
import { IndexListItem } from "../components/IndexListItem";
import { Layout } from "../components/Layout/Layout";

export interface TodayILearnedProps {
  postsMetadata: {
    timeToRead: string;
    filename: string;
    date: string;
    title: string;
    slug: string;
    excerpt: string | null;
    url: string | null;
  }[];
}

const TodayILearned: React.FC<TodayILearnedProps> = (props) => {
  const { postsMetadata } = props;
  return (
    <Layout reading>
      <Head>
        <title>Today I learned | Madole.xyz</title>
        <meta
          name="description"
          content="Short notes on things I learned, from Madole.xyz"
        />
      </Head>
      <IndexHeader
        title="Today I learned"
        subtitle={`${postsMetadata.length} notes`}
      />
      <div>
        {postsMetadata.map((post) => (
          <IndexListItem
            title={post.title}
            date={post.date}
            timeToRead={post.timeToRead}
            excerpt={post.excerpt ?? undefined}
            sourceUrl={post.url ?? undefined}
            slug={
              "today-i-learned/" +
              (post.slug ?? `${post.title.split(" ").join("-")}`)
            }
            key={post.title}
          />
        ))}
      </div>
    </Layout>
  );
};

export default TodayILearned;

/*
 * TIL entries are short, so the index shows the opening line rather than the
 * title alone. Markdown syntax is stripped so a blockquote or code fence does
 * not leak its punctuation into the summary.
 */
function firstLine(body: string): string | null {
  const line = body
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.length > 0 && !l.startsWith("#") && !l.startsWith("```"));
  if (!line) return null;
  const plain = line
    .replace(/^>\s*/, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();
  if (!plain) return null;
  return plain.length > 180 ? plain.slice(0, 177).trimEnd() + "…" : plain;
}

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
        url?: string;
      }>(file);
      const timeToRead = readingTime(data.body).text;
      return {
        ...data.attributes,
        timeToRead,
        filename,
        slug: filename.replace(".md", ""),
        date: data.attributes.date.toString(),
        excerpt: firstLine(data.body),
        url: data.attributes.url ?? null,
      };
    })
    .sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));
  return { props: { postsMetadata } };
}
