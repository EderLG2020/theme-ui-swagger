import React from "react";
import { AbsoluteFill } from "remotion";
import { colors } from "../colors";
import { PhoneFrame } from "../components/PhoneFrame";
import { Caption } from "../components/Caption";

interface MobileFootageSceneProps {
  src: string;
  index: string;
  title: string;
  durationInFrames: number;
  startFrom?: number;
}

export const MobileFootageScene: React.FC<MobileFootageSceneProps> = ({
  src,
  index,
  title,
  durationInFrames,
  startFrom,
}) => (
  <AbsoluteFill style={{ backgroundColor: colors.bg }}>
    <PhoneFrame src={src} startFrom={startFrom} />
    <Caption index={index} title={title} durationInFrames={durationInFrames} />
  </AbsoluteFill>
);
