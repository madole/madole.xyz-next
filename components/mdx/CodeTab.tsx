import type { ReactNode } from "react";

export interface CodeTabProps {
  label?: string;
  children: ReactNode;
}

// Rendered directly only when used outside a CodeGroup. Inside a CodeGroup the
// parent reads `label` and `children` from these elements to build the tabs.
export default function CodeTab({ label, children }: CodeTabProps) {
  return (
    <div>
      {label ? (
        <div className="text-sm font-semibold text-slate-500">{label}</div>
      ) : null}
      {children}
    </div>
  );
}
