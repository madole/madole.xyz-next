import React from "react";
import ThreeWrapper from "./ThreeWrapper";
import Clouds from "./Clouds";

export interface FullPageCloudsProps {}

const FullPageClouds: React.FC<FullPageCloudsProps> = (props) => {
  return (
    <ThreeWrapper>
      <Clouds />
    </ThreeWrapper>
  );
};

export default FullPageClouds;
