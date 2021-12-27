import React, { useRef } from "react";
import { Layout } from "../components/Layout";
import threedcolors from "../images/3d-colors.png";
import madoleText from "../images/madole-text.png";
import earthMars from "../images/earth-mars.png";
import everyPlane from "../images/every-plane.png";
import covidBananas from "../images/covid-bananas.png";
import issTracker from "../images/ISS-tracker.png";
import pano360 from "../images/360-pano.png";
import greensDrivePano from "../images/greens-drive-pano.png";
import styles from "../styles/side-projects.module.css";
import { useMultiIntersectionObserver } from "../hooks/useMultiIntersectionObserver";
import Head from "next/head";

const data = [
  {
    image: threedcolors,
    imageAlt: "3D colors application",
    title: "3D Colors",
    description:
      "An app build with React Three Fiber which processes an image from a URL and uses that data to draw spectacular visuals in a 3D world",
    link: "https://3d-colors.madole.dev/",
  },
  {
    image: madoleText,
    imageAlt: "3D lettering spelling madole.xyz",
    title: "Gravity + 3D text",
    description:
      "A React Three Fiber experiment using physics from the cannon library via the useCannon hook",
    link: "https://hardcore-murdock-e30d02.netlify.app/",
  },
  {
    image: earthMars,
    imageAlt: "Image of earth",
    title: "Earth and Mars ThreeJS experiment",
    description:
      "ThreeJS experiment in uv and bump displaying the earth and mars",
    link: "https://objective-yalow-40b72b.netlify.app/",
  },
  {
    image: issTracker,
    imageAlt: "International Space Station as a banana",
    title: "International Space Station banana tracker",
    description:
      "A cesium experiment where I track the ISS in real time with a banana and glowing tail",
    link: "https://awesome-williams-79aa53.netlify.app/",
  },
  {
    image: everyPlane,
    imageAlt: "Planes as bananas",
    title: "Every plane in the sky, but bananas",
    description:
      "A cesium experiment where I display one banana for every plane in the sky in real time",
    link: "https://dazzling-sinoussi-fb995a.netlify.app/",
  },
  {
    image: covidBananas,
    imageAlt: "Covid locations as bananas",
    title: "NSW Covid Bananas",
    description:
      "A cesium experiment where I show each covid location in NSW as a banana and have implemented a location proximity detector",
    link: "https://nsw-covid-bananas.madole.dev/",
  },
  {
    image: pano360,
    imageAlt: "Image of 360 degree space",
    title: "360 Panorama viewer",
    description:
      "A React Three Fiber and React Dropzone 360 degree panorama viewer. A 360 degree image is painted on the inside of a large sphere which the viewer's camera is inside giving the experience of a panorama viewer",
    link: "https://360-panorama.madole.dev/",
  },
  {
    image: greensDrivePano,
    imageAlt: "A gallery of 360 degree images",
    title: "House tour implementation of 360 degree panorama viewer",
    description:
      "A specific implementation of the above panorama viewer for a specific house tour",
    link: "https://greens-drive-pano.madole.dev/",
  },
];

const addInViewCallback = (entries: any[]) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add(styles["in-view"]);
    } else {
      entry.target.classList.remove(styles["in-view"]);
    }
  });
};

const SideProjects = () => {
  const observerRef = useRef<IntersectionObserver>();
  useMultiIntersectionObserver(
    observerRef,
    "[data-side-project=true]",
    addInViewCallback
  );

  return (
    <Layout>
      <Head>
        <title>Side Projects | Madole.xyz</title>
      </Head>
      <div className="flex flex-col w-full justify-evenly items-center">
        {data.map(({ image, imageAlt, title, description, link }, index) => (
          <div
            key={imageAlt}
            className={`${
              styles["side-project-container"]
            } flex flex-col items-center md:flex-row w-full md:w-4/5 lg:w-2/3 mt-20 ${
              index % 2 !== 0 ? "md:flex-row-reverse" : ""
            }`}
            data-side-project={true}
          >
            <a
              href={link}
              className={styles["side-project-image-container"]}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles["side-project-image"]}
                src={image.src}
                alt={imageAlt}
              />
            </a>
            <div className="text-white md:mx-20 mt-10 md:mt-10 w-4/5 lg:w-1/3">
              <h2 className="prose prose-lg text-white text-3xl font-bold">
                {title}
              </h2>
              <p className="prose prose-lg text-white">{description}</p>
              <a href={link} target="_blank" rel="noopener noreferrer">
                <span>🔗 </span>
                <span className="prose prose-lg text-white underline">
                  Click for a demo
                </span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default SideProjects;
