import * as React from "react";

export interface ParagraphProps {}

const Paragraph: React.FC<ParagraphProps> = (props) => {
  const { children, ...rest } = props;
  return (
    <p {...rest} className="my-4">
      {children}
    </p>
  );
};

export default Paragraph;
