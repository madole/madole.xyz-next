"use client";

import { useEffect, useId, useRef, useState } from "react";

export interface MermaidRendererProps {
  source: string;
  caption?: string;
}

export default function MermaidRenderer({
  source,
  caption,
}: MermaidRendererProps) {
  const rawId = useId();
  const renderId = `mermaid-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const trimmed = source?.trim();
    if (!trimmed) {
      setSvg(null);
      setError(null);
      return;
    }

    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({ startOnLoad: false, theme: "default" });
        const { svg: rendered } = await mermaid.render(renderId, trimmed);
        if (!cancelled) {
          setSvg(rendered);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to render diagram",
          );
          setSvg(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [source, renderId]);

  return (
    <figure className="my-6 flex flex-col items-center">
      {error ? (
        <pre className="w-full overflow-auto rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </pre>
      ) : (
        <div
          ref={containerRef}
          className="flex w-full justify-center [&_svg]:max-w-full"
          dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
        />
      )}
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-slate-500">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
