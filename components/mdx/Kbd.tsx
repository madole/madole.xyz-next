import React from "react";

export type KbdProps = {
  children: React.ReactNode;
} & React.ComponentProps<"kbd">;

const Kbd = (props: KbdProps) => {
  return (
    <kbd className="shadow shadow-slate-300 p-1 rounded-sm bg-stone-100 font-mono text-sm dark:bg-stone-800 dark:text-stone-100 dark:shadow-slate-700">
      {props.children}
    </kbd>
  );
};

export default Kbd;
