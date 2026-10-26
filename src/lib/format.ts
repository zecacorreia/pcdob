const shortDate = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
const longDate = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/**
 * O WordPress envia a data no fuso do site, sem offset. Lemos só o dia
 * (AAAA-MM-DD) e formatamos em UTC para que servidor e navegador
 * produzam exatamente o mesmo texto (sem erro de hidratação).
 */
export function formatDate(isoDate: string, style: "short" | "long" = "short"): string {
  const [year, month, day] = isoDate.slice(0, 10).split("-").map(Number);
  return (style === "long" ? longDate : shortDate).format(new Date(Date.UTC(year, month - 1, day)));
}
