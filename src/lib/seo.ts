import type { Metadata } from "next";

import { SITE } from "@/lib/site";

/**
 * Campos de Open Graph comuns a todas as páginas. O Next mescla `openGraph`
 * de forma rasa: uma página que define o seu próprio objeto perde o do
 * layout — por isso cada página parte desta base.
 */
export const BASE_OPEN_GRAPH = {
  siteName: SITE.name,
  locale: SITE.locale,
} as const;

/**
 * Imagem padrão (src/app/opengraph-image.png, gerada por `npm run icons`). Precisa ser repetida nas
 * páginas: ao definir `openGraph`, a página deixa de herdar a do layout.
 */
export const DEFAULT_SHARE_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: `${SITE.name} — ${SITE.legalName}`,
} as const;

/** Corta no último espaço antes do limite e acrescenta "…" (descrições de busca). */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:–—-]+$/, "")}…`;
}

type PageMetadataInput = {
  /** Título curto; o layout acrescenta " | PCdoB" na aba. */
  title: string;
  description: string;
  /** Caminho canônico da página, ex.: "/filie-se". */
  path: string;
};

/**
 * Metadata padrão de uma página: título, descrição, URL canônica,
 * Open Graph e cartão do X com os mesmos textos.
 */
export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const fullTitle = `${title} | ${SITE.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...BASE_OPEN_GRAPH,
      type: "website",
      url: path,
      title: fullTitle,
      description,
      images: [DEFAULT_SHARE_IMAGE],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [DEFAULT_SHARE_IMAGE.url] },
  };
}
