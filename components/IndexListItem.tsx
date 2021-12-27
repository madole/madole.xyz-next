import * as React from "react";
import Link from "next/link";

interface Props {
  title: string;
  date: string;
  excerpt?: string;
  slug: string;
  timeToRead: string;
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
  const { title, date, excerpt, slug, timeToRead } = props;

  const dateString = new Date(date).toLocaleDateString(
    undefined,
    dateStringOptions
  );

  if (!slug) throw new Error("No slug provided for " + title);

  return (
    <div className="flex flex-col py-2 lg:py-4">
      <h2 className="pb-2 text-lg lg:text-3xl">
        <Link href={addSlashPrefix(slug)}>
          <a className="hover:bg-blue-400 hover:text-white p-2 rounded">
            {title}
          </a>
        </Link>
      </h2>
      <div className="px-2 text-sm font-light">
        {isInvalidDate(dateString) ? date : dateString} &mdash; {timeToRead}
      </div>
      <div className="pt-2">{excerpt}</div>
    </div>
  );
}
