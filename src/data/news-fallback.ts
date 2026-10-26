import type { NewsItem } from "@/types/news";

/**
 * Conteúdo de reserva, exibido apenas se a API do WordPress estiver fora do ar.
 * Manchetes publicadas em pcdob.org.br em outubro de 2026.
 */
export const fallbackNews: NewsItem[] = [
  {
    id: 140371,
    slug: "lula-supera-flavio-bolsonaro-conquista-vitoria-epica-e-sera-presidente-pela-4a-vez",
    title: "Lula supera Flávio Bolsonaro, conquista vitória épica e será presidente pela 4ª vez",
    excerpt: "",
    category: "Notícias",
    date: "2026-10-26T15:30:53",
    href: "/noticias/lula-supera-flavio-bolsonaro-conquista-vitoria-epica-e-sera-presidente-pela-4a-vez",
  },
  {
    id: "fallback-2",
    slug: "tesouraco-de-flavio-vai-gerar-desemprego-e-recessao",
    title: "Tesouraço de Flávio vai gerar desemprego e recessão já em 2027, diz Dieese",
    excerpt: "",
    category: "Artigos Parceiros",
    date: "2026-10-22T20:37:56",
    href: "/noticias/tesouraco-de-flavio-vai-gerar-desemprego-e-recessao",
  },
  {
    id: "fallback-3",
    slug: "flavio-bolsonaro-quer-a-presidencia-para-enterrar-investigacoes",
    title: "Flávio Bolsonaro quer a presidência para enterrar investigações",
    excerpt: "",
    category: "Artigos Parceiros",
    date: "2026-10-22T14:33:00",
    href: "/noticias/flavio-bolsonaro-quer-a-presidencia-para-enterrar-investigacoes",
  },
  {
    id: "fallback-4",
    slug: "lula-cresce-entre-beneficiarios-do-bolsa-familia",
    title: "Lula cresce e tem 62% das intenções de voto entre beneficiários do Bolsa Família",
    excerpt: "",
    category: "Artigos Parceiros",
    date: "2026-10-21T20:30:29",
    href: "/noticias/lula-cresce-entre-beneficiarios-do-bolsa-familia",
  },
  {
    id: "fallback-5",
    slug: "carta-cobra-checagem-de-falas-em-tempo-real",
    title: "Carta cobra checagem de falas em tempo real em debate com presidenciáveis",
    excerpt: "",
    category: "Artigos Parceiros",
    date: "2026-10-21T17:28:00",
    href: "/noticias/carta-cobra-checagem-de-falas-em-tempo-real",
  },
];
