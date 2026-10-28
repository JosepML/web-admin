import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Josep Mira Lozano · Director de fotografía, filmmaker y editor";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 84px",
          backgroundColor: "#08080a",
          backgroundImage:
            "radial-gradient(circle at 82% 20%, rgba(229, 9, 20, 0.34), transparent 52%), radial-gradient(circle at 18% 85%, rgba(255, 255, 255, 0.08), transparent 48%)",
          color: "#f5f5f7",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#a1a1aa",
          }}
        >
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "999px",
              backgroundColor: "#e50914",
            }}
          />
          Portfolio y servicios audiovisuales
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "76px",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.04,
            }}
          >
            Josep Mira Lozano
          </div>
          <div
            style={{
              fontSize: "34px",
              fontWeight: 500,
              color: "#d4d4d8",
              letterSpacing: "-0.01em",
            }}
          >
            Director de fotografía, filmmaker y editor
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.14)",
            paddingTop: "28px",
            fontSize: "22px",
            color: "#a1a1aa",
          }}
        >
          <span>Dirección de fotografía · Filmmaker · Edición</span>
          <span style={{ color: "#f5f5f7", fontWeight: 600 }}>Alicante · España</span>
        </div>
      </div>
    ),
    size,
  );
}
