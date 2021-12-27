import Head from "next/head";
import React from "react";
import fs from "fs";
import path from "path";
import frontmatter from "front-matter";
import readingTime from "reading-time";
import Link from "next/link";
import { Layout } from "../../components/Layout";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import RedText from "../../components/mdx/RedText";
import rehypePrism from "@mapbox/rehype-prism";
import "prismjs/themes/prism-tomorrow.css";

export interface TodayILearnedProps extends PostAttributes {
  data: {
    attributes: PostAttributes;
    body: string;
  };
}

const TodayILearned: React.FC<TodayILearnedProps> = (props) => {
  const {
    attributes: { title, date, url, timeToRead },
    body,
  } = props.data;

  return (
    <Layout>
      <Head>
        <title>Today I Learned | Madole.xyz</title>
      </Head>
      <section className="bg-white inline-flex flex-col items-center justify-start mt-10 shadow-lg p-4 md:p-10 rounded-3xl w-11/12 md:w-2/3">
        <h1 className="prose pb-1 text-3xl font-semibold text-center">
          {title}
        </h1>
        <div className="prose font-light">
          {new Date(date).toLocaleDateString()} &mdash; {timeToRead}
        </div>
        <article className="prose mt-10 break-words w-full md:w-2/3">
          {/* @ts-ignore */}
          <MDXRemote {...body} components={{ RedText }} />
        </article>
        {url && (
          <a
            className="text-blue-500 hover:text-blue-700 visited:text-purple-600 cursor-pointer m-10"
            target="_blank"
            rel="noopener noreferrer"
            href={url}
            title={url}
          >
            Read more
          </a>
        )}
        <Link href="/today-i-learned">
          <a className="text-blue-500 hover:text-blue-700 visited:text-purple-600 cursor-pointer mb-10">
            Back
          </a>
        </Link>
      </section>
    </Layout>
  );
};

export default TodayILearned;

export function getStaticPaths() {
  const filenames = fs.readdirSync(
    path.join(process.cwd(), "content/today-i-learned")
  );
  return {
    paths: filenames.map(
      (filename) => "/today-i-learned/" + filename.replace(".md", "")
    ),
    fallback: false,
  };
}

interface PostAttributes {
  timeToRead: string;
  title: string;
  date: string;
  body: string;
  url: string;
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const slug = params.slug + ".md";
  const content = fs.readFileSync(
    path.join(process.cwd(), "content/today-i-learned", slug),
    "utf8"
  );
  const data = frontmatter<PostAttributes>(content);
  const timeToRead = readingTime(data.body).text;
  const compiledBody = await serialize(data.body, {
    mdxOptions: {
      rehypePlugins: [rehypePrism],
    },
  });
  const newData = {
    ...data,
    attributes: {
      ...data.attributes,
      timeToRead,
      date: data.attributes.date.toString(),
    },
    body: compiledBody,
  };
  return { props: { data: newData } };
}
