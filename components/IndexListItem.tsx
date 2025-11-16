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
    <div className="flex flex-col">
      <Link
        href={addSlashPrefix(slug)}
        className="hover:text-white hover:bg-blue-400 prose pb-2 text-lg lg:text-3xl md:font-light prose-a:no-underline md:p-1 rounded"
      >
        {title}
      </Link>
      <div className="md:px-2 text-sm font-light">
        {postDate} &mdash; {timeToRead}
      </div>
      <div className="pt-2">{excerpt}</div>
      <Tags tags={tags} />
    </div>
  );
}
