import { chromium } from 'playwright';

const url = process.argv[2] || 'http://localhost:3000';
const out = process.argv[3] || 'out.png';
const selector = process.argv[4]; // optional element selector

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const errors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});
page.on('pageerror', (err) => errors.push(String(err)));

await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(1500);

if (selector) {
  const el = page.locator(selector).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await el.screenshot({ path: out });
} else {
  await page.screenshot({ path: out, fullPage: true });
}

console.log('ERRORS:', JSON.stringify(errors, null, 2));
await browser.close();
