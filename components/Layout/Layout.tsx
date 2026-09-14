import React from "react";
import Footer from "../Footer";
import { Navigation } from "../Navigation";
import styles from "./layout.module.css";

/*
 * `reading` is the layout for blog posts, TILs and their indexes: a white page
 * with the site gradient reduced to a hairline and the wordmark, and an
 * optional left rail carrying the metadata so nothing interrupts the column.
 *
 * Pass `rail` for post pages. Index pages leave it out and get a single
 * column at the same max width, so the left edge does not move when you
 * navigate from an index into a post.
 */
export const Layout = (props: {
  children: React.ReactNode;
  isIndexPage?: boolean;
  reading?: boolean;
  rail?: React.ReactNode;
  railFooter?: React.ReactNode;
}): React.ReactElement => {
  const { children, reading, rail, railFooter } = props;

  if (reading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#fdfdfd] text-neutral-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black"
        >
          Skip to main content
        </a>
        <Navigation variant="light" />
        {/*
          Tighter top padding on mobile: the nav collapses to a hamburger
          floated right, so a large gap below it reads as an empty corner
          rather than as separation from a row of links.
        */}
        <main className="mx-auto w-full max-w-[1060px] flex-1 px-6 pb-14 pt-6 md:px-14 md:py-14">
          {rail ? (
            /*
              One row, two columns. The rail column is a flex stack holding
              the facts and - on desktop - the tags; the article is the
              second column.

              railFooter comes after the article in source order, which is
              what mobile and screen readers follow, and `order` lifts it
              into the rail stack from lg up. The rail column stays as tall
              as its own content because the article sits in its own cell.
            */
            <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[190px_minmax(0,1fr)] lg:items-start lg:gap-x-12">
              {/*
                `contents` below lg so the aside and the tags are direct
                children of the outer flex column and `order-last` can move
                the tags after the article. From lg this becomes a real flex
                column occupying grid column 1, which keeps the rail only as
                tall as its own content.
              */}
              <div className="contents lg:flex lg:flex-col lg:gap-7">
                <aside className="flex flex-row flex-wrap items-baseline gap-x-3 gap-y-1 lg:flex-col lg:items-start lg:gap-7">
                  {rail}
                </aside>
                {railFooter ? (
                  <div className="order-last lg:order-none">{railFooter}</div>
                ) : null}
              </div>
              <section id="main-content" className="min-w-0">
                {children}
              </section>
            </div>
          ) : (
            <section id="main-content">{children}</section>
          )}
        </main>
        <Footer reading />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col ${styles.backgroundPattern} items-center`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to main content
      </a>
      <Navigation />
      <main
        className={`
          grid grid-cols-mobile lg:grid-cols-layout gap-4
          [&>section]max-w-[min(80ch,100%)]
          [&>section]:lg:col-start-2
          [&>section]:lg:col-end-2
          [&>section]:flex
          [&>section]:flex-col
          [&>section]:justify-center
          [&>section]:gap-6
          [&>section]:bg-white
          [&>section]:lg:rounded-lg
          [&>section]:p-8
          [&>section]:mt-6
          ${props.isIndexPage ? "[&>section]:items-start" : "[&>section]:items-center"}
          `}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};
