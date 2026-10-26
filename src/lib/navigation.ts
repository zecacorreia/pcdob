/**
 * Links principais — compartilhados entre Navbar, menu e Footer.
 * As âncoras usam "/#..." para funcionarem também fora da home.
 */
export const NAV_LINKS = [
  { label: "Notícias", href: "/noticias" },
  { label: "O Partido", href: "/o-partido" },
  { label: "Lideranças", href: "/#liderancas" },
  { label: "Documentos", href: "/#documentos" },
] as const;

export const JOIN_LINK = { label: "Filie-se", href: "/filie-se" } as const;

/** Plataforma oficial de filiação (a mesma usada pelo site atual). */
export const MEMBERSHIP_URLS = {
  join: "https://pcdobdigital.org.br/autenticacao/filiacao",
  updateData: "https://pcdobdigital.org.br/filiados/usuario/editar",
} as const;

/** Mapa do site do rodapé. Links externos apontam para páginas do site atual. */
export const FOOTER_SITEMAP = [
  {
    title: "Partido",
    links: [
      { label: "O Partido", href: "/o-partido" },
      { label: "Programa", href: "https://pcdob.org.br/programa/" },
      { label: "Estatuto", href: "https://pcdob.org.br/estatuto/" },
      { label: "Lideranças", href: "/#liderancas" },
    ],
  },
  {
    title: "Conteúdo",
    links: [
      { label: "Notícias", href: "/noticias" },
      { label: "Documentos", href: "/#documentos" },
      { label: "16º Congresso", href: "https://pcdob.org.br/16o-congresso/" },
      { label: "Eleições 2026", href: "https://pcdob.org.br/eleicoes-2026/" },
    ],
  },
  {
    title: "Participe",
    links: [
      { label: "Filie-se", href: "/filie-se" },
      { label: "Atualizar cadastro", href: MEMBERSHIP_URLS.updateData },
      { label: "Newsletter", href: "#newsletter" },
    ],
  },
] as const;

/** Perfis oficiais (os mesmos linkados em pcdob.org.br). */
export const SOCIAL_LINKS = [
  { label: "Instagram", handle: "@pcdob_oficial", href: "https://www.instagram.com/pcdob_oficial/", icon: "instagram" },
  { label: "X", handle: "@pcdob_oficial", href: "https://x.com/pcdob_oficial", icon: "x" },
  { label: "TikTok", handle: "@pcdob_oficial", href: "https://www.tiktok.com/@pcdob_oficial", icon: "tiktok" },
  { label: "Facebook", handle: "/pcdob65", href: "https://www.facebook.com/pcdob65/", icon: "facebook" },
  {
    label: "YouTube",
    handle: "PCdoB Oficial",
    href: "https://www.youtube.com/channel/UCd8GdGfoFQ2-e-PohPTyzGw",
    icon: "youtube",
  },
] as const;

export type SocialIcon = (typeof SOCIAL_LINKS)[number]["icon"];
