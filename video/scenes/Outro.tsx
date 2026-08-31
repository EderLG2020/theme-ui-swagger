import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../colors";
import { fontFamily } from "../fonts";

const BADGES = ["React", "TailwindCSS", "Framer Motion"];

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 20], [16, 0], {
    extrapolateRight: "clamp",
  });
  const badgesOpacity = interpolate(frame, [16, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const creditOpacity = interpolate(frame, [34, 54], [0, 1], {
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
            "radial-gradient(circle at 50% 60%, rgba(99,102,241,0.14), transparent 55%)",
        }}
      />
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 52,
          fontWeight: 800,
          color: colors.text,
        }}
      >
        Explora tu API hoy
      </div>
      <div style={{ opacity: badgesOpacity, display: "flex", gap: 12, marginTop: 28 }}>
        {BADGES.map((b) => (
          <span
            key={b}
            style={{
              padding: "8px 18px",
              borderRadius: 999,
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.panel,
              color: colors.textMuted,
              fontSize: 18,
            }}
          >
            {b}
          </span>
        ))}
      </div>
      <div style={{ opacity: creditOpacity, marginTop: 40, fontSize: 16, color: colors.textDim }}>
        Eder Llancari Guerra
      </div>
    </AbsoluteFill>
  );
};
