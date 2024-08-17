import React from "react";
import Footer from "../Footer";
import { Navigation } from "../Navigation";
import styles from "./layout.module.css";

export const Layout = (props: {
  children: React.ReactNode;
  isIndexPage?: boolean;
}): JSX.Element => {
  const { children } = props;

  return (
    <div
      className={`flex flex-col background ${styles.backgroundPattern} items-center`}
    >
      <a href="#main-content" className="sr-only">
        Skip to main content
      </a>
      <Navigation />
      <div
        className={`
          flex justify-center p-8 md:p-4 w-full md:max-w-[100ch] md:rounded my-6 
          [&>section]:max-w-[min(80ch,100%)] 
          [&>section]:flex
          [&>section]:flex-col
          ${props.isIndexPage ? "[&>section]:items-start" : "[&>section]:items-center"}
          [&>section]:gap-4
          [&>section>h1]:py-4 bg-white lg:shadow-lg"}`}
      >
        {children}
      </div>
      <Footer />
    </div>
  );
};
