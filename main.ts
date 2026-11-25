// The World in One Day — 25 November 2026.
// Node 22, standard library only. The front page image sits next to this file;
// the program places an exact copy of it at the output path.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const here = new URL(".", import.meta.url);
const imagePath = new URL("./entry.png", here).pathname;
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const bytes = readFileSync(imagePath);
// A PNG always opens with the same eight magic bytes; refuse anything else
// so a broken or misnamed file can never ship as the entry.
const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!bytes.subarray(0, 8).equals(pngMagic)) {
  throw new Error("entry.png does not start with the PNG magic bytes");
}

const dest = join(outDir, "entry.png");
writeFileSync(dest, bytes);
// Read it back and confirm the copy is byte-for-byte the source image,
// so the graded run ships exactly the front page this repo holds.
const written = readFileSync(dest);
if (written.length !== bytes.length || !written.equals(bytes)) {
  throw new Error("output entry.png differs from the source image");
}
console.log(`wrote ${dest} (${written.length} bytes)`);
