import Link from "next/link";
import * as React from "react";
import { tagItems } from "../utils/tags";

/*
 * A labelled fact in the post rail.
 *
 * On desktop these stack down the left margin, each with its label above the
 * value. Below lg the rail becomes a single meta line under the back link, so
 * the labels are hidden and the values read inline, separated by a dot -
 * stacking four label/value pairs into a wrapping row gave ragged baselines
 * and wrapped at arbitrary points.
 */
export const RailBlock = (props: {
  label: string;
  children: React.ReactNode;
}): React.ReactElement => (
  <div
    data-rail-fact
    /*
      The dot separates one fact from the next, so it is drawn only when a
      fact follows another fact - the back link above is not one, and the
      first fact must not lead with one.
    */
    className="
      flex flex-row items-baseline gap-1 text-sm text-neutral-600
      dark:text-neutral-300
      max-lg:[[data-rail-fact]+&]:before:mr-1
      max-lg:[[data-rail-fact]+&]:before:text-neutral-300
      max-lg:[[data-rail-fact]+&]:before:content-['·']
      lg:flex-col lg:gap-1
    "
  >
    <span className="hidden text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500 dark:text-neutral-400 lg:block">
      {props.label}
    </span>
    <span className="lg:text-neutral-600 dark:lg:text-neutral-300">{props.children}</span>
  </div>
);

export const RailBackLink = (props: {
  href: string;
  children: React.ReactNode;
}): React.ReactElement => (
  <Link
    href={props.href}
    /* Takes a row of its own below lg so the meta line starts clean beneath it. */
    className="mb-3 inline-flex basis-full items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 lg:mb-0 lg:basis-auto"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-3.5 w-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 12H5m0 0l7 7m-7-7l7-7"
      />
    </svg>
    {props.children}
  </Link>
);

export const RailTags = (props: {
  tags?: string[];
}): React.ReactElement | null => {
  const tags = tagItems(props.tags);
  if (!tags.length) return null;
  return (
    /*
      Below lg this sits after the article, so it gets a rule to separate it
      from the copy above. On desktop it is placed back into the rail column
      and the rule would cut across the margin, so it is dropped there.
    */
    <div className="flex flex-col gap-2 border-t border-neutral-200 pt-6 dark:border-neutral-800 lg:gap-1 lg:border-0 lg:pt-0">
      <span className="hidden text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500 dark:text-neutral-400 lg:block">
        Tags
      </span>
      <ul className="flex flex-row flex-wrap gap-x-3 gap-y-1 lg:flex-col lg:gap-1.5">
        {tags.map(({ name, slug }) => (
          <li key={slug}>
            <Link
              href={`/tag/${slug}`}
              className="text-sm text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline dark:text-neutral-300 dark:hover:text-neutral-100"
            >
              #{name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
