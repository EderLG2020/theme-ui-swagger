import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../colors";
import { fontFamily } from "../fonts";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6 },
    durationInFrames: 24,
  });

  const titleOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [10, 30], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subOpacity = interpolate(frame, [26, 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subY = interpolate(frame, [26, 46], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 35%, rgba(99,102,241,0.18), transparent 55%)",
        }}
      />
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 22,
          backgroundColor: "rgba(99,102,241,0.12)",
          border: "1px solid rgba(99,102,241,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${interpolate(badgeSpring, [0, 1], [0.5, 1])})`,
          opacity: interpolate(badgeSpring, [0, 1], [0, 1]),
          marginBottom: 28,
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.8">
          <path d="M7 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17.3 8.5 4.5 4.5 0 0 1 17 18H7Z" />
          <path d="M12 12v6M9.5 14.5 12 12l2.5 2.5" />
        </svg>
      </div>
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 64,
          fontWeight: 800,
          color: colors.text,
          letterSpacing: -1,
        }}
      >
        PetVerse API Explorer
      </div>
      <div
        style={{
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
          marginTop: 16,
          fontSize: 26,
          color: colors.textMuted,
        }}
      >
        Explora cualquier documento OpenAPI / Swagger
      </div>
    </AbsoluteFill>
  );
};
