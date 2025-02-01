import fs from "fs";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Head from "next/head";
import path from "path";
import "prismjs/themes/prism-tomorrow.css";
import { Layout } from "../../components/Layout/Layout";
import OpenGraphHeadTags from "../../components/OpenGraphHeadTags";
import { Tags } from "../../components/Tags";
import { useLocalDate } from "../../hooks/useLocalDate";
import { parseMdxContent } from "../../utils/parseMdxContent";

interface Props {
  data: {
    attributes: {
      title: string;
      date: string;
      slug: string;
      tags: string[];
      timeToRead: string;
      description?: string;
      og_image?: string;
    };
    body: string;
  };
}
const dateStringOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
} as const;

export default function BlogPost(props: Props): JSX.Element {
  const {
    attributes: { title, date, slug, tags, timeToRead, description, og_image },
    body,
  } = props.data;

  const postDate = useLocalDate(date);

  return (
    <Layout>
      <Head>
        <title>{title} | Madole.xyz</title>
        <OpenGraphHeadTags
          title={title}
          description={(description ?? title) + " | " + "Blog post"}
          imageUrl={og_image ?? "https://madole.xyz/bitmoji.png"}
          url={`https://madole.xyz/blog/${slug}`}
          tags={tags}
        />
      </Head>
      <section id="main-content">
        <h1 className="prose pb-1 text-2xl md:text-4xl font-semibold text-center">
          {title}
        </h1>
        <div className="prose pt-2 font-light text-center">
          {postDate} &mdash; {timeToRead}
        </div>
        <article className="prose prose-slate break-words md:break-normal w-full text-pretty">
          {/* @ts-ignore */}
          <MDXRemote {...body} />
        </article>
        <div className="m-6 flex justify-center">
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
  const data = await parseMdxContent<PostAttributes>(content, serialize);
  return { props: { data } };
}
