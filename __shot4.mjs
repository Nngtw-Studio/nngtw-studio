import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1100 } });

await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(1000);

await page.evaluate(() => {
  document.documentElement.removeAttribute('data-intro');
  window.dispatchEvent(new Event('intro-complete'));
  window.dispatchEvent(new Event('intro-glow-handoff'));
  document.querySelectorAll('.fixed.inset-0.z-100').forEach((el) => el.remove());
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
});
await page.waitForTimeout(500);

await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = 'auto';
  document.querySelector('#featured-games')?.scrollIntoView({ block: 'start' });
});
await page.waitForTimeout(1000);
await page.screenshot({ path: process.argv[2] });
await browser.close();
