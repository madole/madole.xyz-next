import * as React from "react";
import Link from "next/link";

interface Props {
  title: string;
  date: string;
  excerpt?: string;
  slug: string;
  timeToRead: string;
  tags?: string[];
}

function isInvalidDate(d: Date | string) {
  return d === "Invalid Date";
}

function addSlashPrefix(slug: string) {
  if (slug.startsWith("/")) {
    return slug;
  }
  return `/${slug}`;
}

const dateStringOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
} as const;

export function IndexListItem(props: Props): JSX.Element {
  const { title, date, excerpt, slug, timeToRead, tags } = props;

  const dateString = new Date(date).toLocaleDateString(
    undefined,
    dateStringOptions
  );

  if (!slug) throw new Error("No slug provided for " + title);

  return (
    <div className="flex flex-col py-4">
      <Link href={addSlashPrefix(slug)}>
        <a className="hover:text-white hover:bg-blue-400 prose pb-2 text-lg lg:text-3xl md:font-light prose-a:no-underline md:p-1 rounded">
          {title}
        </a>
      </Link>
      <div className="md:px-2 text-sm font-light">
        {isInvalidDate(dateString) ? date : dateString} &mdash; {timeToRead}
      </div>
      <div className="pt-2">{excerpt}</div>
      <ul className="flex gap-1 flex-wrap justify-start">
        {tags?.map((tag) => (
          <li
            key={tag}
            className="px-2 rounded uppercase hover:bg-blue-500 hover:text-white text-sm font-light bg-gray-200"
          >
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
}
