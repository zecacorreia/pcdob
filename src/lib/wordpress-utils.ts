import sanitizeHtml from "sanitize-html";

import type { NewsArticle, NewsItem } from "@/types/news";

/**
 * Funções puras de normalização do WordPress — separadas de `wordpress.ts`
 * (que é server-only) para poderem ser testadas isoladamente.
 */

type WPRendered = { rendered: string };

type WPMedia = {
  source_url: string;
  alt_text?: string;
};

type WPTerm = { name: string; taxonomy: string };

export type WPPost = {
  id: number;
  slug: string;
  date: string;
  modified?: string;
  link: string;
  title: WPRendered;
  excerpt: WPRendered;
  content?: WPRendered;
  _embedded?: {
    "wp:featuredmedia"?: WPMedia[];
    "wp:term"?: WPTerm[][];
  };
};

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  quot: '"',
  apos: "'",
  lt: "<",
  gt: ">",
  nbsp: " ",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
};

/** O WP devolve títulos com entidades HTML (&#8211;, &amp;...). */
export function decodeEntities(value: string): string {
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === "#") {
      const isHex = code[1]?.toLowerCase() === "x";
      const point = parseInt(code.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      return Number.isNaN(point) ? match : String.fromCodePoint(point);
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match;
  });
}

export function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export function normalizePost(post: WPPost): NewsItem {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const terms = post._embedded?.["wp:term"]?.flat() ?? [];
  const category =
    terms.find((term) => term.taxonomy === "category" && term.name !== "Sem categoria")?.name ?? "Notícias";
  const title = decodeEntities(stripTags(post.title.rendered));
  // Usa o original: o next/image já gera as variantes responsivas.
  const imageSrc = media?.source_url;

  return {
    id: post.id,
    slug: post.slug,
    title,
    excerpt: decodeEntities(stripTags(post.excerpt.rendered)),
    category,
    date: post.date,
    href: `/noticias/${post.slug}`,
    image: imageSrc ? { src: imageSrc, alt: media?.alt_text || title } : undefined,
  };
}

/** Hosts de vídeo/áudio cujos embeds (iframe) são permitidos no corpo da matéria. */
const EMBED_HOSTS = ["www.youtube.com", "youtube.com", "www.youtube-nocookie.com", "player.vimeo.com", "open.spotify.com"];

/**
 * Sanitiza o HTML do WordPress: mantém a formatação editorial e embeds de
 * vídeo confiáveis, remove scripts, estilos inline e atributos de evento.
 */
export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags.filter((tag) => tag !== "h1"),
      "img",
      "figure",
      "figcaption",
      "iframe",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "srcset", "sizes", "alt", "width", "height", "loading"],
      iframe: ["src", "width", "height", "title", "allow", "allowfullscreen"],
      "*": ["id"],
    },
    allowedSchemes: ["https", "http", "mailto"],
    allowedIframeHostnames: EMBED_HOSTS,
    transformTags: {
      // Links externos abrem em nova aba, sem repassar referência.
      a: (tagName, attribs) => {
        const external = /^https?:\/\//i.test(attribs.href ?? "") && !attribs.href?.includes("pcdob.org.br");
        return {
          tagName,
          attribs: external ? { ...attribs, target: "_blank", rel: "noopener noreferrer" } : attribs,
        };
      },
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy" } }),
    },
  });
}

export function normalizeArticle(post: WPPost): NewsArticle {
  const terms = post._embedded?.["wp:term"]?.flat() ?? [];
  const author = terms.find((term) => term.taxonomy === "autor")?.name;

  return {
    ...normalizePost(post),
    contentHtml: sanitizeArticleHtml(post.content?.rendered ?? ""),
    author: author ? decodeEntities(author) : undefined,
    modified: post.modified ?? post.date,
    sourceUrl: post.link,
  };
}

/** Converte "?pagina=3" em número de página válido (>= 1). */
export function parsePageParam(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}
