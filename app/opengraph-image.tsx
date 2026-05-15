import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "GlowVa — AI beauty, made for your skin.";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FFF1EC",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: "#1F1330",
            fontSize: 36,
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background:
                "linear-gradient(135deg, #FF6B8A 0%, #FFB547 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFF7F1",
              fontSize: 38,
              fontWeight: 700,
            }}
          >
            G
          </div>
          GlowVa
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "#1F1330",
            fontSize: 96,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          <span>Your skin,</span>
          <span
            style={{
              background:
                "linear-gradient(135deg, #FF6B8A 0%, #FFB547 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            decoded by AI.
          </span>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#7D6B8C" }}>
          AI beauty analysis · From $2.99 · No subscription
        </div>
      </div>
    ),
    { ...size }
  );
}
