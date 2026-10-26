import { ImageResponse } from "next/og";

/** Imagem padrão de compartilhamento (WhatsApp, X, Facebook...) do site todo. */
export const alt = "PCdoB — Partido Comunista do Brasil";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SYMBOL_PATH =
  "M6.224 59.8L0 53.715L13.514 40.224C17.464 43.005 22.294 44.639 27.484 44.639C31.064 44.639 34.504 43.849 37.564 42.454L18.354 23.182L9.244 32.387L0.0190048 23.237L18.384 4.946H36.674L24.464 17.134L44.754 37.508C49.214 33.075 51.864 27.036 51.864 20.254C51.864 11.811 47.634 4.368 41.084 0C52.604 3.248 61.004 13.747 61.004 26.311C61.004 33.929 57.944 40.821 52.924 45.777L61.024 53.743L54.934 59.8L45.944 50.907C42.234 52.761 38.044 53.825 33.604 53.825C27.554 53.825 21.984 51.898 17.434 48.566L6.224 59.8Z";

/**
 * Baixa a Archivo Black só com os caracteres usados (o gerador de imagens não
 * lê as fontes do next/font). Se falhar, a imagem sai com a fonte padrão.
 */
async function loadDisplayFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Archivo+Black&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    const res = await fetch(url);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

const TAGLINE = "Partido Comunista do Brasil — desde 1922";
// Todo texto da imagem precisa estar aqui: a fonte vem só com esses caracteres.
const TEXT = `PCdoB O FUTURO SE CONSTRÓI NA LUTA. ${TAGLINE}`;

export default async function OpengraphImage() {
  const font = await loadDisplayFont(TEXT);
  const display = font ? "Archivo Black" : undefined;

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
          background: "#D7141A",
          color: "#F6F2EC",
          position: "relative",
        }}
      >
        <svg
          width="560"
          height="542"
          viewBox="0 0 62 60"
          style={{ position: "absolute", right: -60, bottom: -80, opacity: 0.18 }}
        >
          <path d={SYMBOL_PATH} fill="#110A0A" />
        </svg>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="84" height="81" viewBox="0 0 62 60">
            <path d={SYMBOL_PATH} fill="#FFFF00" />
          </svg>
          <div style={{ fontSize: 44, fontFamily: display, letterSpacing: -1 }}>PCdoB</div>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", fontSize: 96, fontFamily: display, lineHeight: 0.95, letterSpacing: -3 }}
        >
          <span>O FUTURO SE</span>
          <span>CONSTRÓI NA</span>
          <span style={{ color: "#FFD400" }}>LUTA.</span>
        </div>
        <div style={{ fontSize: 26, fontFamily: display, opacity: 0.85 }}>{TAGLINE}</div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Archivo Black", data: font, weight: 400, style: "normal" }] : undefined },
  );
}
