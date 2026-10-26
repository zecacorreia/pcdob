/**
 * Google Analytics 4. Sem `NEXT_PUBLIC_GA_MEASUREMENT_ID`, o site não rastreia
 * nada e o banner de cookies não é exibido (não há o que consentir).
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
export const ANALYTICS_ENABLED = /^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID);

/** Remove os cookies do GA (_ga, _ga_XXXX) quando o consentimento é revogado. */
export function clearAnalyticsCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host.split(".").slice(-3).join(".")}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (!name?.startsWith("_ga")) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}
