import * as React from "react";

interface Props {
  children: React.ReactNode;
}
const FlexCenter = (props: Props): React.ReactElement => {
  const { children } = props;
  return <div className="flex justify-center">{children}</div>;
};

export default FlexCenter;
