import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<'pre'>;

const Pre = ({ children, className, ...props }: Props) => {
  return (
    <pre
      {...props}
      className={twMerge(className, "!text-xs text-wrap whitespace-wrap")}
    >
      {children}
    </pre>
  );
};

export default Pre;
