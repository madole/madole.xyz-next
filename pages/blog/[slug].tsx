import * as React from "react";
import fs from "fs";
import path from "path";
import { Layout } from "../../components/Layout";
import Head from "next/head";
import { MDXRemote } from "next-mdx-remote";
import "prismjs/themes/prism-tomorrow.css";
import { mdxComponents } from "../../components/mdx/mdx-components";
import { parseMdxContent } from "../../utils/parseMdxContent";
import { Tags } from "../../components/Tags";

interface Props {
  data: {
    attributes: {
      title: string;
      date: string;
      slug: string;
      tags: string[];
      timeToRead: string;
    };
    body: string;
  };
}

export default function BlogPost(props: Props): JSX.Element {
  const {
    attributes: { title, date, slug, tags, timeToRead },
    body,
  } = props.data;

  return (
    <Layout>
      <Head>
        <title>{title} | Madole.xyz</title>
        <meta name="description" content={`${title} blog post`} />
      </Head>
      <section
        id="main-content"
        className="w-full md:max-w-3xl 2xl:max-w-5xl p-8 my-4 overflow-hidden bg-white rounded lg:shadow-lg h-full flex flex-col justify-center items-center"
      >
        <div className="flex flex-col items-center md:pb-4">
          <h1 className="prose pb-1 text-2xl md:text-4xl font-semibold text-center md:px-20">
            {title}
          </h1>
          <div className="prose pt-2 font-light">
            {new Date(date).toLocaleDateString()} &mdash; {timeToRead}
          </div>
        </div>
        <article className="prose prose-slate break-all md:break-normal">
          {/* @ts-ignore */}
          <MDXRemote {...body} components={mdxComponents} />
        </article>
        <div className="m-6">
          <Tags tags={tags} />
        </div>
      </section>
    </Layout>
  );
}

export function getStaticPaths() {
  const filenames = fs.readdirSync(path.join(process.cwd(), "content/blog"));
  return {
    paths: filenames.map((filename) => "/blog/" + filename.replace(".mdx", "")),
    fallback: false,
  };
}

interface PostAttributes {
  timeToRead: string;
  title: string;
  date: string;
  slug: string;
  tags: string[];
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const slug = params.slug + ".mdx";
  const content = fs.readFileSync(
    path.join(process.cwd(), "content/blog", slug),
    "utf8"
  );
  const data = await parseMdxContent<PostAttributes>(content);
  return { props: { data } };
}
