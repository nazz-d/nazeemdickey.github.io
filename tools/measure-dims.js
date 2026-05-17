const { chromium } = require('playwright');
const path = require('path');
const root = path.resolve(__dirname, '..');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const files = [
    'pages/Massoom_Dickey_Nazeem_Resume_Styled.html',
    'pages/Massoom_Dickey_Nazeem_Resume_ATS.html',
  ];

  for (const file of files) {
    const url = 'file:///' + path.resolve(root, file).replace(/\\/g, '/');
    await page.goto(url, { waitUntil: 'networkidle' });
    const dims = await page.evaluate(() => ({
      bodyW: document.body.scrollWidth,
      bodyH: document.body.scrollHeight,
      docW: document.documentElement.scrollWidth,
      docH: document.documentElement.scrollHeight,
    }));
    console.log(file);
    console.log('  body: ' + dims.bodyW + 'x' + dims.bodyH + 'px  (' + (dims.bodyW/96).toFixed(2) + 'in x ' + (dims.bodyH/96).toFixed(2) + 'in)');
    console.log('  doc:  ' + dims.docW + 'x' + dims.docH + 'px');
  }

  await browser.close();
})();
