import React from "react";

export type KbdProps = {
  children: React.ReactNode;
} & React.ComponentProps<"kbd">;

const Kbd = (props: KbdProps) => {
  return (
    <kbd className="shadow shadow-slate-300 p-1 rounded-sm bg-stone-100 font-mono text-sm">
      {props.children}
    </kbd>
  );
};

export default Kbd;
