import Link from "next/link";
import * as React from "react";

export const Tags = (props: { tags?: string[] }) => {
  const { tags } = props;
  return (
    <ul className="flex gap-2 flex-wrap justify-start">
      {tags?.map((tag) => (
        <li key={tag}>
          <Link
            href={`/tag/${tag.split(" ").join("-")}`}
            className="text-xs font-light text-neutral-500 underline-offset-4 hover:text-neutral-900 hover:underline"
          >
            #{tag}
          </Link>
        </li>
      ))}
    </ul>
  );
};
