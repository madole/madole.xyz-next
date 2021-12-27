import * as React from "react";

export interface RedTextProps {
  children: React.ReactNode;
}

const RedText: React.FC<RedTextProps> = (props) => {
  return (
    <div
      style={{
        color: "red",
        fontStyle: "italic",
        border: "1px solid red",
      }}
    >
      {props.children}
    </div>
  );
};

export default RedText;
