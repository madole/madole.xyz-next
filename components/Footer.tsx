import Link from "next/link";

const RssFeed = () => (
  <Link href={"/rss.xml"}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="w-8 text-white"
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

function Footer(): JSX.Element {
  const thisYear = new Date().getFullYear();
  return (
    <div className="mb-3 font-thin text-white flex flex-col items-center">
      &copy; {thisYear} by Madole.
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
