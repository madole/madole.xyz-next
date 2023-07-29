import React from "react";

export interface HyperlinkProps {
  children: React.ReactNode;
}

const Hyperlink: React.FC<HyperlinkProps> = (props) => {
  const { children, ...rest } = props;
  return (
    <a className="text-purple-800 underline visited:text-purple-900" {...rest}>
      {children}
    </a>
  );
};

export default Hyperlink;
