import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MobileMenu, MobileMenuLink } from "./MobileMenu";

const NAV_LINKS: MobileMenuLink[] = [
  { href: "/blog-index", label: "Blog", match: "/blog" },
  {
    href: "/today-i-learned",
    label: "Today I learned",
    match: "/today-i-learned",
  },
  { href: "/side-projects", label: "Side Projects", match: "/side-projects" },
  { href: "/resume", label: "Resume", match: "/resume" },
];

/*
 * One nav everywhere, so the layout, type scale and spacing are identical on
 * every page. Only the palette changes, because the nav sits on two very
 * different grounds: "dark" is white links over the purple gradient or the
 * homepage's space backdrop, and "light" is dark-on-white for the reading
 * pages, where the gradient is reduced to a hairline and a theme toggle is
 * offered. Both share MobileMenu below md.
 */
export const Navigation = (props?: { variant?: "dark" | "light" }) => {
  const router = useRouter();
  const pathname = router?.pathname ?? "";
  const isLight = (props?.variant ?? "dark") === "light";

  const idleLink = isLight
    ? "text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
    : "text-sm text-white/75 hover:text-white";
  const activeLink = isLight
    ? "border-b-2 border-neutral-900 pb-0.5 text-sm font-medium text-neutral-900 dark:border-neutral-100 dark:text-neutral-100"
    : "border-b-2 border-white pb-0.5 text-sm font-medium text-white";

  const linkClass = (isActive: boolean) => (isActive ? activeLink : idleLink);

  return (
    <header className="relative w-full">
      {/*
        Absolute so the hairline does not take up layout height. Otherwise the
        reading pages would carry an extra 4px above the nav and push the links
        below where they sit on the pages that have no hairline.
      */}
      {isLight ? (
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#8900fe] to-[#12b3dd]" />
      ) : null}
      {/*
        Full width with the links hard against the right edge. `w-full` also
        matters for the layouts that centre their children with `items-center`,
        which would otherwise shrink the row to the width of its contents.
      */}
      <div className="nav-bar-row flex w-full items-center justify-end px-4 py-4 md:px-6">
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className={linkClass(pathname === "/")}
          >
            Home
          </Link>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname.includes(link.match) ? "page" : undefined}
              className={linkClass(pathname.includes(link.match))}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <MobileMenu
          links={NAV_LINKS}
          pathname={pathname}
          barTone={isLight ? "dark" : "light"}
        />
      </div>
    </header>
  );
};
