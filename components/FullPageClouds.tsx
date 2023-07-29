import React from "react";
import FullPageThreeWrapper from "./FullPageThreeWrapper";
import Clouds from "./Clouds";
import { SparksThatFollowTheMouse } from "./SparksThatFollowTheMouse";
import Earth from "./Earth";

export interface FullPageCloudsProps {}

const FullPageClouds: React.FC<FullPageCloudsProps> = (props) => {
  return (
    <FullPageThreeWrapper>
      <Clouds />
      <SparksThatFollowTheMouse />
    </FullPageThreeWrapper>
  );
};

export default FullPageClouds;
