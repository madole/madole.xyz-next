"use client";

export type SandboxProvider = "stackblitz" | "codesandbox" | "codepen";

export interface SandboxEmbedProps {
  provider?: SandboxProvider;
  id: string;
  height?: number;
}

function embedUrl(provider: SandboxProvider, id: string): string {
  switch (provider) {
    case "codesandbox":
      return `https://codesandbox.io/embed/${id}`;
    case "codepen":
      // id is expected as "user/pen-slug"
      return `https://codepen.io/${id}/embed/preview`;
    case "stackblitz":
    default:
      return `https://stackblitz.com/edit/${id}?embed=1`;
  }
}

export default function SandboxEmbed({
  provider = "stackblitz",
  id,
  height = 500,
}: SandboxEmbedProps) {
  if (!id) return null;
  return (
    <iframe
      src={embedUrl(provider, id)}
      style={{ width: "100%", height: `${height}px`, border: 0 }}
      className="my-6 rounded-lg"
      title={`${provider} sandbox ${id}`}
      loading="lazy"
      allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi"
      sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    />
  );
}
