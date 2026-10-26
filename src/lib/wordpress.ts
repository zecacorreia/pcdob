import "server-only";

import { fallbackNews } from "@/data/news-fallback";
import { normalizeArticle, normalizePost, type WPPost } from "@/lib/wordpress-utils";
import type { NewsArticle, NewsItem, NewsPage } from "@/types/news";

/**
 * Camada de dados do WordPress atual. O site novo funciona como front-end
 * headless: o conteúdo continua sendo publicado no WP e é lido via REST API.
 */
const WP_API_URL = process.env.WORDPRESS_API_URL ?? "https://pcdob.org.br/wp-json/wp/v2";

/** Revalidação ISR (em segundos) das notícias. */
const NEWS_REVALIDATE = 300;

const LIST_FIELDS = "id,slug,date,link,title,excerpt,_links,_embedded";
const ARTICLE_FIELDS = "id,slug,date,modified,link,title,excerpt,content,_links,_embedded";

async function wpFetch(path: string, params: Record<string, string>) {
  const res = await fetch(`${WP_API_URL}${path}?${new URLSearchParams(params)}`, {
    next: { revalidate: NEWS_REVALIDATE, tags: ["news"] },
  });
  return res;
}

/**
 * Busca as últimas notícias publicadas. Em caso de falha da API, devolve o
 * conteúdo de reserva para que a home nunca quebre.
 */
export async function getLatestNews(limit = 5): Promise<NewsItem[]> {
  try {
    const res = await wpFetch("/posts", {
      per_page: String(limit),
      _embed: "wp:featuredmedia,wp:term",
      _fields: LIST_FIELDS,
    });
    if (!res.ok) throw new Error(`WordPress respondeu ${res.status}`);
    return ((await res.json()) as WPPost[]).map(normalizePost);
  } catch (error) {
    console.error("[wordpress] Falha ao buscar notícias, usando fallback:", error);
    return fallbackNews.slice(0, limit);
  }
}

/**
 * Página da listagem /noticias. Retorna `null` se a página não existir
 * (o WP responde 400 para páginas além do total).
 */
export async function getNewsPage(page: number, perPage = 10): Promise<NewsPage | null> {
  try {
    const res = await wpFetch("/posts", {
      page: String(page),
      per_page: String(perPage),
      _embed: "wp:featuredmedia,wp:term",
      _fields: LIST_FIELDS,
    });
    if (res.status === 400) return null;
    if (!res.ok) throw new Error(`WordPress respondeu ${res.status}`);

    const totalPages = Number(res.headers.get("x-wp-totalpages") ?? "1");
    return { items: ((await res.json()) as WPPost[]).map(normalizePost), page, totalPages };
  } catch (error) {
    console.error("[wordpress] Falha ao buscar a listagem:", error);
    return page === 1 ? { items: fallbackNews, page: 1, totalPages: 1 } : null;
  }
}

/** Matéria completa pelo slug — `null` quando não existe. */
export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    const res = await wpFetch("/posts", {
      slug,
      _embed: "wp:featuredmedia,wp:term",
      _fields: ARTICLE_FIELDS,
    });
    if (!res.ok) throw new Error(`WordPress respondeu ${res.status}`);
    const [post] = (await res.json()) as WPPost[];
    return post ? normalizeArticle(post) : null;
  } catch (error) {
    console.error(`[wordpress] Falha ao buscar a matéria "${slug}":`, error);
    return null;
  }
}

/** Slugs e datas das matérias mais recentes, para o sitemap. */
export async function getSitemapEntries(limit = 100): Promise<{ slug: string; modified: string }[]> {
  try {
    const res = await wpFetch("/posts", { per_page: String(limit), _fields: "slug,modified" });
    if (!res.ok) throw new Error(`WordPress respondeu ${res.status}`);
    return (await res.json()) as { slug: string; modified: string }[];
  } catch (error) {
    console.error("[wordpress] Falha ao montar o sitemap:", error);
    return [];
  }
}
