const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const files = ['resume-ats.html', 'resume-styled.html'];

  for (const f of files) {
    const url = 'file:///' + path.resolve(__dirname, f).replace(/\\/g, '/');
    await page.goto(url, { waitUntil: 'networkidle' });

    // Generate PDF and check page count
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

    // Count PDF pages by looking for page markers
    const pdfText = pdf.toString('binary');
    const pageCount = (pdfText.match(/\/Type \/Page[^s]/g) || []).length;

    console.log(f, '— height:', metrics.scrollHeight, 'px — PDF pages:', pageCount);
  }

  await browser.close();
})();
