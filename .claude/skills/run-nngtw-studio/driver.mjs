#!/usr/bin/env node
/**
 * Minimal chromium-cli-style driver for the NNGTW Studio Next.js site.
 * Reads a newline-delimited command script from stdin, drives a headless
 * Chromium page against it, and exits. No REPL/session server — each
 * invocation launches and tears down its own browser (a few seconds of
 * overhead, acceptable for how this site is verified).
 *
 * Usage:
 *   node .claude/skills/run-nngtw-studio/driver.mjs [baseUrl] <<'EOF'
 *   nav /news
 *   wait-for text=Notes from the headset
 *   screenshot hero
 *   scroll-to #xr
 *   screenshot xr
 *   console-errors
 *   EOF
 *
 * baseUrl defaults to http://localhost:3000 — pass the real dev-server
 * port (it drifts, see SKILL.md) as argv[2].
 *
 * Commands:
 *   nav <path|url>            goto baseUrl+path (or an absolute url)
 *   wait-for text=<substr>    wait for a text node to appear
 *   wait-for sel=<selector>   wait for a CSS selector to appear
 *   scroll-to <selector>      scrollIntoView on the first match
 *   click <selector>          click the first match
 *   fill <selector> <text>    fill an input (goes through Playwright's
 *                             pipeline, so React onChange fires)
 *   press <key>               press a key (e.g. Enter)
 *   screenshot [name]         saves shots/<name|auto>.png
 *   console-errors            print every console/page error seen so far
 *
 * Shots land in .claude/skills/run-nngtw-studio/shots/ next to this file.
 */

import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";
import readline from "node:readline";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHOTS_DIR = join(__dirname, "shots");
mkdirSync(SHOTS_DIR, { recursive: true });

const baseUrl = process.argv[2] || "http://localhost:3000";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });

// The site's intro splash (framer-motion, ~2.6s of staged reveals) covers
// the whole page on every load and isn't gated behind sessionStorage — it
// plays every time by design. It reads prefers-reduced-motion and skips
// straight to steady state, so emulate that or every "nav" screenshot is
// just the splash.
await page.emulateMedia({ reducedMotion: "reduce" });

// Supabase asset URLs (site logo, team avatars) are unreachable offline
// and otherwise hang the run. Broken-image icons for the header logo in
// screenshots are expected, not a bug.
await page.route("**/storage/v1/object/public/**", (route) => route.abort());

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(String(err)));

let shotCounter = 0;

function resolveUrl(target) {
  if (/^https?:\/\//.test(target)) return target;
  return baseUrl.replace(/\/$/, "") + (target.startsWith("/") ? target : `/${target}`);
}

async function runLine(raw) {
  const line = raw.trim();
  if (!line || line.startsWith("#")) return;
  const [cmd, ...rest] = line.split(" ");
  const arg = rest.join(" ");

  switch (cmd) {
    case "nav": {
      const url = resolveUrl(arg);
      console.log(`→ nav ${url}`);
      await page.goto(url, { waitUntil: "networkidle" });
      break;
    }
    case "wait-for": {
      if (arg.startsWith("text=")) {
        const text = arg.slice(5);
        console.log(`→ wait-for text="${text}"`);
        await page.getByText(text, { exact: false }).first().waitFor({ timeout: 15000 });
      } else if (arg.startsWith("sel=")) {
        const sel = arg.slice(4);
        console.log(`→ wait-for sel="${sel}"`);
        await page.locator(sel).first().waitFor({ timeout: 15000 });
      } else {
        throw new Error(`wait-for needs text=... or sel=..., got: ${arg}`);
      }
      break;
    }
    case "scroll-to": {
      console.log(`→ scroll-to ${arg}`);
      await page.locator(arg).first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      break;
    }
    case "click": {
      console.log(`→ click ${arg}`);
      await page.locator(arg).first().click();
      break;
    }
    case "fill": {
      const [sel, ...text] = rest;
      console.log(`→ fill ${sel} "${text.join(" ")}"`);
      await page.locator(sel).first().fill(text.join(" "));
      break;
    }
    case "press": {
      console.log(`→ press ${arg}`);
      await page.keyboard.press(arg);
      break;
    }
    case "screenshot": {
      shotCounter += 1;
      const name = arg || `shot-${shotCounter}`;
      const path = join(SHOTS_DIR, `${name}.png`);
      await page.screenshot({ path });
      console.log(`→ screenshot saved: ${path}`);
      break;
    }
    case "console-errors": {
      console.log("→ console-errors:", JSON.stringify(errors, null, 2));
      break;
    }
    default:
      throw new Error(`unknown command: ${cmd}`);
  }
}

const rl = readline.createInterface({ input: process.stdin });
try {
  for await (const line of rl) {
    await runLine(line);
  }
} finally {
  await browser.close();
}
