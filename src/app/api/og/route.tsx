import { ImageResponse } from "next/og";

export const runtime = "edge";

// Brand palette
const NAVY = "#000000";
const NAVY2 = "#0c0c0d";
const GOLD = "#c79a4b";
const GOLD_LIGHT = "#e0c483";
const CREAM = "#f4efe4";

// Load the display serif once (cached by the platform). Graceful fallback.
async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(
      "https://cdn.jsdelivr.net/fontsource/fonts/cormorant-garamond@latest/latin-600-normal.ttf",
    );
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

/**
 * Branded Open Graph image. Usage:
 *   /api/og?title=The%20Witness&subtitle=Now%20Showing&badge=Film
 * Returns a 1200x630 PNG in the navy/gold light-into-dark style.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? "Uriel Maforikan Productions").slice(0, 90);
  const subtitle =
    (searchParams.get("subtitle") ?? "Evangelists who carry cameras").slice(0, 120);
  const badge = searchParams.get("badge")?.slice(0, 30) ?? null;

  const font = await loadFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: `radial-gradient(120% 90% at 75% 0%, ${NAVY2} 0%, ${NAVY} 70%)`,
          position: "relative",
        }}
      >
        {/* Gold light shaft */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "180px",
            width: "260px",
            height: "900px",
            transform: "rotate(18deg)",
            background: `linear-gradient(180deg, rgba(224,196,131,0) 0%, rgba(224,196,131,0.22) 45%, rgba(199,154,75,0.28) 60%, rgba(224,196,131,0) 100%)`,
            filter: "blur(40px)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "420px",
            width: "160px",
            height: "850px",
            transform: "rotate(14deg)",
            background: `linear-gradient(180deg, rgba(224,196,131,0) 0%, rgba(224,196,131,0.16) 50%, rgba(224,196,131,0) 100%)`,
            filter: "blur(50px)",
            display: "flex",
          }}
        />

        {/* Top row: wordmark + badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              fontSize: "22px",
              letterSpacing: "6px",
              textTransform: "uppercase",
              color: GOLD,
            }}
          >
            Uriel Maforikan Productions
          </div>
          {badge && (
            <div
              style={{
                display: "flex",
                padding: "8px 20px",
                borderRadius: "999px",
                border: `1px solid ${GOLD}66`,
                color: GOLD_LIGHT,
                fontSize: "20px",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              {badge}
            </div>
          )}
        </div>

        {/* Title block */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "900px" }}>
          <div
            style={{
              display: "flex",
              fontFamily: font ? "Cormorant" : "serif",
              fontSize: title.length > 40 ? "76px" : "104px",
              lineHeight: 1.02,
              color: CREAM,
              fontWeight: 600,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "28px",
              fontSize: "30px",
              color: "#cfc8b8",
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Bottom rule */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", width: "60px", height: "2px", background: GOLD }} />
          <div style={{ display: "flex", color: "#9b9484", fontSize: "20px", fontStyle: "italic" }}>
            Light into dark.
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: font
        ? [{ name: "Cormorant", data: font, style: "normal", weight: 600 }]
        : undefined,
    },
  );
}
