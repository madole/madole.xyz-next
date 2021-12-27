import * as React from "react";
import fs from "fs";
import path from "path";
import frontmatter from "front-matter";
import readingTime from "reading-time";
import { Layout } from "../../components/Layout";
import Head from "next/head";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import RedText from "../../components/mdx/RedText";
import rehypePrism from "@mapbox/rehype-prism";
import "prismjs/themes/prism-tomorrow.css";

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
        <title>{title} - Madole.xyz</title>
      </Head>
      <section
        id="main-content"
        className="w-full md:max-w-3xl 2xl:max-w-5xl p-8 my-4 overflow-hidden bg-white rounded lg:shadow-lg h-full"
      >
        <div className="flex flex-col items-center pb-4">
          <h1 className="pb-1 text-4xl font-semibold text-center">{title}</h1>
          <div className="pt-2 text-lg font-light italic">
            {new Date(date).toLocaleDateString()} &mdash; {timeToRead}
          </div>
        </div>
        <article className="post">
          {/* @ts-ignore */}
          <MDXRemote {...body} components={{ RedText }} />
        </article>
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
