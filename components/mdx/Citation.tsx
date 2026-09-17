import React from "react";

export interface CitationProps {
  children: React.ReactNode;
}

const Citation = (props: CitationProps) => {
  return <cite className="prose dark:prose-invert">-- {props.children}</cite>;
};

export default Citation;
