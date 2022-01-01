import React from "react";

export interface CitationProps {
  children: React.ReactNode;
}

const Citation: React.FC<CitationProps> = (props) => {
  return <cite className="prose">-- {props.children}</cite>;
};

export default Citation;
