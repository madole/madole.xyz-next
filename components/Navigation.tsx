import * as React from "react";
import Link from "next/link";
import { withRouter } from "next/router";
import { useState } from "react";

export const Navigation = withRouter(({ router }) => {
  const { pathname } = router;
  const [menuOpen, setMenuOpen] = useState(false);
  const isHomepage = pathname === "/";

  return (
    <>
      <div className={`py-6 md:hidden ${isHomepage ? "hidden" : ""}`}>
        {/* Mobile menu */}
        <button
          aria-label="Open navigation menu"
          onClick={() => {
            setMenuOpen(!menuOpen);
          }}
          className="p-4 space-y-2 hover:bg-sky-600 rounded absolute top-2 right-2"
        >
          <span className="block w-8 h-0.5 bg-white" />
          <span className="block w-8 h-0.5 bg-white" />
          <span className="block w-8 h-0.5 bg-white" />
        </button>
        {!menuOpen ? null : (
          <nav className="flex flex-col w-screen px-6 py-4 text-lg">
            {!isHomepage && (
              <div className="px-2 py-1 rounded">
                <Link href="/">
                  <a className="text-white">Home</a>
                </Link>
              </div>
            )}
            <div
              className={`px-2 py-1 rounded ${
                pathname.includes("/blog") ? "bg-blue-600 shadow-lg" : ""
              }`}
            >
              <Link href="/blog-index">
                <a className="text-white">Blog</a>
              </Link>
            </div>
            <div
              className={`px-2 py-1 rounded ${
                pathname.includes("/today-i-learned")
                  ? "bg-blue-600 shadow-lg"
                  : ""
              }`}
            >
              <Link href="/today-i-learned">
                <a className="text-white">Today I learned</a>
              </Link>
            </div>
            <div
              className={`px-2 py-1 rounded ${
                pathname.includes("/side-projects")
                  ? "bg-blue-600 shadow-lg"
                  : ""
              }`}
            >
              <Link href="/side-projects">
                <a className="text-white">Side Projects</a>
              </Link>
            </div>
            <div className="px-2 py-1 rounded">
              <Link href="/resume">
                <a className="text-white">Resume</a>
              </Link>
            </div>
          </nav>
        )}
      </div>
      <nav
        className={`${
          isHomepage ? "flex" : "hidden"
        } flex justify-center md:justify-end w-screen px-1 md:px-6 py-4`}
      >
        {!isHomepage && (
          <div className="px-2 py-1 rounded">
            <Link href="/">
              <a className="text-white">Home</a>
            </Link>
          </div>
        )}
        <div
          className={`px-2 py-1 rounded ${
            pathname.includes("/blog") ? "bg-blue-600 shadow-lg" : ""
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
            <a className="text-white whitespace-nowrap">Today I learned</a>
          </Link>
        </div>
        <div
          className={`px-2 py-1 rounded ${
            pathname.includes("/side-projects") ? "bg-blue-600 shadow-lg" : ""
          }`}
        >
          <Link href="/side-projects">
            <a className="text-white whitespace-nowrap">Side Projects</a>
          </Link>
        </div>
        <div className="px-2 py-1 rounded">
          <Link href="/resume">
            <a className="text-white">Resume</a>
          </Link>
        </div>
      </nav>
    </>
  );
});
