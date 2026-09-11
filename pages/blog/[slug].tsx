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

export default function BlogPost(props: Props): React.ReactElement {
  const {
    attributes: { title, date, slug, tags, timeToRead, description, og_image },
    body,
  } = props.data;

  const postDate = useLocalDate(date);

  return (
    <Layout minimal>
      <Head>
        <title>{title} | Madole.xyz</title>
        <OpenGraphHeadTags
          title={title}
          description={(description ?? title) + " | " + "Blog post"}
          ogImageAlt={title}
          imageUrl={
            og_image
              ? `https://madole.xyz/${og_image}`
              : "https://madole.xyz/bitmoji.png"
          }
          url={`https://madole.xyz/blog/${slug}`}
          tags={tags}
        />
      </Head>
      <header className="mb-8">
        <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h1>
        <div className="mt-2 text-sm font-light text-neutral-500">
          {postDate} &mdash; {timeToRead}
        </div>
      </header>
      <article className="prose prose-neutral prose-a:font-normal prose-a:text-neutral-900 prose-a:underline prose-a:decoration-neutral-300 prose-a:underline-offset-4 hover:prose-a:decoration-neutral-900 w-full max-w-none break-words text-pretty">
        {/* @ts-ignore */}
        <MDXRemote {...body} />
      </article>
      <div className="mt-10 border-t border-neutral-200 pt-6">
        <Tags tags={tags} />
      </div>
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
