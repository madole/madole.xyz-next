import Link from "next/link";
import * as React from "react";

export const Tags = (props: { tags?: string[] }) => {
  const { tags } = props;
  return (
    <ul className="flex gap-1 flex-wrap justify-start">
      {tags?.map((tag) => (
        <li
          key={tag}
          className="px-2 rounded uppercase hover:bg-blue-500 hover:text-white text-sm font-light bg-gray-200"
        >
          <Link href={`/tag/${tag.split(" ").join("-")}`}>
            <a>{tag}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
};
