import type { MetadataRoute } from "next";

import { SITE } from "@/lib/site";

/** Web App Manifest — atalho na tela inicial do celular com ícone e cores da marca. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — ${SITE.legalName}`,
    short_name: SITE.name,
    description: SITE.description,
    lang: "pt-BR",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#110A0A",
    theme_color: "#110A0A",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
