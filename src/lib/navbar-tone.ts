/**
 * "Tom" do navbar: sobre fundo escuro usa texto claro; sobre fundo claro
 * (páginas em `paper`, como /noticias) usa texto escuro. O tom é descoberto
 * lendo a cor de fundo do que está atrás do navbar — nenhuma página precisa
 * declarar nada.
 */
export type NavTone = "dark" | "light";

/**
 * Rotas cujo topo é claro. Serve só de palpite para o HTML do servidor, que não
 * enxerga a tela: sem ele o navbar apareceria branco sobre branco até a
 * hidratação. Depois disso, quem decide é a leitura real do fundo.
 */
export const LIGHT_TOP_PATHS = ["/noticias", "/privacidade"];

export function guessToneForPath(pathname: string): NavTone {
  return LIGHT_TOP_PATHS.includes(pathname) ? "light" : "dark";
}

function parseChannel(value: string): number {
  return value.endsWith("%") ? (parseFloat(value) / 100) * 255 : parseFloat(value);
}

function parseAlpha(value: string | undefined): number {
  if (value === undefined) return 1;
  return value.endsWith("%") ? parseFloat(value) / 100 : parseFloat(value);
}

/**
 * Luminância relativa (WCAG, 0 a 1) de uma cor computada "rgb()"/"rgba()".
 * Devolve `null` para cores transparentes ou em formatos que não entendemos —
 * quem chama então segue procurando no elemento pai.
 */
export function luminanceOf(color: string): number | null {
  const match = color.match(/rgba?\(([^)]+)\)/);
  if (!match) return null;

  const parts = match[1].split(/[\s,/]+/).filter(Boolean);
  const [r, g, b] = parts.slice(0, 3).map(parseChannel);
  const alpha = parseAlpha(parts[3]);
  if ([r, g, b, alpha].some(Number.isNaN) || alpha < 0.5) return null;

  const linear = (channel: number) => {
    const s = channel / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** Acima disso, texto escuro tem mais contraste que texto claro. */
const LIGHT_THRESHOLD = 0.4;

/**
 * Tom do fundo que aparece em (x, y), ignorando o próprio navbar. Sobe pela
 * árvore a partir do elemento no topo até achar uma cor de fundo opaca.
 */
export function sampleBackgroundTone(x: number, y: number, ignore: Element | null): NavTone {
  const element = document.elementsFromPoint(x, y).find((el) => !ignore || !(el === ignore || ignore.contains(el)));

  for (let node: Element | null = element ?? null; node; node = node.parentElement) {
    const luminance = luminanceOf(getComputedStyle(node).backgroundColor);
    if (luminance !== null) return luminance > LIGHT_THRESHOLD ? "light" : "dark";
  }
  return "dark";
}
