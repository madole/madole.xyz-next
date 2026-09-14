import Link from "next/link";
import { useLocalDate } from "../hooks/useLocalDate";
import { Tags } from "./Tags";

interface Props {
  title: string;
  date: string;
  excerpt?: string;
  slug: string;
  timeToRead?: string;
  tags?: string[];
  sourceUrl?: string;
}

function addSlashPrefix(slug: string) {
  if (slug.startsWith("/")) {
    return slug;
  }
  return `/${slug}`;
}

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function IndexListItem(props: Props): React.ReactElement {
  const { title, date, excerpt, slug, timeToRead, tags, sourceUrl } = props;
  const postDate = useLocalDate(date);
  const source = sourceUrl ? hostname(sourceUrl) : null;

  if (!slug) throw new Error("No slug provided for " + title);

  return (
    /*
      Metadata sits in its own column on desktop so the titles share one left
      edge and scan as a list. Below lg it stacks above the title.
    */
    <div className="grid grid-cols-1 gap-1 border-t border-neutral-200 py-7 last:border-b lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-8">
      <div className="flex flex-row flex-wrap items-center gap-x-3 text-sm text-neutral-500 lg:flex-col lg:items-start lg:gap-x-0 lg:pt-1">
        <span>{postDate}</span>
        {timeToRead ? <span>{timeToRead}</span> : null}
        {source ? (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-neutral-900"
          >
            {source}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-col gap-1.5">
        <Link
          href={addSlashPrefix(slug)}
          className="text-xl font-medium tracking-tight text-neutral-900 decoration-neutral-300 underline-offset-4 hover:underline"
        >
          {title}
        </Link>
        {excerpt ? (
          <div className="text-[15px] leading-relaxed text-neutral-600">{excerpt}</div>
        ) : null}
        <Tags tags={tags} />
      </div>
    </div>
  );
}
