import React from "react";
import { Navigation } from "../Navigation";
import Footer from "../Footer";
import styles from "./layout.module.css";

export const SideProjectLayout = (props: {
  children: React.ReactNode;
}): React.ReactElement => {
  const { children } = props;

  return (
    <div
      className={`flex flex-col background ${styles.backgroundPattern} items-center`}
    >
      <a href="#main-content" className="sr-only">
        Skip to main content
      </a>
      <Navigation />
      <div className="flex justify-center pt- md:p-4 rounded mb-6  w-full">
        {children}
      </div>
      <Footer />
    </div>
  );
};
