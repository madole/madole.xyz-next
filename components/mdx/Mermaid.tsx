import dynamic from "next/dynamic";
import type { MermaidRendererProps } from "./MermaidRenderer";

// Mermaid touches the DOM, so keep it out of the static export with ssr:false.
const MermaidRenderer = dynamic(() => import("./MermaidRenderer"), {
  ssr: false,
  loading: () => (
    <div className="my-6 text-center text-sm text-slate-400">
      Loading diagram...
    </div>
  ),
});

export default function Mermaid(props: MermaidRendererProps) {
  return <MermaidRenderer {...props} />;
}
