import fs from "fs";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Head from "next/head";
import Link from "next/link";
import path from "path";
import "prismjs/themes/prism-tomorrow.css";
import React from "react";
import { Layout } from "../../components/Layout/Layout";
import { mdxComponents } from "../../components/mdx/mdx-components";
import OpenGraphHeadTags from "../../components/OpenGraphHeadTags";
import { useLocalDate } from "../../hooks/useLocalDate";
import { parseMdxContent } from "../../utils/parseMdxContent";

export interface TodayILearnedProps extends PostAttributes {
  data: {
    attributes: PostAttributes;
    body: string;
  };
  slug: string;
}

const TodayILearned: React.FC<TodayILearnedProps> = (props) => {
  const {
    attributes: { title, date, url, timeToRead, og_image },
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
          imageUrl={og_image ?? "https://madole.xyz/bitmoji.png"}
          url={`https://madole.xyz/today-i-learned/${slug}`}
        />
      </Head>
      <section id="main-content">
        <h1 className="prose-h1 text-center font-semibold text-3xl">{title}</h1>
        <div className="prose font-light text-center">
          {postDate} &mdash; {timeToRead}
        </div>
        <article className="prose prose-slate break-words md:break-normal w-full text-pretty">
          {/* @ts-ignore */}
          <MDXRemote {...body} components={mdxComponents} />
        </article>
        <div className="flex justify-center items-center gap-8">
          <Link
            href="/today-i-learned"
            className="text-blue-500 hover:text-blue-700 visited:text-purple-600 cursor-pointer hover:underline"
          >
            Back
          </Link>
          {url && (
            <a
              className="text-blue-500 hover:text-blue-700 visited:text-purple-600 cursor-pointer hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              href={url}
              title={url}
            >
              Read more
            </a>
          )}
        </div>
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
  og_image?: string;
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const slug = params.slug + ".md";
  const content = fs.readFileSync(
    path.join(process.cwd(), "content/today-i-learned", slug),
    "utf8"
  );
  const data = await parseMdxContent<PostAttributes>(content, serialize);
  return { props: { data, slug: params.slug } };
}
