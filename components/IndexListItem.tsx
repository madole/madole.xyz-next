import Link from "next/link";
import { useLocalDate } from "../hooks/useLocalDate";
import { Tags } from "./Tags";

interface Props {
  title: string;
  date: string;
  excerpt?: string;
  slug: string;
  timeToRead: string;
  tags?: string[];
}

function addSlashPrefix(slug: string) {
  if (slug.startsWith("/")) {
    return slug;
  }
  return `/${slug}`;
}

export function IndexListItem(props: Props): React.ReactElement {
  const { title, date, excerpt, slug, timeToRead, tags } = props;
  const postDate = useLocalDate(date);

  if (!slug) throw new Error("No slug provided for " + title);

  return (
    <div className="flex flex-col gap-1 border-b border-neutral-200 py-6 first:pt-0 last:border-0">
      <Link
        href={addSlashPrefix(slug)}
        className="text-xl font-medium tracking-tight text-neutral-900 decoration-neutral-300 decoration-1 underline-offset-4 hover:underline"
      >
        {title}
      </Link>
      <div className="text-sm font-light text-neutral-500">
        {postDate} &mdash; {timeToRead}
      </div>
      {excerpt ? <div className="pt-1 text-sm text-neutral-600">{excerpt}</div> : null}
      <Tags tags={tags} />
    </div>
  );
}
