import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";
import { Navigation } from "../components/Navigation";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { motion } from "motion/react";

const CombinedThreeScene = dynamic(
  () => import("../components/CombinedThreeScene"),
  {
    ssr: false,
  }
);

export interface IndexProps {}

const titles = [
  "Full Stack Software Engineer",
  "Systems Architect",
  "Team Leader",
  "Samba Drummer",
  "Whiskey Appreciator",
  "Digital Cartologist",
  "Agentic AI Wrangler",
];

const Index: React.FC = () => {
  return (
    <>
      <Head>
        <title>
          Madole.xyz | Geospatial Web Apps & Portfolio of Andrew McDowell
        </title>
        <meta
          name="description"
          content="Andrew McDowell's portfolio: geospatial web applications, software engineering, and leadership projects."
        />
        <meta
          property="og:title"
          content="Andrew McDowell | Geospatial Web Applications & Portfolio"
        />
        <meta
          property="og:description"
          content="Portfolio of geospatial web applications and projects by Andrew McDowell."
        />
        <meta property="og:image" content="https://madole.xyz/bitmoji.png" />
        <meta property="og:image:alt" content="A bitmoji of Andrew McDowell" />
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Andrew McDowell",
            "url": "https://madole.xyz",
            "image": "https://madole.xyz/bitmoji.png",
            "sameAs": [
              "https://github.com/madole",
              "https://x.com/madole",
              "https://www.linkedin.com/in/andrew-mcdowell-0092649b/"
            ],
            "jobTitle": "Full Stack Software Engineer, Tech Lead, Geospatial Expert, & Tech Writer",
            "worksFor": {
              "@type": "Organization",
              "name": "Madole.xyz"
            },
            "description": "Andrew McDowell's portfolio of geospatial web applications and projects."
          }`}
        </script>
      </Head>
      {/*
        globals.css paints html/body with the site-wide purple gradient. The
        homepage is the only page that wants deep space behind it, and a wrapper
        alone is not enough - overscroll would still rubber-band to purple.
      */}
      <style jsx global>{`
        html,
        body {
          background: #070c22;
        }
      `}</style>

      {/*
        Fixed behind the whole document, so it stays put as the page scrolls.

        Every stop is a deliberate navy rather than a near-black: the earlier
        #05060f base read as plain black on most screens, which lost the sense of
        looking at sky. It has to match the html/body colour above or overscroll
        shows a seam.
      */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,#16234d_0%,#0c1533_45%,#070c22_100%)]" />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to main content
      </a>

      {/*
        The hero establishes the containing block for the Earth's tracking div,
        which is absolute rather than fixed so the globe scrolls away with the
        hero instead of following the viewport down the page.
      */}
      <section className="relative flex min-h-dvh flex-col justify-between overflow-hidden">
        <CombinedThreeScene />

        {/*
          pointer-events-none so a drag anywhere over the hero reaches the
          globe's tracking div underneath rather than being swallowed by this
          overlay. Children opt back in individually - and note that
          pointer-events: none also blocks text selection, so anything meant to
          be selectable has to say pointer-events-auto.
        */}
        <div className="pointer-events-none relative z-20 flex flex-1 flex-col justify-between">
          <div className="pointer-events-auto">
            <Navigation />
          </div>

          <main
            id="main-content"
            className="flex flex-grow flex-col px-8 pt-6 md:justify-center md:px-20 md:pt-0 lg:px-32"
          >
            <h1
              className="pointer-events-auto mb-4 w-fit self-center text-center text-4xl font-bold text-white sm:text-5xl md:self-start md:text-left md:text-6xl"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
            >
              Andrew McDowell <br />
              <span className="mt-2 block text-3xl md:text-2xl lg:text-5xl">
                Technical Leader, Geospatial Expert &amp; Tech Writer
              </span>
            </h1>
            <motion.div className="flex flex-col items-center justify-start text-center sm:mx-0 sm:mb-0 sm:flex-row">
              <LayoutTextFlip words={titles} />
            </motion.div>
            <div className="mt-4 flex w-full flex-grow flex-col-reverse pb-8 text-center text-2xl font-light text-white md:w-2/3 md:flex-grow-0 md:text-left md:text-2xl lg:text-3xl">
              <div className="pointer-events-auto">
                Leading teams to build innovative geospatial solutions that make
                a difference.
              </div>
            </div>
          </main>

          <div className="pointer-events-auto flex justify-around pb-4">
            <a
              href="https://github.com/madole"
              target="_blank"
              rel="noreferrer"
              className="font-light text-white no-underline opacity-75 hover:opacity-100"
            >
              Github
            </a>
            <a
              href="https://bsky.app/profile/madole.bsky.social"
              target="_blank"
              className="font-light text-white no-underline opacity-75 hover:opacity-100"
              rel="noreferrer"
            >
              Bluesky
            </a>
            <a
              href="https://www.linkedin.com/in/andrew-mcdowell-0092649b/"
              target="_blank"
              className="font-light text-white no-underline opacity-75 hover:opacity-100"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Filled with recent writing in phase 08. */}
      <section
        id="recent"
        className="relative z-20 px-8 pb-24 pt-16 md:px-20 lg:px-32"
      />
    </>
  );
};

export default Index;
