import Link from "next/link";
import * as React from "react";
import { useEffect, useRef, useState } from "react";

export interface MobileMenuLink {
  href: string;
  label: string;
  /** Pathname fragment that marks this link as the current section. */
  match: string;
}

/*
 * The mobile navigation: a hamburger that opens a dropdown panel.
 *
 * Both nav treatments share this. The panel is always the light surface -
 * it reads well over either ground - so the only thing that varies is the
 * colour of the hamburger bars, which sit directly on the page behind them.
 *
 * The panel stays mounted and is hidden with `display: none` so it can
 * animate in both directions; see .nav-menu in globals.css for how that
 * works.
 */
export const MobileMenu = (props: {
  links: MobileMenuLink[];
  pathname: string;
  /** Colour of the hamburger bars, which sit on the page, not on the panel. */
  barTone?: "light" | "dark";
  /** Rendered above the section links; omitted on the homepage. */
  includeHome?: boolean;
  className?: string;
}): React.ReactElement => {
  const {
    links,
    pathname,
    barTone = "dark",
    includeHome = true,
    className = "",
  } = props;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  /*
   * The open panel overlays the page, so it needs the usual ways out:
   * Escape, and a click anywhere outside it. Listeners are only attached
   * while it is open.
   */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  /*
    The bars inherit this via currentColor, so opening the menu transitions
    them to black as the row behind turns white - see .nav-toggle in
    globals.css.
  */
  const closedBarColor =
    barTone === "light"
      ? "text-white"
      : "text-neutral-900 dark:text-neutral-100";
  const linkClass =
    "py-2 text-base text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100";
  const activeLinkClass =
    "py-2 text-base font-medium text-neutral-900 dark:text-neutral-100";

  return (
    /*
      Deliberately not `relative`: the panel spans the full width beneath the
      header, so it must resolve its `inset-x-0` against the header rather
      than against this wrapper. rootRef is only used for click-outside
      containment, which is DOM ancestry and unaffected by positioning.
    */
    <div ref={rootRef} className={`md:hidden ${className}`}>
      <button
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        data-open={open}
        onClick={() => setOpen(!open)}
        className={`nav-toggle flex flex-col gap-1.5 rounded p-2 ${closedBarColor}`}
      >
        <span className="nav-bar block h-0.5 w-6" />
        <span className="nav-bar block h-0.5 w-6" />
        <span className="nav-bar block h-0.5 w-6" />
      </button>

      {/*
        `inert` keeps the closed panel out of the tab order and the
        accessibility tree without waiting for the display transition.
      */}
      <nav
        id="mobile-menu"
        data-open={open}
        inert={!open}
        /*
          Full width beneath the header rather than anchored to the button.
          `inset-x-0` resolves against the nearest positioned ancestor, so
          the wrapper this renders into must span the full width - both nav
          variants give it one.
        */
        className="nav-menu absolute inset-x-0 top-full z-40 flex-col gap-1 border-b border-neutral-200 bg-[#fdfdfd] px-6 pb-4 shadow-sm dark:border-neutral-800 dark:bg-[#0d1117]"
      >
        {includeHome ? (
          <Link href="/" onClick={() => setOpen(false)} className={linkClass}>
            Home
          </Link>
        ) : null}
        {links.map((link) => {
          const isActive = pathname.includes(link.match);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={isActive ? "page" : undefined}
              className={isActive ? activeLinkClass : linkClass}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
