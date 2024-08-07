import Head from "next/head";
import React from "react";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { Layout } from "../../components/Layout";
import { MDXRemote } from "next-mdx-remote";
import "prismjs/themes/prism-tomorrow.css";
import { mdxComponents } from "../../components/mdx/mdx-components";
import { parseMdxContent } from "../../utils/parseMdxContent";
import { useLocalDate } from "../../hooks/useLocalDate";
import OpenGraphHeadTags from "../../components/OpenGraphHeadTags";

export interface TodayILearnedProps extends PostAttributes {
  data: {
    attributes: PostAttributes;
    body: string;
  };
  slug: string;
}

const TodayILearned: React.FC<TodayILearnedProps> = (props) => {
  const {
    attributes: { title, date, url, timeToRead },
    body,
  } = props.data;
  const { slug } = props;

  const postDate = useLocalDate(date);

  return (
    <Layout>
      <Head>
        <title>Today I Learned | Madole.xyz</title>
        <OpenGraphHeadTags
          title={`TIL ${title}`}
          description={title}
          imageUrl="https://madole.xyz/bitmoji.png"
          url={`https://madole.xyz/today-i-learned/${slug}`}
        />
      </Head>
      <section className="bg-white inline-flex flex-col items-center justify-start mt-10 mx-2 shadow-lg p-4 md:p-10 rounded w-full md:max-w-3xl 2xl:max-w-5xl">
        <h1 className="prose pb-1 text-3xl font-semibold text-center md:px-20">
          {title}
        </h1>
        <div className="prose font-light">
          {postDate} &mdash; {timeToRead}
        </div>
        <article className="prose mt-10 break-words w-full md:w-2/3">
          {/* @ts-ignore */}
          <MDXRemote {...body} components={mdxComponents} />
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
        <Link
          href="/today-i-learned"
          className="text-blue-500 hover:text-blue-700 visited:text-purple-600 cursor-pointer mb-10"
        >
          Back
        </Link>
      </section>
    </Layout>
  );
};

export default TodayILearned;

export function getStaticPaths() {
  const filenames = fs.readdirSync(
    path.join(process.cwd(), "content/today-i-learned"),
  );
  return {
    paths: filenames.map(
      (filename) => "/today-i-learned/" + filename.replace(".md", ""),
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
    "utf8",
  );
  const data = await parseMdxContent<PostAttributes>(content);
  return { props: { data, slug: params.slug } };
}
