import type { ReactNode } from "react";

export type CalloutTone = "info" | "warning" | "tip" | "til";

interface CalloutToneConfig {
  label: string;
  toneClassName: string;
}

const calloutCommentOpen = "/*";
const calloutCommentClose = "*/";

const calloutToneConfig: Record<CalloutTone, CalloutToneConfig> = {
  info: {
    label: "INFO",
    toneClassName: "text-blue-600",
  },
  warning: {
    label: "WARNING",
    toneClassName: "text-red-600",
  },
  tip: {
    label: "TIP",
    toneClassName: "text-emerald-600",
  },
  til: {
    label: "TIL",
    toneClassName: "text-purple-600",
  },
};

export interface CalloutProps {
  tone?: CalloutTone;
  /** @deprecated use `tone` instead */
  type?: CalloutTone;
  children: ReactNode;
}

export default function Callout({ tone, type, children }: CalloutProps) {
  const resolvedTone = tone ?? type ?? "info";
  const { label, toneClassName } = calloutToneConfig[resolvedTone];

  return (
    <aside className="my-7 text-slate-950">
      <div
        className={`font-mono text-xs font-semibold uppercase tracking-[0.2em] ${toneClassName}`}
      >
        {calloutCommentOpen} {label}
      </div>
      <div
        className={`my-2 min-w-0 font-normal italic leading-relaxed ${toneClassName}
          [&>*:first-child]:mt-0 [&>*:last-child]:mb-0`}
      >
        {children}
      </div>
      <div
        className={`font-mono text-xs font-semibold tracking-[0.2em] ${toneClassName}`}
      >
        {calloutCommentClose}
      </div>
    </aside>
  );
}
