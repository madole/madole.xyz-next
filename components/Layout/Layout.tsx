import React from "react";
import Footer from "../Footer";
import { Navigation } from "../Navigation";
import styles from "./layout.module.css";

export const Layout = (props: {
  children: React.ReactNode;
  isIndexPage?: boolean;
  minimal?: boolean;
}): React.ReactElement => {
  const { children, minimal } = props;

  if (minimal) {
    return (
      <div className="flex min-h-screen flex-col items-center bg-white text-neutral-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black"
        >
          Skip to main content
        </a>
        <Navigation minimal />
        <main className="w-full max-w-2xl flex-1 px-6 py-12 md:py-16">
          <section id="main-content" className="flex flex-col">
            {children}
          </section>
        </main>
        <Footer minimal />
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
