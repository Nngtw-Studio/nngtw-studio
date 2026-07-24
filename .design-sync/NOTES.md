# design-sync notes — Nngtw Studio

This repo is a **Next.js app**, not a component-library package, synced as the reusable-UI design system. Scope: `src/components/{ui,effects,motion}` + `src/registry/**` (17 components). Admin/api/sections/layout are intentionally excluded.

## How the build is wired (non-obvious)

- **No dist → hand-written barrel entry.** `cfg.entry = .design-sync/entry.tsx` re-exports exactly the scoped 17 (TargetCursor is a `default` export → re-exported named). `cfg.componentSrcMap` registers each name→src (there is no `.d.ts` tree, so discovery needs it).
- **`.d.ts` props are hand-written** in `cfg.dtsPropsFor` (no built types to extract from). Keep them in sync with the source interfaces if props change.
- **`next/link` is aliased to a shim** (`.design-sync/shims/next-link.tsx`, a plain `<a>`) via `.design-sync/tsconfig.build.json` `paths`. Claude Design's runtime has no Next router; the real `next/link` pulls `process.env.__NEXT_*` and throws at bundle load. **GOTCHA:** never put a `"//"` comment key in `tsconfig.build.json` — the converter's `tsconfigPathsPlugin` strips `//` line comments and mangles that line, silently dropping ALL path aliases (then esbuild falls back to the repo `tsconfig.json`, which has no `next/link` alias, and the real Next link leaks in). If components adopt other `next/*` imports (next/navigation, next/image), add matching aliases here.
- **Tailwind v4 is compiled to static CSS** by `cfg.buildCmd = node .design-sync/build-css.mjs`. It runs `@tailwindcss/cli` over `.design-sync/ds-input.css` (which `@import`s the app globals and `@source`s the scoped components + `previews/`), then appends `@font-face` + `:root --font-*` for the four brand faces. Output `.design-sync/.cache/ds-tailwind.css` = `cfg.cssEntry`.
- **`@tailwindcss/cli` is installed `--no-save`** (not in package.json). Fresh clone must run `npm i --no-save @tailwindcss/cli@<tailwindcss version>` or build-css.mjs exits with a clear error.
- **Fonts** are local woff2 under `public/fonts/` (next/font families). `build-css.mjs` copies them with safe names and emits `@font-face`. If font files move/rename, update the `FONTS` array in build-css.mjs.
- **`@theme inline` quirk:** brand `--color-*` vars are only emitted to `:root` when referenced via `var()` somewhere; utilities inline the literal. So `--color-brand-secondary/orange-dark/grey/muted` have NO `:root` var, but their utility classes (`bg-brand-secondary`, etc.) exist. Style with the **utility classes**, not `var(--color-brand-*)`.
- **No Tailwind at design time.** Claude Design ships static CSS only — the agent can use only classes already in `_ds_bundle.css`. Tailwind's whole-repo auto-detection makes that set comprehensive today (all common layout/spacing/type utilities the app uses), but `text-brand-orange-dark` and `bg-brand-muted` are absent (unused app-wide).
- **Playwright 1.61.0** pins chromium build 1228 (matches the machine cache). Installed into `.ds-sync/` with browser download skipped.

## Floor cards (10 — deliberate, not failures)

These can't render meaningfully in a static headless capture, so they ship the honest floor card:
- **Scroll/viewport entrance** (start hidden, reveal on scroll — never fires in capture): `FadeIn`, `StaggerContainer`, `StaggerItem`, `GsapReveal`, `GsapParallax`, `ParallaxSection`. Note: `TextReveal` DOES render (no `-80px` viewport margin) and is authored; `FadeIn`/`StaggerContainer` use `viewport={{ margin: "-80px" }}` which never satisfies in a small card.
- **Cursor overlays** (`position: fixed`, need real mouse movement): `AdaptiveCursor`, `SmoothCursor`, `TargetCursor`.
- **`RippleLayer`** — click-ripple overlay whose animation ends at opacity 0; nothing to freeze statically.

Authored + graded good (7): Button, CtaButton, Dino404, Glitch404, MagneticButton, AmbientField, TextReveal. `AmbientField` is intentionally subtle (a faint particle field on brand-bg).

## Known render warns
None — validate exits clean (0 bad / 0 thin / 0 variantsIdentical).

## Re-sync risks (watch-list)
- Fresh clone: re-run `npm i --no-save @tailwindcss/cli` and re-copy `.ds-sync/` (staged scripts) before the driver, or buildCmd/converter fail.
- The compiled `_ds_bundle.css` depends on the **whole app's** utility usage (Tailwind auto-detect). If the app deletes usages, some utilities could drop out; comprehensive as of this sync.
- `dtsPropsFor` is hand-maintained — a source prop change won't propagate to the `.d.ts` automatically.
- Floor-card components remain the standing offer for incremental authoring, but scroll/cursor ones are inherently hard to render statically.
