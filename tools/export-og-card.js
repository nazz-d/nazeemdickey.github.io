const { chromium } = require('playwright');
const path = require('path');

const root = path.resolve(__dirname, '..');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ deviceScaleFactor: 2 });
  const page = await ctx.newPage();

  await page.setViewportSize({ width: 1200, height: 630 });

  const url = 'file:///' + path.resolve(root, 'tools/og-card.html').replace(/\\/g, '/');
  await page.goto(url, { waitUntil: 'networkidle' });

  const out = path.resolve(root, 'assets/diagrams/network-diagram.png');
  await page.screenshot({ path: out, type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });

  console.log('OG card saved to assets/diagrams/network-diagram.png');
  await browser.close();
})();
