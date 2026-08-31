import React from "react";
import { AbsoluteFill } from "remotion";
import { colors } from "../colors";
import { BrowserFrame } from "../components/BrowserFrame";
import { Caption } from "../components/Caption";

interface DesktopFootageSceneProps {
  src: string;
  index: string;
  title: string;
  durationInFrames: number;
  startFrom?: number;
}

export const DesktopFootageScene: React.FC<DesktopFootageSceneProps> = ({
  src,
  index,
  title,
  durationInFrames,
  startFrom,
}) => (
  <AbsoluteFill style={{ backgroundColor: colors.bg }}>
    <BrowserFrame src={src} startFrom={startFrom} />
    <Caption index={index} title={title} durationInFrames={durationInFrames} />
  </AbsoluteFill>
);
