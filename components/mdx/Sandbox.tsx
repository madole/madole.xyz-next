import dynamic from "next/dynamic";
import type { SandboxEmbedProps } from "./SandboxEmbed";

// Loaded client-side only, per the content-component spec.
const SandboxEmbed = dynamic(() => import("./SandboxEmbed"), {
  ssr: false,
  loading: () => (
    <div className="my-6 h-64 w-full animate-pulse rounded-lg bg-slate-100" />
  ),
});

export default function Sandbox(props: SandboxEmbedProps) {
  return <SandboxEmbed {...props} />;
}
