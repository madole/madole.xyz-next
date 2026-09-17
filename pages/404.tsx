import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Navigation } from "../components/Navigation";
import NotFoundConsole from "../components/NotFoundConsole";
import { useRocketMode } from "../hooks/useRocketMode";

/**
 * The 404 shares the homepage's sky: the same scene, so the Earth and stars are
 * there from the first paint. The rocket inside it still loads only when the
 * code is typed - CombinedThreeScene keeps that chunk separate. ssr:false
 * because the scene is WebGL, which has nothing to render on the server.
 */
const CombinedThreeScene = dynamic(
  () => import("../components/CombinedThreeScene"),
  { ssr: false },
);

const NotFound: React.FC = () => {
  const router = useRouter();
  // Same hidden mode as the homepage: type "rocket" to summon one here too.
  const { mode: rocketMode, onExited: onRocketExited } = useRocketMode();
  const [canFlyRocket, setCanFlyRocket] = useState(false);
  const [path, setPath] = useState<string | null>(null);

  /*
   * The 404's server payload carries no asPath, so it reads as "/404" when
   * rendered on the server and as the requested URL once the router hydrates.
   * Reading it during render would therefore mismatch; resolve it after mount.
   */
  useEffect(() => {
    setPath(router.asPath);
  }, [router.asPath]);

  /*
   * The hint promises a keyboard, so it only shows where one is likely to
   * exist and the sky can animate - the same gates the homepage's banner uses.
   * Checked after mount because matchMedia is a browser-only API.
   */
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const wantsMotion = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    setCanFlyRocket(finePointer && wantsMotion);
  }, []);

  return (
    <>
      <Head>
        <title>Signal lost | Madole.xyz</title>
        <meta name="robots" content="noindex" />
      </Head>

      {/*
        Matches the homepage sky. globals.css paints html/body with the site
        gradient, so the deep-space base has to be set here or overscroll shows
        a seam - see the same note on the homepage.
      */}
      <style jsx global>{`
        html,
        body {
          background: #0c0722;
        }
      `}</style>

      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,#21164d_0%,#140c33_45%,#0c0722_100%)]" />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to main content
      </a>

      {/*
        `relative` establishes the containing block for the scene's Earth
        tracking div, and min-h-dvh keeps it full-height without the absolutely
        positioned scene adding any height of its own.
      */}
      <div className="relative flex min-h-dvh flex-col">
        <div className="relative z-20">
          <Navigation />
        </div>

        {/*
          Always mounted, so the Earth and starfield are part of the page
          rather than a reward for finding the easter egg. The scene itself
          decides whether to draw a rocket from `rocketMode`.
        */}
        <CombinedThreeScene
          rocketMode={rocketMode}
          onRocketExited={onRocketExited}
        />

        <main
          id="main-content"
          className="relative z-20 flex flex-1 items-center justify-center px-6 pb-16 pt-8"
        >
          <NotFoundConsole
            path={path ?? "UNRESOLVED"}
            showRocketHint={canFlyRocket && rocketMode === "off"}
            rocketActive={rocketMode !== "off"}
          />
        </main>
      </div>

      {/* Live region kept mounted so assistive tech announces the mode when it
          starts; same pattern and wording as the homepage. */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center"
      >
        {rocketMode === "on" ? (
          <p className="animate-toast rounded-full bg-black/60 px-4 py-2 text-sm text-white shadow-lg backdrop-blur">
            Rocket mode. Arrows to fly, coast near Earth to orbit, B to barrel
            roll, Esc to leave.
          </p>
        ) : null}
      </div>
    </>
  );
};

export default NotFound;
