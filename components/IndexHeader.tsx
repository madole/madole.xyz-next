import * as React from "react";

/*
 * Shared header for the index pages (blog, TIL, tag), so their titles and
 * counts stay on one type scale. `action` carries the RSS link where there
 * is one.
 */
export const IndexHeader = (props: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}): React.ReactElement => (
  <header className="mb-4 flex items-end justify-between gap-4">
    <div className="flex flex-col gap-2">
      <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        {props.title}
      </h1>
      {props.subtitle ? (
        <p className="text-base text-neutral-500 dark:text-neutral-400">
          {props.subtitle}
        </p>
      ) : null}
    </div>
    {props.action}
  </header>
);
