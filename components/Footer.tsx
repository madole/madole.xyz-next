import Link from "next/link";

const RssFeed = (props?: { minimal?: boolean }) => (
  <Link href={"/rss.xml"}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={props?.minimal ? "w-5 text-neutral-400 hover:text-neutral-900" : "w-8 text-white"}
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

function Footer(props?: { minimal?: boolean }): React.ReactElement {
  if (props?.minimal) {
    return (
      <div className="flex w-full max-w-2xl items-center justify-between px-6 py-8 text-sm font-light text-neutral-400">
        <span>&copy; {2021} Madole.</span>
        <RssFeed minimal />
      </div>
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
