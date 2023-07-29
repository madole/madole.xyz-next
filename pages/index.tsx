import React, { useState } from "react";
import Head from "next/head";
import useInterval from "../hooks/useInterval";
import Image from "next/image";
import { Navigation } from "../components/Navigation";
import dynamic from "next/dynamic";

const FullpageClouds = dynamic(() => import("../components/FullPageClouds"), {
  ssr: false,
});

const EarthCanvas = dynamic(() => import("../components/EarthCanvas"), {
  ssr: false,
});

export interface IndexProps {}

const TITLE_SWITCH_INTERVAL = 5000;

const titles = [
  "Software Engineer",
  "Team Leader",
  "Samba Drummer",
  "Whiskey Appreciator",
  "Digital Cartologist",
];

const Index: React.FC<IndexProps> = (props) => {
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
        <title>Homepage | Madole.xyz</title>
        <meta property="og:title" content="Homepage | Madole.xyz" />
        <meta
          property="og:description"
          content="A portfolio of stuff I've worked or hacked on"
        />
        <meta property="og:image" content="https://madole.xyz/bitmoji.png" />
      </Head>
      <div className="absolute inset-0 background">
        <FullpageClouds />

        <div className="absolute inset-0 flex flex-col justify-between h-full z-10">
          <a href="#main-content" className="sr-only">
            Skip to main content
          </a>

          <Navigation />

          <main
            id="main-content"
            className="flex flex-col pt-6 md:pt-0 md:justify-center flex-grow px-8 md:px-20 lg:px-32"
          >
            <div className="relative text-5xl md:text-6xl leading-none text-white h-32 md:h-24 md:leading-tight w-3/4 md:w-full">
              <span key={title} className="animate-slowFadeIn absolute top-0">
                {title}
              </span>
              <hr
                key={`${title}-hr`}
                className="animate-horizontalBounce absolute bottom-0 h-1 bg-white rounded md:h-2"
              />
            </div>
            <div className="p-3 pl-0 text-2xl md:text-3xl font-light text-white opacity-75">
              Unleashing Geospatial Innovation Together.
            </div>
            <div className="text-2xl md:text-3xl font-light text-white w-full md:w-2/3">
              Transforming ideas into cutting-edge geospatial web applications
              through expert leadership and collaborative excellence.
            </div>
            <EarthCanvas />
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
