import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export const Navigation = (props?: { minimal?: boolean }) => {
  const router = useRouter();
  const pathname = router?.pathname ?? "";
  const [menuOpen, setMenuOpen] = useState(false);
  const isHomepage = pathname === "/";
  const { minimal } = props ?? {};

  if (minimal) {
    const link = "text-sm text-neutral-500 hover:text-neutral-900 hover:underline underline-offset-4";
    const active = "text-neutral-900 underline underline-offset-4";
    return (
      <nav className="flex w-full max-w-2xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-sm font-semibold tracking-tight text-neutral-900">
          madole.xyz
        </Link>
        <div className="flex items-center gap-5">
          <Link href="/blog-index" className={pathname.includes("/blog") ? active : link}>
            Blog
          </Link>
          <Link
            href="/today-i-learned"
            className={pathname.includes("/today-i-learned") ? active : link}
          >
            TIL
          </Link>
          <Link
            href="/side-projects"
            className={pathname.includes("/side-projects") ? active : link}
          >
            Projects
          </Link>
          <Link href="/resume" className={pathname.includes("/resume") ? active : link}>
            Resume
          </Link>
        </div>
      </nav>
    );
  }

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
                <Link href="/" className="text-white hover:underline">
                  Home
                </Link>
              </div>
            )}
            <div
              className={`px-2 py-1 rounded ${
                pathname.includes("/blog") ? "bg-blue-600 shadow-lg" : ""
              }`}
            >
              <Link href="/blog-index" className="text-white hover:underline">
                Blog
              </Link>
            </div>
            <div
              className={`px-2 py-1 rounded hover:underline ${
                pathname.includes("/today-i-learned")
                  ? "bg-blue-600 shadow-lg"
                  : ""
              }`}
            >
              <Link href="/today-i-learned" className="text-white ">
                Today I learned
              </Link>
            </div>
            <div
              className={`px-2 py-1 rounded ${
                pathname.includes("/side-projects")
                  ? "bg-blue-600 shadow-lg"
                  : ""
              }`}
            >
              <Link
                href="/side-projects"
                className="text-white hover:underline"
              >
                Side Projects
              </Link>
            </div>
            <div className="px-2 py-1 rounded">
              <Link href="/resume" className="text-white hover:underline">
                Resume
              </Link>
            </div>
          </nav>
        )}
      </div>
      <nav
        className={`${
          isHomepage ? "flex" : "hidden md:flex"
        } justify-center md:justify-end w-screen px-1 md:px-6 py-4`}
      >
        {!isHomepage && (
          <div className="px-2 py-1 rounded">
            <Link href="/" className="text-white hover:underline">
              Home
            </Link>
          </div>
        )}
        <div
          className={`px-2 py-1 rounded ${
            pathname.includes("/blog") ? "bg-blue-600 shadow-lg" : ""
          }`}
        >
          <Link href="/blog-index" className="text-white hover:underline">
            Blog
          </Link>
        </div>
        <div
          className={`px-2 py-1 rounded ${
            pathname.includes("/today-i-learned") ? "bg-blue-600 shadow-lg" : ""
          }`}
        >
          <Link
            href="/today-i-learned"
            className="text-white whitespace-nowrap"
          >
            Today I learned
          </Link>
        </div>
        <div
          className={`px-2 py-1 rounded ${
            pathname.includes("/side-projects") ? "bg-blue-600 shadow-lg" : ""
          }`}
        >
          <Link href="/side-projects" className="text-white whitespace-nowrap">
            Side Projects
          </Link>
        </div>
        <div className="px-2 py-1 rounded">
          <Link href="/resume" className="text-white hover:underline">
            Resume
          </Link>
        </div>
      </nav>
    </>
  );
};
