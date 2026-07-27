import { chromium } from 'playwright';

const OUT = process.argv[2] ?? 'shot-connect';
const WIDTH = Number(process.argv[3] ?? 1440);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: WIDTH, height: 1000 } });
await page.route('**/storage/v1/object/public/**', (r) => r.abort());
await page.goto('http://localhost:3000/connect', { waitUntil: 'networkidle' });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(2500);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}.png`, fullPage: true });
await browser.close();
console.log('done', OUT);
