import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useState } from "react";
import { Navigation } from "../components/Navigation";
import useInterval from "../hooks/useInterval";

const FullpageClouds = dynamic(() => import("../components/FullPageClouds"), {
  ssr: false,
});

const EarthCanvas = dynamic(() => import("../components/EarthCanvas"), {
  ssr: false,
});

export interface IndexProps {}

const TITLE_SWITCH_INTERVAL = 5000;

const titles = [
  "Full Stack Software Engineer",
  "Systems Architect",
  "Team Leader",
  "Samba Drummer",
  "Whiskey Appreciator",
  "Digital Cartologist",
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
      <div className="absolute inset-0 background">
        <FullpageClouds />

        <div className="absolute inset-0 flex flex-col justify-between z-1">
          <a href="#main-content" className="sr-only">
            Skip to main content
          </a>

          <Navigation />

          <main
            id="main-content"
            className="flex flex-col pt-6 md:pt-0 md:justify-center flex-grow px-8 md:px-20 lg:px-32"
          >
            <h1
              className="text-5xl md:text-6xl font-bold text-white mb-4"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
            >
              Andrew McDowell <br />
              Technical Lead, Geospatial Expert & Tech Writer
            </h1>
            <EarthCanvas />
            <div className="relative text-5xl md:text-6xl leading-none text-white h-32 md:h-24 md:leading-tight w-3/4 md:w-full">
              <span key={title} className="animate-slowFadeIn absolute top-0">
                {title}
              </span>
              <hr
                key={`${title}-hr`}
                className="animate-horizontalBounce absolute bottom-0 h-1 bg-white rounded md:h-2"
              />
            </div>
            <div className="mt-4 text-2xl md:text-3xl font-light text-white w-full md:w-2/3">
              Leading teams to build innovative geospatial solutions that make a
              difference.
            </div>
          </main>

          <div className="flex justify-around pb-4">
            <a
              href="https://github.com/madole"
              target="_blank"
              rel="noreferrer"
              className="font-light text-white no-underline opacity-75 hover:opacity-100"
            >
              Github
            </a>
            <a
              href="https://twitter.com/madole"
              target="_blank"
              className="font-light text-white no-underline opacity-75 hover:opacity-100"
              rel="noreferrer"
            >
              Twitter
            </a>
            <a
              href="https://www.linkedin.com/in/andrew-mcdowell-0092649b/"
              target="_blank"
              className="font-light text-white no-underline opacity-75 hover:opacity-100"
              rel="noreferrer"
            >
              Linkedin
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
