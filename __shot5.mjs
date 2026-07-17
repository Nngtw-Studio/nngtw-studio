import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1100 } });

// Abort the splash's Supabase asset fetch immediately (this sandbox has no
// outbound network access), so its own catch() path runs and it dismisses
// itself cleanly instead of hanging with scroll permanently pinned to top.
await page.route('**/storage/v1/object/public/**', (route) => route.abort());

const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3500);

await page.evaluate(() => {
  document.querySelector('#featured-games')?.scrollIntoView({ block: 'start' });
});
await page.waitForTimeout(1200);
await page.screenshot({ path: process.argv[2] });
console.log('ERRORS:', JSON.stringify(errors.slice(0, 10), null, 2));
console.log('SCROLL_Y:', await page.evaluate(() => window.scrollY));
console.log('DATA_INTRO:', await page.evaluate(() => document.documentElement.getAttribute('data-intro')));
await browser.close();
