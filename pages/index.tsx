import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useState } from "react";
import { Navigation } from "../components/Navigation";
import useInterval from "../hooks/useInterval";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { motion } from "motion/react";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";

const CombinedThreeScene = dynamic(
  () => import("../components/CombinedThreeScene"),
  {
    ssr: false,
  }
);

export interface IndexProps {}

const TITLE_SWITCH_INTERVAL = 5000;

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
  const [title, setTitle] = useState(titles[0]);

  useInterval(() => {
    const index = titles.findIndex((value) => value === title);
    if (index < titles.length - 1) {
      setTitle(titles[index + 1]);
    } else {
      setTitle(titles[0]);
    }
  }, TITLE_SWITCH_INTERVAL);
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
      <div className="fixed inset-0 background">
        <CombinedThreeScene />
        <StarsBackground />
        <ShootingStars
          starWidth={20}
          maxSpeed={3}
          minSpeed={1}
          minDelay={10_000}
          maxDelay={30_000}
        />

        <div className="absolute inset-0 flex flex-col justify-between z-1 pointer-events-none">
          <a href="#main-content" className="sr-only">
            Skip to main content
          </a>

          <div className="pointer-events-auto">
            <Navigation />
          </div>

          <main
            id="main-content"
            className="flex flex-col pt-6 md:pt-0 md:justify-center flex-grow px-8 md:px-20 lg:px-32"
          >
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 text-center md:text-left"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
            >
              Andrew McDowell <br />
              <span className="block mt-2 text-3xl sm:text-4xl md:text-5xl">
                Technical Leader, Geospatial Expert & Tech Writer
              </span>
            </h1>
            <motion.div className="flex flex-col items-center justify-start text-center sm:mx-0 sm:mb-0 sm:flex-row">
              <LayoutTextFlip text="" words={titles} />
            </motion.div>
            <div className="mt-4 text-2xl md:text-3xl font-light text-white w-full md:w-2/3 flex-grow flex flex-col-reverse md:flex-grow-0 pb-8 text-center md:text-left">
              <div className="">
                Leading teams to build innovative geospatial solutions that make
                a difference.
              </div>
            </div>
          </main>

          <div className="flex justify-around pb-4 pointer-events-auto">
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
      </div>
    </>
  );
};

export default Index;
