const { chromium } = require('playwright');
const path = require('path');

const root = path.resolve(__dirname, '..');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const files = ['pages/Massoom_Dickey_Nazeem_Resume_ATS.html', 'pages/Massoom_Dickey_Nazeem_Resume_Styled.html'];

  for (const file of files) {
    const url = 'file:///' + path.resolve(root, file).replace(/\\/g, '/');
    await page.goto(url, { waitUntil: 'networkidle' });

    const pdf = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    const metrics = await page.evaluate(() => {
      return {
        scrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
        offsetHeight: document.body.offsetHeight,
      };
    });

    const pdfText = pdf.toString('binary');
    const pageCount = (pdfText.match(/\/Type \/Page[^s]/g) || []).length;

    console.log(file, '- height:', metrics.scrollHeight, 'px - PDF pages:', pageCount);
  }

  await browser.close();
})();
