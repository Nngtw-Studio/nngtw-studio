import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 2700 } });
await page.route('**/storage/v1/object/public/**', (route) => route.abort());
await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3500);
await page.evaluate(() => {
  document.querySelector('#featured-games')?.scrollIntoView({ block: 'start' });
});
await page.waitForTimeout(1200);
await page.screenshot({ path: process.argv[2] });
await browser.close();
