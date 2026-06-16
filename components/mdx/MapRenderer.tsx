"use client";

import { useEffect, useRef, useState } from "react";

export interface MapRendererProps {
  geojsonUrl?: string;
  center?: string;
  zoom?: number;
  styleUrl?: string;
}

const DEFAULT_STYLE = "https://demotiles.maplibre.org/style.json";

function parseCenter(center: string | undefined): [number, number] {
  if (!center) return [0, 0];
  const parts = center.split(",").map((p) => Number(p.trim()));
  if (parts.length === 2 && parts.every((n) => Number.isFinite(n))) {
    return [parts[0], parts[1]];
  }
  return [0, 0];
}

export default function MapRenderer({
  geojsonUrl,
  center,
  zoom = 8,
  styleUrl,
}: MapRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let map: import("maplibre-gl").Map | null = null;
    let cancelled = false;

    (async () => {
      try {
        const maplibregl = (await import("maplibre-gl")).default;
        if (cancelled) return;

        map = new maplibregl.Map({
          container,
          style: styleUrl || DEFAULT_STYLE,
          center: parseCenter(center),
          zoom,
        });

        map.addControl(new maplibregl.NavigationControl(), "top-right");

        if (geojsonUrl) {
          map.on("load", () => {
            if (!map) return;
            map.addSource("geojson-data", { type: "geojson", data: geojsonUrl });
            map.addLayer({
              id: "geojson-fill",
              type: "fill",
              source: "geojson-data",
              filter: ["==", ["geometry-type"], "Polygon"],
              paint: { "fill-color": "#3b82f6", "fill-opacity": 0.3 },
            });
            map.addLayer({
              id: "geojson-line",
              type: "line",
              source: "geojson-data",
              paint: { "line-color": "#1d4ed8", "line-width": 2 },
            });
            map.addLayer({
              id: "geojson-point",
              type: "circle",
              source: "geojson-data",
              filter: ["==", ["geometry-type"], "Point"],
              paint: { "circle-color": "#1d4ed8", "circle-radius": 5 },
            });
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load map",
          );
        }
      }
    })();

    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, [geojsonUrl, center, zoom, styleUrl]);

  if (error) {
    return (
      <div className="my-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-6 h-96 w-full overflow-hidden rounded-lg"
    />
  );
}
