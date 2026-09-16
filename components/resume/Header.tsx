import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Github,
  Home,
  Linkedin,
  MailIcon,
  MoreHorizontal,
  Printer,
  Search,
  Star,
  User,
  X,
} from "lucide-react";
import Dialog from "./Dialog";

interface Props {
  /** Current board filter text. */
  query: string;
  onQueryChange: (value: string) => void;
}

const SOCIAL_LINKS = [
  { href: "https://github.com/madole", label: "GitHub", Icon: Github },
  {
    href: "https://www.linkedin.com/in/andrew-mcdowell-0092649b/",
    label: "LinkedIn",
    Icon: Linkedin,
  },
];

const Header = (props: Props): React.ReactElement => {
  const { query, onQueryChange } = props;
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  const iconButton =
    "text-white/90 hover:bg-white/20 hover:text-white rounded p-2 transition-colors";

  return (
    <div className="resume-header mb-2 flex items-center justify-between gap-3 border-b border-white/10 bg-[#1d2125] px-3 py-2.5">
      {/* Board identity, matching Trello's board-name-then-star grouping. */}
      <div className="flex min-w-0 items-center gap-1">
        <Link
          href="/"
          className="flex items-center gap-2 rounded px-2 py-1 text-white hover:bg-white/20"
        >
          <span className="truncate font-semibold">Andrew McDowell</span>
          <span className="hidden text-white/60 sm:inline">Resume</span>
          <ChevronDown className="h-4 w-4 text-white/60" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          aria-label="Get in touch"
          title="Get in touch"
          className={`${iconButton} hidden sm:block`}
        >
          <Star className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Filters the board by card text. */}
        <div className="relative hidden md:block">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search board"
            aria-label="Search the resume board"
            className="w-44 rounded border border-white/25 bg-white/10 py-1.5 pl-8 pr-8 text-sm text-white placeholder:text-white/60 focus:w-60 focus:border-white/60 focus:bg-white/15 focus:outline-none lg:w-56 lg:focus:w-72"
          />
          {query ? (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              aria-label="Clear search"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-white/70 hover:bg-white/20 hover:text-white"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <Link
          href="/"
          aria-label="Back to madole.xyz"
          title="Home"
          className={iconButton}
        >
          <Home className="h-5 w-5" aria-hidden="true" />
        </Link>

        <button
          type="button"
          onClick={() => window.print()}
          aria-label="Print this resume"
          title="Print"
          className={`${iconButton} hidden sm:block`}
        >
          <Printer className="h-5 w-5" aria-hidden="true" />
        </button>

        <a
          href="mailto:madoliole+resume@gmail.com"
          className="flex items-center gap-2 rounded bg-white px-3 py-1.5 text-sm font-medium text-[#1d2125] transition-colors hover:bg-white/85"
        >
          <MailIcon className="h-4 w-4" aria-hidden="true" />
          <span>Mail</span>
        </a>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="More links"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className={iconButton}
          >
            <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
          </button>

          {menuOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-1 w-52 animate-fadeIn rounded-lg border border-black/10 bg-white py-1 shadow-xl"
            >
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  role="menuitem"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                >
                  <Icon
                    className="h-4 w-4 text-neutral-500"
                    aria-hidden="true"
                  />
                  {label}
                </a>
              ))}
              <a
                role="menuitem"
                href="mailto:madoliole+resume@gmail.com"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
              >
                <MailIcon
                  className="h-4 w-4 text-neutral-500"
                  aria-hidden="true"
                />
                Email me
              </a>
              <div className="my-1 h-px bg-neutral-200" />
              <button
                role="menuitem"
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  window.print();
                }}
                className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100"
              >
                <Printer
                  className="h-4 w-4 text-neutral-500"
                  aria-hidden="true"
                />
                Print / save as PDF
              </button>
            </div>
          ) : null}
        </div>

        <span
          className="hidden h-8 w-8 items-center justify-center rounded-full bg-white/25 sm:flex"
          aria-hidden="true"
        >
          <User className="h-4 w-4 text-white" />
        </span>
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
};

export default Header;
