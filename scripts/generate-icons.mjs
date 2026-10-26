/**
 * Gera ícones e a imagem de compartilhamento a partir do logo oficial
 * (public/brand/pcdob-logo.svg).
 *
 *   npm run icons
 *
 * Saídas (convenções do App Router + manifest):
 *   src/app/icon.svg               favicon vetorial (navegadores modernos)
 *   src/app/favicon.ico            16/32/48 px (navegadores antigos, leitores de feed)
 *   src/app/apple-icon.png         180 px (tela inicial do iOS)
 *   src/app/opengraph-image.png    1200×630 — prévia em WhatsApp, X, Facebook, LinkedIn…
 *   public/icons/icon-192.png      manifest
 *   public/icons/icon-512.png      manifest
 *   public/icons/icon-maskable-512.png  manifest (Android, recorte adaptativo)
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const RED = "#D7141A";
const YELLOW = "#FFFF00";
const WHITE = "#FFFFFF";

// O logo oficial tem dois paths: o símbolo (amarelo) e o lettering "PCdoB".
const logoSvg = await readFile(join(ROOT, "public/brand/pcdob-logo.svg"), "utf8");
const [SYMBOL_PATH, WORDMARK_PATH] = [...logoSvg.matchAll(/<path d="([^"]+)"/g)].map((match) => match[1]);
if (!SYMBOL_PATH || !WORDMARK_PATH) throw new Error("Não encontrei os paths do símbolo e do lettering no logo.");

/** Caixas dos desenhos no sistema de coordenadas do logo (viewBox 0 0 176 60). */
const SYMBOL_BOX = { x: 0, y: 0, width: 61.03, height: 59.8 };
const WORDMARK_BOX = { x: 71.02, y: 2.3, width: 104.1, height: 55.2 };

/**
 * Símbolo amarelo centralizado sobre vermelho, numa tela de 64×64.
 * @param {number} scale   fração da tela ocupada pelo símbolo
 * @param {number} radius  raio dos cantos (0 = quadrado, para iOS/maskable)
 */
function iconSvg({ scale, radius }) {
  const factor = (64 * scale) / 62; // o símbolo tem 62×60
  const x = (64 - 62 * factor) / 2;
  const y = (64 - 60 * factor) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="${radius}" fill="${RED}"/><path transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${factor.toFixed(4)})" d="${SYMBOL_PATH}" fill="${YELLOW}"/></svg>\n`;
}

const rounded = iconSvg({ scale: 0.7, radius: 14 });
const square = iconSvg({ scale: 0.7, radius: 0 });
// Maskable: o Android pode recortar até ~20% de cada borda — símbolo dentro da zona segura.
const maskable = iconSvg({ scale: 0.52, radius: 0 });

/**
 * Imagem de compartilhamento: fundo vermelho, símbolo amarelo e "PCdoB"
 * branco empilhados e centralizados (composição da bandeira do partido).
 */
function socialPreviewSvg({ width, height }) {
  const symbolHeight = height * 0.36;
  const wordmarkHeight = height * 0.25;
  const gap = height * 0.07;
  const top = (height - symbolHeight - gap - wordmarkHeight) / 2;

  const place = (box, targetHeight, y) => {
    const scale = targetHeight / box.height;
    const x = (width - box.width * scale) / 2 - box.x * scale;
    return `translate(${x.toFixed(2)} ${(y - box.y * scale).toFixed(2)}) scale(${scale.toFixed(4)})`;
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="${RED}"/><path transform="${place(SYMBOL_BOX, symbolHeight, top)}" d="${SYMBOL_PATH}" fill="${YELLOW}"/><path transform="${place(WORDMARK_BOX, wordmarkHeight, top + symbolHeight + gap)}" d="${WORDMARK_PATH}" fill="${WHITE}"/></svg>`;
}

const png = (svg, size) => sharp(Buffer.from(svg), { density: 72 * (size / 64) }).resize(size, size).png().toBuffer();

/** ICO com imagens PNG embutidas (formato suportado desde o Windows Vista). */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reservado
  header.writeUInt16LE(1, 2); // tipo: ícone
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2); // paleta
    entry.writeUInt8(0, 3); // reservado
    entry.writeUInt16LE(1, 4); // planos
    entry.writeUInt16LE(32, 6); // bits por pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images.map((image) => image.data)]);
}

async function write(path, data) {
  const target = join(ROOT, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, data);
  console.log(`✓ ${path} (${data.length} bytes)`);
}

const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(icoSizes.map(async (size) => ({ size, data: await png(rounded, size) })));

await write("src/app/icon.svg", rounded);
await write("src/app/favicon.ico", buildIco(icoImages));
await write("src/app/apple-icon.png", await png(square, 180));
await write("public/icons/icon-192.png", await png(rounded, 192));
await write("public/icons/icon-512.png", await png(rounded, 512));
await write("public/icons/icon-maskable-512.png", await png(maskable, 512));
await write(
  "src/app/opengraph-image.png",
  await sharp(Buffer.from(socialPreviewSvg({ width: 1200, height: 630 }))).png().toBuffer(),
);
