import Head from "next/head";
import { useRef } from "react";
import { SideProjectLayout } from "../components/Layout/SideProjectLayout";
import { useMultiIntersectionObserver } from "../hooks/useMultiIntersectionObserver";
import pano360 from "../images/360-pano.png";
import threedcolors from "../images/3d-colors.png";
import bboxUtil from "../images/bbox-util-kit.jpg";
import covidBananas from "../images/covid-bananas.png";
import earthMars from "../images/earth-mars.png";
import everyPlane from "../images/every-plane.png";
import fuelCharts from "../images/fuel-charts.jpg";
import geojsonEditor from "../images/geojson-editor.jpeg";
import gpxEditor from "../images/gpx-editor.jpeg";
import greensDrivePano from "../images/greens-drive-pano.png";
import issTracker from "../images/ISS-tracker.png";
import kmlEditor from "../images/kml-editor.jpeg";
import layeredEarth from "../images/layered-earth.jpeg";
import madoleText from "../images/madole-text.png";
import mapboxglBoundingBoxViewBoundsComparison from "../images/mapbox-gl-bounding-box-view-bounds-comparison.jpeg";
import moonBananas from "../images/moon-bananas-ufo.png";
import mourneWalks from "../images/mourne-walks.jpeg";
import recipeDeguffer from "../images/recipe-deguffer.jpg";
import styles from "../styles/side-projects.module.css";

const data = [
  {
    image: recipeDeguffer,
    title: "Recipe Deguffer",
    imageAlt: "Recipe Deguffer",
    description:
      "Transform any recipe website into a clean, easy-to-read format. This is a Deno Fresh project styled with Tailwind CSS.",
    link: "https://recipe-deguffer.madole.fun/",
  },
  {
    image: moonBananas,
    title: "Moon Bananas",
    imageAlt: "Moon Bananas",
    description:
      "A cesium experiment where I use the new Cesium Moon Tileset to drop bananas on the moon from a UFO",
    link: "https://moon-bananas.madole.dev/",
  },
  {
    image: fuelCharts,
    title: "Fuel Charts",
    imageAlt: "Fuel Charts",
    description:
      "A tool to visualise fuel prices in NSW, Australia. The data is sourced from the Australian government's open data portal.",
    link: "https://fuel-charts.madole.dev/",
  },
  {
    image: layeredEarth,
    title: "Layered Earth",
    imageAlt: "Layered Earth",
    description:
      "A geospatial toolkit for visually comparing geospatial datasets on the web.",
    link: "https://layered.earth/",
  },
  {
    image: bboxUtil,
    title: "Bounding Box Utility Kit",
    imageAlt: "Bounding Box Utility Kit",
    description:
      "With The Bounding Box Utility Kit you can easily draw polygons on a map and get the resulting bounding box, input bounding boxes in various formats, and visualize the bounding box on a map.",
    link: "https://bbox-util.madole.dev/",
  },
  {
    image: mapboxglBoundingBoxViewBoundsComparison,
    title: "Mapbox GL Bounding Box View Bounds Comparison",
    imageAlt: "Mapbox GL Bounding Box View Bounds Comparison",
    description:
      "A comparison of the bounds returned by Mapbox GL's map.getBounds() and the actual view box of the map.",
    link: "https://mapbox-gl-bounding-box-view-bounds-comparison.madole.dev/",
  },
  {
    image: geojsonEditor,
    title: "GEOJSON Editor",
    imageAlt: "GEOJSON Editor",
    description:
      "A tool to visualise GEOJSON files on a map and make edits. Includes file drag'n'drop.",
    link: "https://geojson-editor.madole.dev/",
  },
  {
    image: kmlEditor,
    title: "KML Editor",
    imageAlt: "KML Editor",
    description:
      "A tool to visualise KML files on a map and make edits. Includes file drag'n'drop as well as a geojson export",
    link: "https://kml-editor.madole.dev/",
  },
  {
    image: gpxEditor,
    title: "GPX Editor",
    imageAlt: "GPX Editor",
    description:
      "A tool to visualise GPX files on a map and make edits. Includes file drag'n'drop as well as a geojson export",
    link: "https://gpx-editor.madole.dev/",
  },

  {
    image: mourneWalks,
    title: "Mourne Walks",
    imageAlt: "Mourne Walks",
    description:
      "A 3D tour of the famous walk of Slieve Donard in the Mourne Mountains in Northern Ireland. Written in Preact and using Mapbox, this project is entirely configurable through GeoJSON.",
    link: "https://mourne-walks.madole.dev/",
  },
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
    link: "https://banana-iss-tracker.madole.dev/",
  },
  {
    image: everyPlane,
    imageAlt: "Planes as bananas",
    title: "Every plane in the sky, but bananas",
    description:
      "A cesium experiment where I display one banana for every plane in the sky in real time",
    link: "https://banana-planes.madole.dev/",
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
    imageAlt: "A gallery of 360 degree blog-images",
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
    <SideProjectLayout>
      <Head>
        <title>Side Projects | Madole.xyz</title>
      </Head>
      <section className="flex flex-col w-full justify-evenly items-center">
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
      </section>
    </SideProjectLayout>
  );
};

export default SideProjects;
