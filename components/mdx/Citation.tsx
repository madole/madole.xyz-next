import React from "react";

export interface CitationProps {
  children: React.ReactNode;
}

const Citation = (props: CitationProps) => {
  return <cite className="prose">-- {props.children}</cite>;
};

export default Citation;
