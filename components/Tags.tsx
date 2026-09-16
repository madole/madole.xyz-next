import Link from "next/link";
import * as React from "react";
import { tagItems } from "../utils/tags";

export const Tags = (props: { tags?: string[] }) => {
  const tags = tagItems(props.tags);
  if (!tags.length) return null;
  return (
    <ul className="flex gap-2 flex-wrap justify-start">
      {tags.map(({ name, slug }) => (
        <li key={slug}>
          <Link
            href={`/tag/${slug}`}
            className="text-xs font-light text-neutral-500 underline-offset-4 hover:text-neutral-900 hover:underline"
          >
            #{name}
          </Link>
        </li>
      ))}
    </ul>
  );
};
