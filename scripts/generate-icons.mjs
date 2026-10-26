/**
 * Gera o conjunto de ícones do site a partir do símbolo do PCdoB.
 *
 *   npm run icons
 *
 * Saídas (convenções do App Router + manifest):
 *   src/app/icon.svg           favicon vetorial (navegadores modernos)
 *   src/app/favicon.ico        16/32/48 px (navegadores antigos, leitores de feed)
 *   src/app/apple-icon.png     180 px (tela inicial do iOS)
 *   public/icons/icon-192.png  manifest
 *   public/icons/icon-512.png  manifest
 *   public/icons/icon-maskable-512.png  manifest (Android, recorte adaptativo)
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const RED = "#D7141A";
const YELLOW = "#FFFF00";
const SYMBOL_PATH =
  "M6.224 59.8L0 53.715L13.514 40.224C17.464 43.005 22.294 44.639 27.484 44.639C31.064 44.639 34.504 43.849 37.564 42.454L18.354 23.182L9.244 32.387L0.0190048 23.237L18.384 4.946H36.674L24.464 17.134L44.754 37.508C49.214 33.075 51.864 27.036 51.864 20.254C51.864 11.811 47.634 4.368 41.084 0C52.604 3.248 61.004 13.747 61.004 26.311C61.004 33.929 57.944 40.821 52.924 45.777L61.024 53.743L54.934 59.8L45.944 50.907C42.234 52.761 38.044 53.825 33.604 53.825C27.554 53.825 21.984 51.898 17.434 48.566L6.224 59.8Z";

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
