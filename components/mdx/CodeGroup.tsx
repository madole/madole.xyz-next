"use client";

import {
  Children,
  isValidElement,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import type { CodeTabProps } from "./CodeTab";

function isCodeTabElement(
  node: ReactNode,
): node is ReactElement<CodeTabProps> {
  return isValidElement(node);
}

export interface CodeGroupProps {
  children: ReactNode;
}

export default function CodeGroup({ children }: CodeGroupProps) {
  const tabs = Children.toArray(children).filter(isCodeTabElement);
  const [active, setActive] = useState(0);

  if (tabs.length === 0) return null;

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-slate-200">
      <div
        role="tablist"
        className="flex flex-wrap border-b border-slate-200 bg-slate-50"
      >
        {tabs.map((tab, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`px-4 py-2 text-sm font-medium ${
              i === active
                ? "border-b-2 border-sky-500 text-sky-700"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.props.label ?? `Tab ${i + 1}`}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="[&_pre]:my-0 [&_pre]:rounded-none">
        {tabs[active]?.props.children}
      </div>
    </div>
  );
}
