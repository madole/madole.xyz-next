import React from "react";
import { Navigation } from "../Navigation";
import Footer from "../Footer";
import styles from "./layout.module.css";

export const Layout = (props: { children: React.ReactNode }): JSX.Element => {
  const { children } = props;

  return (
    <div className={`flex flex-col background ${styles.backgroundPattern}`}>
      <a href="#main-content" className="sr-only">
        Skip to main content
      </a>
      <Navigation />
      <div className="flex justify-center flex-grow pt-2 md:p-4">
        {children}
      </div>
      <Footer />
    </div>
  );
};
