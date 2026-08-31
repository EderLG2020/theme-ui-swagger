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

interface BrowserFrameProps {
  src: string;
  startFrom?: number;
}

// Recuadro tipo "ventana de navegador" (barra con 3 puntos) que enmarca
// la grabación real de escritorio, para que se lea como una pieza de
// video producida y no como un screen recording pelado.
export const BrowserFrame: React.FC<BrowserFrameProps> = ({ src, startFrom = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });
  const scale = interpolate(enter, [0, 1], [0.96, 1]);
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

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
          width: "88%",
          height: "82%",
          transform: `scale(${scale})`,
          opacity,
          borderRadius: 20,
          overflow: "hidden",
          border: `1px solid ${colors.border}`,
          boxShadow:
            "0 40px 120px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02)",
          display: "flex",
          flexDirection: "column",
          backgroundColor: colors.panel,
        }}
      >
        <div
          style={{
            height: 36,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 14px",
            borderBottom: `1px solid ${colors.border}`,
            backgroundColor: "rgba(24,24,27,0.9)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor: "#f43f5e",
            }}
          />
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor: "#f59e0b",
            }}
          />
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor: "#10b981",
            }}
          />
        </div>
        <div style={{ flex: 1, position: "relative" }}>
          <OffthreadVideo
            src={staticFile(src)}
            startFrom={startFrom}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
