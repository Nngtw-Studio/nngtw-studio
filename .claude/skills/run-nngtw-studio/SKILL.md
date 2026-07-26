---
name: run-nngtw-studio
description: Build, run, lint, and drive the NNGTW Studio Next.js marketing site. Use when asked to start the site, run its dev server, build it, lint it, or take a screenshot of a page/section.
---

Next.js 15 (App Router) marketing site. There's no test suite and no
`chromium-cli` in this environment — it's driven by a small Playwright
script, `.claude/skills/run-nngtw-studio/driver.mjs`, that reads a
newline-delimited command script from stdin (same idiom as
`chromium-cli`: `nav` / `wait-for` / `click` / `fill` / `screenshot`)
against a `next dev` server you start yourself.

All paths below are relative to the repo root (`nngtwS/`).

**Verified on:** Windows 11, Git Bash (MINGW64), Node v24.18.0, npm
10.7.0. There is no Linux/macOS variant of this skill — every command
below was actually run on Windows this session. `apt-get` does not
apply; skip straight to Setup.

## Setup

```bash
npm install
```

Playwright itself is deliberately **not** a tracked dependency (kept
out of `package.json`/`package-lock.json` on purpose, so the site's own
manifest stays free of a dev-only browser-automation package). Install
it side-by-side after `npm install`, not before — see Gotchas:

```bash
npm install --no-save playwright
npx playwright install chromium   # no-op + no output if already cached
```

## Build

```bash
npm run build
```

Verified clean: compiles, prerenders `/news` and every other static
route, no errors. Not required for the agent path below (`next dev`
doesn't need a prior build) — this is here for a pre-deploy sanity
check.

## Run (agent path)

1. **Start the dev server in the background** and wait for it to report
   ready (don't fixed-`sleep` — poll the log):

   ```bash
   npm run dev > /tmp/nngtw-dev.log 2>&1 &
   disown
   timeout 30 bash -c 'until grep -q "Ready in" /tmp/nngtw-dev.log 2>/dev/null; do sleep 1; done'
   cat /tmp/nngtw-dev.log
   ```

   Read the actual port from the log — **see Gotchas, it drifts.**

2. **Drive it** with the script, piping a command list to stdin:

   ```bash
   node .claude/skills/run-nngtw-studio/driver.mjs http://localhost:3001 <<'EOF'
   nav /news
   wait-for text=Notes from the headset
   screenshot news-hero
   scroll-to #xr
   screenshot news-xr
   console-errors
   EOF
   ```

   Each invocation launches its own headless Chromium and tears it down
   at EOF — there's no persistent session/tmux wrapping needed (no
   `tmux` in this environment anyway; the browser launch itself is the
   only overhead, a couple seconds).

3. **Screenshots** land in
   `.claude/skills/run-nngtw-studio/shots/<name>.png`. **Actually open
   them** (e.g. via the Read tool) — don't just check the command
   exited 0.

4. **Stop the server** (Windows has no `lsof`; use `netstat` + `taskkill`):

   ```bash
   netstat -ano | grep ':3001' | grep LISTENING   # → trailing column is the PID
   taskkill //PID <that-pid> //F
   ```

   `$!` right after `npm run dev &` is only the `npm` wrapper's PID —
   npm doesn't forward the kill to the `next-server` child, so killing
   `$!` leaves the port held. Killing the port's actual listener (found
   via `netstat`) is what actually frees it.

### Driver commands

| command | what it does |
|---|---|
| `nav <path\|url>` | goto `baseUrl` + path, or an absolute URL; waits for `networkidle` |
| `wait-for text=<substr>` | wait for a text node containing `<substr>` |
| `wait-for sel=<selector>` | wait for a CSS selector to appear |
| `scroll-to <selector>` | `scrollIntoViewIfNeeded()` on the first match (use `#section-id`) |
| `click <selector>` | click the first match |
| `fill <selector> <text>` | fill an input through Playwright's pipeline (fires React `onChange`) |
| `press <key>` | press a key, e.g. `Enter` |
| `screenshot [name]` | save `shots/<name>.png` (auto-named if omitted) |
| `console-errors` | print every `console.error`/`pageerror` seen so far, as JSON |

## Run (human path)

```bash
npm run dev   # → http://localhost:3000 (or next free port). Ctrl-C to stop.
```

Open it in a real browser. The intro splash (see Gotchas) plays fully
for a human — that's intended.

## Lint

```bash
npm run lint
```

Verified: passes with pre-existing warnings only (a handful of
`no-img-element` and one `exhaustive-deps` warning, none in code this
skill's driver touches) — no errors, exit 0. There is no separate unit
test suite (`package.json` has no `test` script).

---

## Gotchas

- **Plain `npm install` deletes the side-loaded `playwright` package.**
  Verified directly this session: `npm install` reported "removed 2
  packages" and `node_modules/.bin/playwright` was gone immediately
  after, because `playwright` isn't in `package.json`/lockfile and a
  plain install prunes anything extraneous. `npm install --no-save
  playwright` fixes it in ~4s and doesn't touch the lockfile — but if
  you ever run a bare `npm install` again later in the same session
  (e.g. after adding a real dependency), **re-run the playwright
  install line afterward.** The downloaded Chromium *binary* itself
  (`~/AppData/Local/ms-playwright/`) is untouched by this — only the
  npm package/bin symlink is pruned, so `npx playwright install
  chromium` after a re-install is a fast no-op, not a re-download.
- **The intro splash blocks every screenshot unless you emulate
  `prefers-reduced-motion`.** `SiteChrome` plays a ~2.6s staged
  framer-motion reveal covering the entire page on *every* load (not
  gated behind `sessionStorage` — deliberate, "the brand moment is part
  of the reload"). A screenshot taken right after `nav` without reduced
  motion is just the splash background gradient — no visible text at
  all. The driver already calls `page.emulateMedia({ reducedMotion:
  "reduce" })` before every session for exactly this reason; don't
  remove it.
- **Port drifts.** `npm run dev` reports `Port 3000 is in use ... using
  available port 3001 instead` essentially every run on this machine
  (something else squats 3000). Always read the port out of the dev-server
  log before pointing the driver at it — don't hardcode 3000.
- **Supabase asset requests hang/fail offline, and that's expected.**
  The site fetches its logo/team-avatar SVGs from a live Supabase
  storage bucket (`**/storage/v1/object/public/**`). The driver aborts
  that route by default, which produces a few `net::ERR_FAILED`
  console entries — that's the *expected*, intentional signature, not
  a real bug. A genuinely broken page shows a `SyntaxError` or a React
  hydration error in `console-errors`, not just `ERR_FAILED` lines.
- **`$!` after `npm run dev &` is the wrong PID to kill.** It's the
  `npm` CLI wrapper, not the actual `next-server` process listening on
  the port; killing it leaves the port held. Find the real listener via
  `netstat -ano | grep ':<port>' | grep LISTENING` and `taskkill //PID
  <pid> //F` instead.
