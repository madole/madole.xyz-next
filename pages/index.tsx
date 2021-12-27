import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import useInterval from "../hooks/useInterval";
import Image from "next/image";
import { Navigation } from "../components/Navigation";

export interface IndexProps {}

const TITLE_SWITCH_INTERVAL = 5000;

const titles = [
  "Software Engineer",
  "Team Leader",
  "Samba Drummer",
  "Whiskey Appreciator",
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
        <title>`Homepage | Madole.xyz`</title>
      </Head>
      <div className="absolute inset-0 flex flex-col justify-between background">
        <a href="#main-content" className="sr-only">
          Skip to main content
        </a>

        <div className="absolute bottom-7 xl:bottom-0 right-0 hidden sm:block">
          <Image
            src="/bitmoji.png"
            alt="Me, a bitmoji"
            className="animate-slowFadeIn h-48 lg:h-64 pb-12"
            width={200}
            height={200}
          />
        </div>

        <Navigation />

        <main
          id="main-content"
          className="flex flex-col justify-center flex-grow px-8 md:px-20 lg:px-32"
        >
          <div className="relative h-40 text-6xl leading-none text-white md:h-24 md:leading-tight">
            <span key={title} className="animate-slowFadeIn absolute top-0">
              {title}
            </span>
            <hr
              key={`${title}-hr`}
              className="animate-horizontalBounce absolute bottom-0 h-1 bg-white rounded md:h-2"
            />
          </div>
          <div className="p-3 pl-0 text-2xl md:text-3xl font-light text-white opacity-75">
            Work hard, play harder.
          </div>
          <div className="text-2xl md:text-3xl font-light text-white">
            Specialising in building rich, interactive web applications and
            leading software engineering teams.
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
    </>
  );
};

export default Index;
