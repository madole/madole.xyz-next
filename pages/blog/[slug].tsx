import { MDXRemote } from "next-mdx-remote";
import Head from "next/head";
import "prismjs/themes/prism-tomorrow.css";
import { Layout } from "../../components/Layout/Layout";
import OpenGraphHeadTags from "../../components/OpenGraphHeadTags";
import { Tags } from "../../components/Tags";
import { useLocalDate } from "../../hooks/useLocalDate";
import { mdxComponents } from "../../components/mdx/mdx-components";
import {
  getRenderedPost,
  listPostSlugs,
  type RenderedPost,
} from "../../utils/getRenderedPost";

interface Props {
  data: RenderedPost;
}

export default function BlogPost(props: Props): React.ReactElement {
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
      <section id="main-content">
        <h1 className="prose pb-1 text-2xl md:text-4xl font-semibold text-center">
          {title}
        </h1>
        <div className="prose pt-2 font-light text-center">
          {postDate} &mdash; {timeToRead}
        </div>
        <article className="prose prose-slate break-words md:break-normal w-full text-pretty">
          <MDXRemote {...body} components={mdxComponents} />
        </article>
        <div className="m-6 flex justify-center">
          <Tags tags={tags} />
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticPaths() {
  const slugs = await listPostSlugs();
  return {
    paths: slugs.map((slug) => `/blog/${slug}`),
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const data = await getRenderedPost(params.slug);
  return { props: { data } };
}
