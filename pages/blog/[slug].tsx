import * as React from "react";
import { Fragment, useEffect, useState } from "react";
import fs from "fs";
import path from "path";
import frontmatter from "front-matter";
import readingTime from "reading-time";
import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime.js";
import { Layout } from "../../components/Layout";
import Head from "next/head";

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
        <title>{title} - Madole.xyz</title>
      </Head>
      <section
        id="main-content"
        className="w-full md:max-w-3xl 2xl:max-w-5xl p-8 my-4 overflow-hidden bg-white rounded lg:shadow-lg h-full"
      >
        <div className="flex flex-col items-center">
          <h1 className="pb-1 text-4xl font-semibold text-center">{title}</h1>
          <div className="pt-2 text-lg font-light">
            {new Date(date).toLocaleDateString()} &mdash; {timeToRead} Min Read
          </div>
        </div>
        <article className="post">
          <Content />
        </article>
      </section>
    </Layout>
  );
}

export function getStaticPaths() {
  const filenames = fs.readdirSync(path.join(process.cwd(), "content/blog"));
  return {
    paths: filenames.map((filename) => "/blog/" + filename.replace(".md", "")),
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
  const slug = params.slug + ".md";
  const content = fs.readFileSync(
    path.join(process.cwd(), "content/blog", slug),
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
    attributes: { ...data.attributes, timeToRead },
    body: compiledBody,
  };
  return { props: { data: newData } };
}
