const { chromium } = require('playwright');
const path = require('path');
const root = path.resolve(__dirname, '..');

(async () => {
  const browser = await chromium.launch();

  const files = [
    { name: 'styled', html: 'pages/Massoom_Dickey_Nazeem_Resume_Styled.html' },
    { name: 'ats', html: 'pages/Massoom_Dickey_Nazeem_Resume_ATS.html' },
  ];

  for (const file of files) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1400, height: 900 });
    const url = 'file:///' + path.resolve(root, file.html).replace(/\\/g, '/');
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.resolve(root, `tools/screenshot-${file.name}.png`), fullPage: false });
    console.log(`Saved: tools/screenshot-${file.name}.png`);
    await page.close();
  }

  await browser.close();
})();
