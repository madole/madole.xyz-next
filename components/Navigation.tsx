import * as React from "react";
import Link from "next/link";
import { withRouter } from "next/router";

export const Navigation = withRouter(({ router }) => {
  const { pathname } = router;
  if (pathname !== "/") {
    return (
      <nav className="flex justify-end w-screen px-6 py-4">
        <div className="px-2 py-1 rounded">
          <Link href="/">
            <a className="text-white">Home</a>
          </Link>
        </div>
        <div className="px-2 py-1 rounded">
          <Link href="/resume">
            <a className="text-white">Resume</a>
          </Link>
        </div>
        <div
          className={`px-2 py-1 rounded ${
            pathname.includes("/blog-index") ? "bg-blue-600 shadow-lg" : ""
          }`}
        >
          <Link href="/blog-index">
            <a className="text-white">Blog</a>
          </Link>
        </div>
        <div
          className={`px-2 py-1 rounded ${
            pathname.includes("/today-i-learned") ? "bg-blue-600 shadow-lg" : ""
          }`}
        >
          <Link href="/today-i-learned">
            <a className="text-white">Today I learned</a>
          </Link>
        </div>
        <div
          className={`px-2 py-1 rounded ${
            pathname.includes("/side-projects") ? "bg-blue-600 shadow-lg" : ""
          }`}
        >
          <Link href="/side-projects">
            <a className="text-white">Side Projects</a>
          </Link>
        </div>
      </nav>
    );
  }
  return null;
});
