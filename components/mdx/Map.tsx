import dynamic from "next/dynamic";
import type { MapRendererProps } from "./MapRenderer";

// MapLibre needs the DOM, so keep it out of the static export with ssr:false.
const MapRenderer = dynamic(() => import("./MapRenderer"), {
  ssr: false,
  loading: () => (
    <div className="my-6 h-96 w-full animate-pulse rounded-lg bg-slate-100" />
  ),
});

export default function Map(props: MapRendererProps) {
  return <MapRenderer {...props} />;
}
