import React from "react";
import FullPageThreeWrapper from "./FullPageThreeWrapper";
import Clouds from "./Clouds";

export interface FullPageCloudsProps {}

const FullPageClouds: React.FC<FullPageCloudsProps> = () => {
  return (
    <FullPageThreeWrapper>
      <Clouds />
    </FullPageThreeWrapper>
  );
};

export default FullPageClouds;
