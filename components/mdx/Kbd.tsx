import React from "react";

export interface KbdProps {
  children: React.ReactNode;
}

const Kbd: React.FC<KbdProps> = (props) => {
  return (
    <kbd className="shadow shadow-slate-300 p-1 rounded-sm bg-stone-100 font-mono text-sm">
      {props.children}
    </kbd>
  );
};

export default Kbd;
