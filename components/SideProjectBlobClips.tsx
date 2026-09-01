/**
 * Blob clip paths for the side project images.
 *
 * These live in SVG rather than in `clip-path: path()` because `path()`
 * coordinates are absolute pixels in the element's own coordinate space: they
 * only line up when the box happens to be exactly the size the path was drawn
 * at, and Chrome scales that space by page/display zoom, which cropped the
 * blobs to a fragment of their shape. `clipPathUnits="objectBoundingBox"` uses
 * unitless 0-1 coordinates relative to the clipped box, so one shape fits every
 * image size and is immune to zoom and device pixel ratio.
 *
 * The two clip paths are identical apart from the animation offset, which gives
 * alternating rows their staggered morph.
 */

const BLOB_A =
  "M0.72125 0.08375C0.795 0.13687 0.85437 0.20563 0.89812 0.2825C0.94125 0.35938 0.97 0.445 0.9775 0.53438C0.985 0.62375 0.97125 0.71813 0.92375 0.7875C0.87562 0.85688 0.79312 0.90125 0.71188 0.92375C0.63 0.94625 0.55 0.94625 0.45937 0.965C0.36812 0.98375 0.26625 1.02125 0.21 0.98438C0.15313 0.94812 0.14188 0.83688 0.105 0.74875C0.0675 0.66063 0.00375 0.595 0.00187 0.52875C0 0.4625 0.05875 0.39437 0.10875 0.3275C0.15812 0.26062 0.19812 0.19437 0.25688 0.1325C0.315 0.07 0.3925 0.0125 0.47563 0.0025C0.55875 -0.0075 0.6475 0.03062 0.72125 0.08375Z";

const BLOB_B =
  "M0.69933 0.07902C0.76313 0.11329 0.82507 0.15548 0.8802 0.21613C0.93533 0.27677 0.98365 0.35456 0.99665 0.44091C1.00904 0.52727 0.98674 0.62087 0.93471 0.68745C0.8833 0.75469 0.80278 0.79424 0.72597 0.84829C0.64978 0.90235 0.57731 0.97156 0.49307 0.99266C0.40945 1.01375 0.31405 0.98739 0.22796 0.93926C0.14186 0.89048 0.06505 0.82061 0.02912 0.73228C-0.00742 0.6446 -0.00309 0.53847 0.00744 0.43959C0.01797 0.34072 0.03594 0.24843 0.08053 0.17526C0.12513 0.10275 0.19698 0.05001 0.27193 0.02299C0.3475 -0.00338 0.42617 -0.0047 0.49802 0.00717C0.57049 0.01969 0.63615 0.0454 0.69933 0.07902Z";

/** cubic-bezier(0.42, 0, 0.58, 1), i.e. CSS ease-in-out, per half of the morph. */
const EASE_IN_OUT = "0.42 0 0.58 1;0.42 0 0.58 1";

const BlobClip = ({ id, begin }: { id: string; begin: string }) => (
  <clipPath id={id} clipPathUnits="objectBoundingBox">
    <path d={BLOB_A}>
      <animate
        attributeName="d"
        dur="10s"
        begin={begin}
        repeatCount="indefinite"
        calcMode="spline"
        keyTimes="0;0.5;1"
        keySplines={EASE_IN_OUT}
        values={`${BLOB_A};${BLOB_B};${BLOB_A}`}
      />
    </path>
  </clipPath>
);

export const SIDE_PROJECT_BLOB_ID = "side-project-blob";
export const SIDE_PROJECT_BLOB_OFFSET_ID = "side-project-blob-offset";

export const SideProjectBlobClips = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    width="0"
    height="0"
    style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
  >
    <defs>
      <BlobClip id={SIDE_PROJECT_BLOB_ID} begin="0s" />
      {/* Negative begin starts the morph a quarter cycle in, staggering rows. */}
      <BlobClip id={SIDE_PROJECT_BLOB_OFFSET_ID} begin="-2.5s" />
    </defs>
  </svg>
);
