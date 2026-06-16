import type { ReactNode } from "react";

export type HighlightVariant =
  | "yellow"
  | "blue"
  | "green"
  | "red"
  | "mono"
  | "fluorescent";

// Background colour applied to the skewed pseudo-element, plus text colour on the mark itself.
const highlightStyles: Record<HighlightVariant, string> = {
  yellow: "text-yellow-950 before:bg-yellow-200",
  blue: "text-sky-950 before:bg-sky-200",
  green: "text-emerald-950 before:bg-emerald-200",
  red: "text-red-950 before:bg-red-200",
  mono: "font-mono text-slate-900 before:bg-slate-200",
  fluorescent: "text-slate-900 before:bg-[#ccff00]",
};

export interface HighlightProps {
  variant?: HighlightVariant;
  children: ReactNode;
}

export default function Highlight({
  variant = "yellow",
  children,
}: HighlightProps) {
  return (
    <mark
      className={`relative isolate inline-block bg-transparent px-2 py-0.5
        before:absolute before:inset-0 before:-z-10 before:-skew-x-12
        before:rounded-sm ${highlightStyles[variant]}`}
    >
      {children}
    </mark>
  );
}