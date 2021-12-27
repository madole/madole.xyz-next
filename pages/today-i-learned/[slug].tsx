import Head from "next/head";
import React, { Fragment, useEffect, useState } from "react";
import fs from "fs";
import path from "path";
import frontmatter from "front-matter";
import readingTime from "reading-time";
import { compile, run } from "@mdx-js/mdx";
import Link from "next/link";
import * as runtime from "react/jsx-runtime";
import { Layout } from "../../components/Layout";

export interface TodayILearnedProps extends PostAttributes {
  data: {};
}

const TodayILearned: React.FC<TodayILearnedProps> = (props) => {
  const {
    attributes: { title, date, url, timeToRead },
    body,
  } = props.data;
  console.log(props);

  const [mdxModule, setMdxModule] = useState();
  // @ts-ignore
  const Content = mdxModule ? mdxModule.default : Fragment;

  useEffect(() => {
    (async () => {
      setMdxModule(await run(body, runtime));
    })();
  }, [body]);
  return (
    <Layout>
      <Head>
        <title>Today I Learned | Madole.xyz</title>
      </Head>
      <section className="bg-white inline-flex flex-col items-center justify-start mt-10 shadow-lg p-4 md:p-10 rounded-3xl w-11/12 md:w-2/3">
        <h1 className="pb-1 text-3xl font-semibold text-center">{title}</h1>
        <h2>{new Date(date).toLocaleDateString()}</h2>
        <i>{timeToRead}</i>
        <article className="mt-10 break-words w-full md:w-2/3">
          <Content />
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
  const compiledBody = String(
    await compile(data.body, {
      outputFormat: "function-body" /* …otherOptions */,
    })
  );
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
