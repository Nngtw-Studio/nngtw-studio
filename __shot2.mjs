import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(6000);
const el = page.locator('#featured-games').first();
await el.scrollIntoViewIfNeeded();
await page.waitForTimeout(1200);
await page.screenshot({ path: process.argv[2], fullPage: false });
await browser.close();
