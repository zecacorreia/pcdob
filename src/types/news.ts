/** Notícia já normalizada — independente da origem (WordPress, CMS headless, mock). */
export type NewsItem = {
  id: number | string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** Data ISO 8601. */
  date: string;
  /** Rota interna da matéria (/noticias/[slug]). */
  href: string;
  image?: {
    src: string;
    alt: string;
  };
};

/** Matéria completa, para a página /noticias/[slug]. */
export type NewsArticle = NewsItem & {
  /** HTML do corpo, já sanitizado. */
  contentHtml: string;
  author?: string;
  /** Data ISO da última edição. */
  modified: string;
  /** Endereço da matéria no site atual (WordPress). */
  sourceUrl: string;
};

export type NewsPage = {
  items: NewsItem[];
  page: number;
  totalPages: number;
};
