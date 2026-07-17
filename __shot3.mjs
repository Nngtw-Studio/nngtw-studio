import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1100 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(1000);

// Force-dismiss the intro splash (blocked in this sandbox — likely a Supabase
// storage fetch that can't resolve without outbound network access) so we can
// verify the section underneath renders correctly.
await page.evaluate(() => {
  document.documentElement.removeAttribute('data-intro');
  window.dispatchEvent(new Event('intro-complete'));
  window.dispatchEvent(new Event('intro-glow-handoff'));
  document.querySelectorAll('.fixed.inset-0.z-100').forEach((el) => el.remove());
});
await page.waitForTimeout(800);

const el = page.locator('#featured-games').first();
await el.scrollIntoViewIfNeeded();
await page.waitForTimeout(1200);
await page.screenshot({ path: process.argv[2] });

const el2 = await el.boundingBox();
console.log('SECTION BOX:', el2);
console.log('ERRORS:', JSON.stringify(errors.slice(0, 10), null, 2));
await browser.close();
