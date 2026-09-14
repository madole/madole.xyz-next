import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MobileMenu, MobileMenuLink } from "./MobileMenu";

const NAV_LINKS: MobileMenuLink[] = [
  { href: "/blog-index", label: "Blog", match: "/blog" },
  { href: "/today-i-learned", label: "Today I learned", match: "/today-i-learned" },
  { href: "/side-projects", label: "Side Projects", match: "/side-projects" },
  { href: "/resume", label: "Resume", match: "/resume" },
];

/*
 * Two visual treatments, because the nav sits on two very different grounds.
 * "dark" is the original: white links over the purple gradient or the
 * homepage's space backdrop. "light" is dark-on-white for the reading pages,
 * where the gradient is reduced to a hairline.
 *
 * Both share MobileMenu below md, so the hamburger behaves identically
 * everywhere and only its palette changes.
 */
export const Navigation = (props?: { variant?: "dark" | "light" }) => {
  const router = useRouter();
  const pathname = router?.pathname ?? "";
  const isHomepage = pathname === "/";
  const variant = props?.variant ?? "dark";

  if (variant === "light") {
    return (
      <header className="relative w-full">
        <div className="h-1 w-full bg-gradient-to-r from-[#8900fe] to-[#12b3dd]" />
        {/*
          Full width with the links hard against the right edge, matching the
          nav on the homepage and side projects rather than pulling in to the
          reading column.
        */}
        <div className="nav-bar-row flex w-full items-center justify-end px-4 py-4 md:px-6">
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900">
              Home
            </Link>
            {NAV_LINKS.map((link) => {
              const isActive = pathname.includes(link.match);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    isActive
                      ? "border-b-2 border-neutral-900 pb-0.5 text-sm font-medium text-neutral-900"
                      : "text-sm text-neutral-500 hover:text-neutral-900"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <MobileMenu links={NAV_LINKS} pathname={pathname} />
        </div>
      </header>
    );
  }

  return (
    <>
      {/*
        `w-full` matters: the layouts that render this centre their children
        with `items-center`, which would otherwise shrink the row to the width
        of the button and centre it rather than leaving it right-aligned.
      */}
      <div
        className={`nav-bar-row relative flex w-full justify-end px-4 py-4 md:hidden ${isHomepage ? "hidden" : ""}`}
      >
        {/* White bars, because this nav sits on the gradient or the space scene. */}
        <MobileMenu
          links={NAV_LINKS}
          pathname={pathname}
          barTone="light"
          includeHome={!isHomepage}
        />
      </div>

      <nav
        className={`${
          isHomepage ? "flex" : "hidden md:flex"
        } w-screen justify-center px-1 py-4 md:justify-end md:px-6`}
      >
        {!isHomepage && (
          <div className="rounded px-2 py-1">
            <Link href="/" className="text-white hover:underline">
              Home
            </Link>
          </div>
        )}
        {NAV_LINKS.map((link) => (
          <div
            key={link.href}
            className={`rounded px-2 py-1 ${
              pathname.includes(link.match) ? "bg-blue-600 shadow-lg" : ""
            }`}
          >
            <Link href={link.href} className="whitespace-nowrap text-white hover:underline">
              {link.label}
            </Link>
          </div>
        ))}
      </nav>
    </>
  );
};
