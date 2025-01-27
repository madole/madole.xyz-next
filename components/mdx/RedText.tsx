import * as React from "react";

export interface RedTextProps {
  children: React.ReactNode;
}

const RedText = (props: RedTextProps) => {
  return (
    <div className="border-red-500 border-2 rounded-lg p-4 italic text-red-500">
      {props.children}
    </div>
  );
};

export default RedText;
