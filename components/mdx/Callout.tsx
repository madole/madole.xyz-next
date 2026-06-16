import type { ReactNode } from "react";

export type CalloutTone = "info" | "warning" | "tip" | "til";

const calloutStyles: Record<CalloutTone, string> = {
  info: "border-sky-500 text-sky-700",
  warning: "border-red-500 text-red-500",
  tip: "border-emerald-500 text-emerald-700",
  til: "border-violet-500 text-violet-700",
};

export interface CalloutProps {
  tone?: CalloutTone;
  /** @deprecated use `tone` instead */
  type?: CalloutTone;
  children: ReactNode;
}

export default function Callout({ tone, type, children }: CalloutProps) {
  const resolvedTone = tone ?? type ?? "info";
  return (
    <div
      className={`my-4 rounded-lg border-2 p-4 italic ${calloutStyles[resolvedTone]}`}
    >
      {children}
    </div>
  );
}
