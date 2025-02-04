import * as React from "react";

export interface ParagraphProps {
  children: React.ReactNode;
}

const Paragraph: React.FC<ParagraphProps> = (props) => {
  const { children, ...rest } = props;
  return (
    <p {...rest} className="has-[img]:flex has-[img]:justify-center">
      {children}
    </p>
  );
};

export default Paragraph;
