import { SOCIAL_LINKS } from "@/lib/navigation";

/** Domínio oficial — usado só quando nenhuma variável indica onde o site está publicado. */
const OFFICIAL_URL = "https://pcdob.org.br";

/**
 * URL pública do site, usada em canonical, og:url, og:image e sitemap.
 *
 * Tem que ser o endereço onde o site está de fato no ar: o WhatsApp e as
 * redes buscam a imagem de compartilhamento nessa URL. Ordem de prioridade:
 *   1. NEXT_PUBLIC_SITE_URL — definida manualmente (domínio próprio)
 *   2. domínio de produção da Vercel (variável de sistema)
 *   3. URL do deploy da Vercel (previews)
 *   4. domínio público da Railway
 *   5. domínio oficial
 */
export function resolveSiteUrl(env: Record<string, string | undefined> = process.env): string {
  const withProtocol = (host: string) => (/^https?:\/\//.test(host) ? host : `https://${host}`);
  const candidate =
    env.NEXT_PUBLIC_SITE_URL ||
    (env.VERCEL_ENV === "production" && env.VERCEL_PROJECT_PRODUCTION_URL) ||
    env.VERCEL_URL ||
    env.RAILWAY_PUBLIC_DOMAIN ||
    OFFICIAL_URL;
  return withProtocol(candidate.trim()).replace(/\/+$/, "");
}

/** Dados institucionais usados em metadata, JSON-LD, sitemap e OG images. */
export const SITE = {
  name: "PCdoB",
  legalName: "Partido Comunista do Brasil",
  url: resolveSiteUrl(),
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
