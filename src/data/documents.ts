/** Documento oficial listado na seção Documents. */
export type PartyDocument = {
  id: string;
  title: string;
  category: DocumentCategory;
  /** Data ISO (AAAA-MM-DD) de publicação. */
  date: string;
  href: string;
  /** "PDF" abre/baixa o arquivo; "Página" leva ao texto no site. */
  format: "PDF" | "Página";
  /** Tamanho em bytes (apenas PDFs). */
  size?: number;
  description?: string;
};

export const DOCUMENT_CATEGORIES = ["Resoluções", "Programa e Estatuto", "Eleições 2026"] as const;
export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];

const UPLOADS = "https://pcdob.org.br/wp-content/uploads";

/**
 * Seleção editorial de documentos — todos publicados em pcdob.org.br.
 * Curadoria manual de propósito: a biblioteca de mídia do WP mistura PDFs
 * oficiais com arquivos de trabalho (editais estaduais, digitalizações etc.).
 */
export const partyDocuments: PartyDocument[] = [
  {
    id: "resolucao-16-congresso",
    title: "Resolução Política do 16º Congresso",
    category: "Resoluções",
    date: "2025-11-24",
    href: `${UPLOADS}/2025/11/Resolucao_PCdoB_Final_Internet.pdf`,
    format: "PDF",
    size: 1_302_484,
    description: "Documento aprovado pelo 16º Congresso do Partido Comunista do Brasil.",
  },
  {
    id: "regras-tribuna-16-congresso",
    title: "Tribuna de Debates do 16º Congresso — regras",
    category: "Resoluções",
    date: "2025-07-15",
    href: `${UPLOADS}/2025/07/Resolucao-Tribuna-de-Debates_16_Congresso-1-1.pdf`,
    format: "PDF",
    size: 113_298,
  },
  {
    id: "programa",
    title: "Programa do Partido Comunista do Brasil",
    category: "Programa e Estatuto",
    date: "2022-08-20",
    href: "https://pcdob.org.br/programa/",
    format: "Página",
  },
  {
    id: "estatuto",
    title: "Estatuto do PCdoB",
    category: "Programa e Estatuto",
    date: "2022-08-22",
    href: "https://pcdob.org.br/estatuto/",
    format: "Página",
  },
  {
    id: "guia-eleitoral-2026",
    title: "Guia eleitoral 2026 — versão estendida",
    category: "Eleições 2026",
    date: "2026-08-15",
    href: `${UPLOADS}/2026/08/Guia-eleitoral-2026_versao-estendida_final.pdf`,
    format: "PDF",
    size: 9_387_463,
  },
  {
    id: "diretrizes-seguranca-publica-2026",
    title: "Diretrizes do PCdoB para a segurança pública",
    category: "Eleições 2026",
    date: "2026-08-13",
    href: `${UPLOADS}/2026/08/DIRETRIZES_PCdoB_PLEITO-ELEITORAL_2026_SEGURANCA-PUBLICA.pdf`,
    format: "PDF",
    size: 102_619,
  },
  {
    id: "contribuicao-programa-lula-2026",
    title: "Contribuição ao programa de campanha Lula Presidente 2026",
    category: "Eleições 2026",
    date: "2026-08-06",
    href: `${UPLOADS}/2026/06/CONTRIBUICAO-AO-PROGRAMA-DE-CAMPANHA-LULA-PRESIDENTE-2026.pdf`,
    format: "PDF",
    size: 82_188,
  },
];
