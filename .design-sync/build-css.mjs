#!/usr/bin/env node
// Design-sync stylesheet builder (cfg.buildCmd). Compiles the app's Tailwind v4
// globals (scoped to the synced components + authored previews) into a static
// stylesheet, then ships the brand fonts: next/font loads them at runtime in the
// app, so the bundle must carry its own @font-face + --font-* vars or every card
// falls back to Georgia/system-ui. Output: .design-sync/.cache/ds-tailwind.css
// (cfg.cssEntry). Re-run automatically by the resync driver before conversion.
import { spawnSync } from 'node:child_process';
import { appendFileSync, copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DS = dirname(fileURLToPath(import.meta.url)); // .design-sync
const REPO = dirname(DS);
const CACHE = join(DS, '.cache');
const OUT = join(CACHE, 'ds-tailwind.css');
const FONTS_SRC = join(CACHE, 'fonts-src');
mkdirSync(FONTS_SRC, { recursive: true });

// 1. Compile Tailwind.
const cli = join(REPO, 'node_modules', '@tailwindcss', 'cli', 'dist', 'index.mjs');
if (!existsSync(cli)) {
  console.error('[build-css] @tailwindcss/cli not installed. Run: npm i --no-save @tailwindcss/cli');
  process.exit(1);
}
const r = spawnSync(process.execPath, [cli, '-i', join(DS, 'ds-input.css'), '-o', OUT], {
  cwd: REPO, stdio: 'inherit',
});
if (r.status !== 0) process.exit(r.status ?? 1);

// 2. Ship brand fonts (next/font families, loaded at runtime in the app).
// [family, weightDescriptor, srcRelativeToPublicFonts, safeBasename]
const FONTS = [
  ['Chillax', '100 900', 'Chillax/Chillax Variable.woff2', 'Chillax-Variable.woff2'],
  ['Cabinet Grotesk', '100 900', 'Cabinet/Cabinet Grotesk Variable.woff2', 'CabinetGrotesk-Variable.woff2'],
  ['Posterama Text', '400', 'PosteramaText/PosteramaText-Regular.woff2', 'PosteramaText-Regular.woff2'],
  ['Posterama Text', '700', 'PosteramaText/PosteramaText-Bold.woff2', 'PosteramaText-Bold.woff2'],
  ['Posterama 2001', '400', 'Posterama2001W04/Posterama2001W04-Regular.woff2', 'Posterama2001-Regular.woff2'],
  ['Posterama 2001', '600', 'Posterama2001W04/Posterama2001W04-SemiBold.woff2', 'Posterama2001-SemiBold.woff2'],
  ['Posterama 2001', '700', 'Posterama2001W04/Posterama2001W04-Bold.woff2', 'Posterama2001-Bold.woff2'],
  ['Posterama 2001', '900', 'Posterama2001W04/Posterama2001W04-Black.woff2', 'Posterama2001-Black.woff2'],
];

const faces = [];
for (const [family, weight, src, safe] of FONTS) {
  const from = join(REPO, 'public', 'fonts', src);
  if (!existsSync(from)) { console.error(`[build-css] missing font ${src} — skipped`); continue; }
  copyFileSync(from, join(FONTS_SRC, safe));
  faces.push(
    `@font-face {\n` +
    `  font-family: '${family}';\n` +
    `  font-weight: ${weight};\n` +
    `  font-style: normal;\n` +
    `  font-display: swap;\n` +
    `  src: url('./fonts-src/${safe}') format('woff2');\n` +
    `}`,
  );
}

// 3. Map the app's --font-* variables (set by next/font at runtime) onto the
//    shipped families, so the @utility font-* helpers resolve.
const rootVars =
  `:root {\n` +
  `  --font-display: 'Chillax', Georgia, serif;\n` +
  `  --font-body: 'Cabinet Grotesk', system-ui, sans-serif;\n` +
  `  --font-secondary: 'Posterama Text', Georgia, serif;\n` +
  `  --font-accent: 'Posterama 2001', 'Times New Roman', serif;\n` +
  `}`;

appendFileSync(OUT, `\n/* ── design-sync brand fonts ─────────────────────────── */\n${faces.join('\n')}\n${rootVars}\n`);
console.error(`[build-css] wrote ${OUT} + ${faces.length} @font-face rule(s)`);
