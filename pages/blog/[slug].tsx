import fs from "fs";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Head from "next/head";
import path from "path";
import { Layout } from "../../components/Layout/Layout";
import OpenGraphHeadTags from "../../components/OpenGraphHeadTags";
import { RailBackLink, RailBlock, RailTags } from "../../components/PostRail";
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
    <Layout
      reading
      rail={
        <>
          <RailBackLink href="/blog-index">All posts</RailBackLink>
          <RailBlock label="Published">{postDate}</RailBlock>
          {timeToRead ? (
            <RailBlock label="Reading time">{timeToRead}</RailBlock>
          ) : null}
        </>
      }
      railFooter={<RailTags tags={tags} />}
    >
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
      <h1 className="mb-8 max-w-[680px] text-balance text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-[44px] md:leading-[1.1]">
        {title}
      </h1>
      <article className="prose prose-neutral max-w-[680px] break-words text-pretty prose-a:font-normal prose-a:text-neutral-900 prose-a:underline prose-a:decoration-neutral-300 prose-a:underline-offset-4 hover:prose-a:decoration-neutral-900 dark:prose-invert dark:prose-a:text-neutral-100 dark:prose-a:decoration-neutral-600 dark:hover:prose-a:decoration-neutral-100">
        {/* @ts-ignore */}
        <MDXRemote {...body} />
      </article>
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
    "utf8",
  );
  const data = await parseMdxContent<PostAttributes>(content, serialize);
  return { props: { data } };
}
