import { ReactNode } from "react";

type Props = {
  children: ReactNode;
} & JSX.IntrinsicElements["pre"];

const Pre = ({ children, ...props }: Props) => {
  return (
    <pre
      className="text-sm md:w-[120%] md:-translate-x-[10%] text-wrap whitespace-wrap"
      {...props}
    >
      {children}
    </pre>
  );
};

export default Pre;
