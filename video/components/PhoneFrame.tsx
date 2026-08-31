import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { colors } from "../colors";

interface PhoneFrameProps {
  src: string;
  startFrom?: number;
}

// Silueta de teléfono (bisel + notch) para enmarcar la grabación móvil,
// que es vertical y no encaja bien en el BrowserFrame horizontal.
export const PhoneFrame: React.FC<PhoneFrameProps> = ({ src, startFrom = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });
  const translateY = interpolate(enter, [0, 1], [24, 0]);
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  const height = 880;
  const width = Math.round(height * (390 / 844));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width,
          height,
          transform: `translateY(${translateY}px)`,
          opacity,
          borderRadius: 44,
          border: `10px solid ${colors.panel}`,
          boxShadow: "0 40px 120px -20px rgba(0,0,0,0.6)",
          overflow: "hidden",
          position: "relative",
          backgroundColor: "#000",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 120,
            height: 22,
            backgroundColor: colors.panel,
            borderBottomLeftRadius: 14,
            borderBottomRightRadius: 14,
            zIndex: 2,
          }}
        />
        <OffthreadVideo
          src={staticFile(src)}
          startFrom={startFrom}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </AbsoluteFill>
  );
};
