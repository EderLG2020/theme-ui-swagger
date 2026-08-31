import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../colors";
import { fontFamily } from "../fonts";

interface CaptionProps {
  index: string;
  title: string;
  durationInFrames: number;
}

// Chip inferior-izquierdo tipo "01 · Explora endpoints" que identifica
// cada escena de grabación real, entra deslizando y se desvanece antes
// del corte a la siguiente escena.
export const Caption: React.FC<CaptionProps> = ({
  index,
  title,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 15,
  });
  const translateY = interpolate(enter, [0, 1], [16, 0]);
  const opacityIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  const opacityOut = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opacity = Math.min(opacityIn, opacityOut);

  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        bottom: 56,
        display: "flex",
        alignItems: "center",
        gap: 14,
        transform: `translateY(${translateY}px)`,
        opacity,
        fontFamily,
      }}
    >
      <span
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: colors.indigoLight,
          fontFamily: "monospace",
          letterSpacing: 1,
        }}
      >
        {index}
      </span>
      <span style={{ width: 1, height: 20, backgroundColor: colors.border }} />
      <span style={{ fontSize: 26, fontWeight: 600, color: colors.text }}>
        {title}
      </span>
    </div>
  );
};
