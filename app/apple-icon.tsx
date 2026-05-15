import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #FF6B8A 0%, #FFB547 100%)",
          color: "#FFF7F1",
          fontSize: 110,
          fontWeight: 700,
          fontFamily: "serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        G
      </div>
    ),
    { ...size }
  );
}
