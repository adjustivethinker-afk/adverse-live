// Post-export cleanup for the static `out/` directory.
//
// Next.js generates an `index.txt` file alongside every `index.html`
// page — those are RSC payloads used by the client router for partial
// navigation. On a plain Apache host (Hostinger shared hosting) those
// `.txt` files can accidentally render as the page itself if the
// browser hard-navigates to them, leaving the user staring at raw RSC
// text. We don't need them: every page in this app is "use client" and
// loads a fresh HTML file on navigation.
//
// This script:
//   1. Deletes every `index.txt` from `out/`.
//   2. Reports how many were removed.

import { rm, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const root = join(here, "..", "out");

let deleted = 0;

async function walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      await walk(full);
      continue;
    }
    if (e.name === "index.txt") {
      await rm(full, { force: true });
      deleted += 1;
    }
  }
}

await stat(root).catch(() => {
  console.error("[post-export] out/ does not exist — did `next build` run?");
  process.exit(0);
});

await walk(root);
console.log(`[post-export] removed ${deleted} RSC index.txt file(s)`);
