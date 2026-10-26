import { SOCIAL_LINKS } from "@/lib/navigation";

/** Dados institucionais usados em metadata, JSON-LD, sitemap e OG images. */
export const SITE = {
  name: "PCdoB",
  legalName: "Partido Comunista do Brasil",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://pcdob.org.br").replace(/\/$/, ""),
  description:
    "Partido Comunista do Brasil: notícias, história, lideranças, documentos e resoluções. Por soberania, democracia, direitos e socialismo.",
  foundingDate: "1922-03-25",
  locale: "pt_BR",
  sameAs: SOCIAL_LINKS.map((social) => social.href),
} as const;

/** URL absoluta a partir de um caminho do site. */
export function absoluteUrl(path = "/"): string {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
