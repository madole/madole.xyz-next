import frontmatter from "front-matter";
import * as fs from "fs";
import Head from "next/head";
import Link from "next/link";
import path from "path";
import React from "react";
import { IndexHeader } from "../components/IndexHeader";
import { Layout } from "../components/Layout/Layout";
import { tagItems } from "../utils/tags";

interface PostAttributes {
  tags?: string[];
}

export interface TagsPageProps {
  tags: { name: string; slug: string; count: number }[];
}

const TagsPage: React.FC<TagsPageProps> = (props) => {
  const { tags } = props;
  return (
    <Layout reading>
      <Head>
        <title>Tags | Madole.xyz</title>
        <meta name="description" content="Every topic on the Madole.xyz blog" />
      </Head>
      <IndexHeader
        title="Tags"
        subtitle={`${tags.length} tags`}
        action={
          <Link
            href="/blog-index"
            className="text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            All posts
          </Link>
        }
      />
      {/*
        Tags are shown as they are written in frontmatter (so "Javascript" keeps
        its capitals), while the link and the page it points at share one slug
        from utils/tags. Counts are folded in from every tagged post.
      */}
      <ul className="flex flex-wrap gap-x-6 gap-y-3">
        {tags.map(({ name, slug, count }) => (
          <li key={slug}>
            <Link
              href={`/tag/${slug}`}
              className="inline-flex items-baseline gap-1.5 text-xl font-medium tracking-tight text-neutral-900 decoration-neutral-300 underline-offset-4 hover:underline dark:text-neutral-100 dark:decoration-neutral-600"
            >
              #{name}
              <span className="text-sm font-normal text-neutral-400 dark:text-neutral-500">
                {count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default TagsPage;

export const getStaticProps = () => {
  const dir = path.join(process.cwd(), "content/blog");

  const counts = new Map<string, { name: string; count: number }>();
  for (const filename of fs.readdirSync(dir)) {
    const file = fs.readFileSync(path.join(dir, filename), "utf8");
    const data = frontmatter<PostAttributes>(file);
    for (const { name, slug } of tagItems(data.attributes.tags)) {
      const entry = counts.get(slug);
      if (entry) {
        entry.count += 1;
      } else {
        counts.set(slug, { name, count: 1 });
      }
    }
  }

  // Most-used first, then alphabetically, so the page leads with the themes
  // that actually carry the blog.
  const tags = Array.from(counts.entries())
    .map(([slug, { name, count }]) => ({ name, slug, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  return { props: { tags } };
};
