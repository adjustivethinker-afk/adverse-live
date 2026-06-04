// Packs `out/` into ../blackgiftcard-public_html.zip with proper
// forward-slash paths so it extracts cleanly on Hostinger's Linux
// File Manager.

import { createWriteStream } from "node:fs";
import { mkdir, readdir, stat } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const SRC = join(here, "..", "out");
const OUT = join(here, "..", "..", "blackgiftcard-public_html.zip");

await stat(SRC).catch(() => {
  console.error("[make-zip] out/ missing — run `npm run build` first.");
  process.exit(1);
});
await mkdir(dirname(OUT), { recursive: true });

// We use the standard archiver-like approach via node:zlib + manual
// ZIP central directory. Easier: spawn PowerShell? No — keep this
// self-contained. We'll dynamically import `archiver` if available,
// otherwise tell the user to install it.

let ZipArchive;
try {
  const mod = await import("archiver");
  ZipArchive = mod.ZipArchive;
} catch {
  console.error(
    "[make-zip] `archiver` is not installed. Run: npm i -D archiver",
  );
  process.exit(1);
}

const out = createWriteStream(OUT);
const archive = new ZipArchive({ zlib: { level: 9 } });

archive.on("warning", (e) => console.warn("[make-zip]", e.message));
archive.on("error", (e) => {
  console.error("[make-zip]", e);
  process.exit(1);
});

archive.pipe(out);

// Manually walk so the names always use forward slashes.
async function add(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      await add(full);
      continue;
    }
    const rel = relative(SRC, full).split(sep).join("/");
    archive.file(full, { name: rel });
  }
}

await add(SRC);
await archive.finalize();
await new Promise((r) => out.on("close", r));

const sz = (await stat(OUT)).size;
console.log(
  `[make-zip] wrote ${OUT}  (${(sz / 1024 / 1024).toFixed(2)} MB)`,
);
