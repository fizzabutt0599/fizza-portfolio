import { ImageResponse } from "next/og";

export const alt = "Fizza Bibi — Full Stack Developer, Islamabad";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0b0b0c",
          color: "#f3efe6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28 }}>
          <div style={{ width: 16, height: 16, borderRadius: 16, background: "#c6ff3d" }} />
          Available for exciting opportunities
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>Fizza Bibi</div>
          <div style={{ fontSize: 44, color: "#c6ff3d", marginTop: 20 }}>Full Stack Developer</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#a3a09a" }}>
          <span>React · Next.js · TypeScript · WordPress · Laravel</span>
          <span>Islamabad, Pakistan</span>
        </div>
      </div>
    ),
    size,
  );
}
