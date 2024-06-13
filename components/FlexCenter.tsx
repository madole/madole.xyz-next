import * as React from "react";

interface Props {
  children: React.ReactNode;
}
const FlexCenter = (props: Props): JSX.Element => {
  const { children } = props;
  return <div className="flex flex-center">{children}</div>;
};

export default FlexCenter;
