import * as React from "react";

export interface CodeProps {
  children: React.ReactNode;
  className?: string;
  language?: string;
  style?: React.CSSProperties;
}

const Code = (props: CodeProps) => {
  const { children, ...rest } = props;
  return (
    <code
      className="bg-sky-200 p-1 mx-1 rounded font-mono dark:bg-sky-900 dark:text-sky-100"
      {...rest}
    >
      {children}
    </code>
  );
};

export default Code;
