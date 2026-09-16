import fs from "fs";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Head from "next/head";
import path from "path";
import React from "react";
import { Layout } from "../../components/Layout/Layout";
import { mdxComponents } from "../../components/mdx/mdx-components";
import OpenGraphHeadTags from "../../components/OpenGraphHeadTags";
import { RailBackLink, RailBlock } from "../../components/PostRail";
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
    <Layout
      reading
      rail={
        <>
          <RailBackLink href="/today-i-learned">All notes</RailBackLink>
          <RailBlock label="Learned">{postDate}</RailBlock>
          {timeToRead ? (
            <RailBlock label="Reading time">{timeToRead}</RailBlock>
          ) : null}
          {url ? (
            <RailBlock label="Source">
              <a
                href={url}
                title={url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:text-neutral-900 hover:underline"
              >
                Read more
              </a>
            </RailBlock>
          ) : null}
        </>
      }
    >
      <Head>
        <title>Today I Learned | Madole.xyz</title>
        <OpenGraphHeadTags
          title={`TIL ${title}`}
          description={title}
          imageUrl={
            og_image
              ? `https://madole.xyz/${og_image}`
              : "https://madole.xyz/bitmoji.png"
          }
          url={`https://madole.xyz/today-i-learned/${slug}`}
          ogImageAlt={title}
        />
      </Head>
      <h1 className="mb-8 max-w-[680px] text-balance text-4xl font-semibold tracking-tight text-neutral-900 md:text-[40px] md:leading-[1.12]">
        {title}
      </h1>
      <article className="prose prose-neutral max-w-[680px] break-words text-pretty prose-a:font-normal prose-a:text-neutral-900 prose-a:underline prose-a:decoration-neutral-300 prose-a:underline-offset-4 hover:prose-a:decoration-neutral-900">
        {/* @ts-ignore */}
        <MDXRemote {...body} components={mdxComponents} />
      </article>
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
  og_image?: string;
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const slug = params.slug + ".md";
  const content = fs.readFileSync(
    path.join(process.cwd(), "content/today-i-learned", slug),
    "utf8",
  );
  const data = await parseMdxContent<PostAttributes>(content, serialize);
  return { props: { data, slug: params.slug } };
}
