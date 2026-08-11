// Generate the PWA manifest PNG icons (192 & 512) and the browser favicons
// (16 & 32) without any image deps.
//
// Draws the Trimrr mark: a rounded brand-purple tile (#863BFF, matching
// public/favicon.svg) with a white "T". Pure Node (zlib) — no rasterizer.
//
// Run with: node scripts/generate-pwa-icons.mjs
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public");

const PURPLE = [0x86, 0x3b, 0xff, 0xff];
const WHITE = [0xff, 0xff, 0xff, 0xff];

// CRC-32 (IEEE) — PNG chunk integrity.
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const byte of buf) {
    c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
};

const chunk = (type, data) => {
  const typeBuf = Buffer.from(type, "ascii");
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
};

const png = (size) => {
  const radius = Math.round(size * 0.225);
  const insideRoundedRect = (x, y) => {
    const right = size - 1 - radius;
    const bottom = size - 1 - radius;
    const xr = x < radius ? radius : x > right ? right : x;
    const yr = y < radius ? radius : y > bottom ? bottom : y;
    const dx = x - xr;
    const dy = y - yr;
    return dx * dx + dy * dy <= radius * radius;
  };

  // White "T": horizontal cap + vertical stem, centred.
  const inT = (x, y) => {
    const inCap = y >= 0.3 * size && y < 0.42 * size && x >= 0.22 * size && x < 0.78 * size;
    const inStem = x >= 0.44 * size && x < 0.56 * size && y >= 0.3 * size && y < 0.68 * size;
    return inCap || inStem;
  };

  const raw = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++) {
    const rowStart = y * (1 + size * 4);
    raw[rowStart] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const px = rowStart + 1 + x * 4;
      const color = insideRoundedRect(x, y) ? (inT(x, y) ? WHITE : PURPLE) : [0, 0, 0, 0];
      raw.set(color, px);
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
};

mkdirSync(OUT_DIR, { recursive: true });
const targets = [
  [192, "pwa-192x192.png"],
  [512, "pwa-512x512.png"],
  [16, "favicon-16x16.png"],
  [32, "favicon-32x32.png"],
];
for (const [size, name] of targets) {
  const file = join(OUT_DIR, name);
  writeFileSync(file, png(size));
  console.log(`wrote ${file} (${size}x${size})`);
}
