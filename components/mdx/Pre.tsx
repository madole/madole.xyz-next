import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  children: ReactNode;
} & JSX.IntrinsicElements["pre"];

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
