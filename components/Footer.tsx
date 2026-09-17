import Link from "next/link";

const RssFeed = (props?: { reading?: boolean }) => (
  <Link href={"/rss.xml"} aria-label="RSS feed">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={
        props?.reading
          ? "w-5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          : "w-8 text-white"
      }
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z"
      />
    </svg>
  </Link>
);

function Footer(props?: { reading?: boolean }): React.ReactElement {
  if (props?.reading) {
    return (
      <footer className="border-t border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto flex w-full max-w-[1060px] items-center justify-between px-6 py-7 text-sm text-neutral-500 dark:text-neutral-400 md:px-14">
          <span>&copy; {2021} by Madole.</span>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/madole"
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              GitHub
            </a>
            <RssFeed reading />
          </div>
        </div>
      </footer>
    );
  }
  return (
    <div className="mb-3 font-thin text-white flex flex-col items-center">
      &copy; {2021} by Madole.
      <br />
      <a href="https://github.com/madole" target="_blank" rel="noreferrer">
        GitHub Repository
      </a>
      <div>Last build: {process.env.CONFIG_BUILD_ID}</div>
      <RssFeed />
    </div>
  );
}

export default Footer;
