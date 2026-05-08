const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const files = [
    {
      name: 'resume-ats',
      html: 'pages/Massoom_Dickey_Nazeem_Resume_ATS.html',
      pdf: 'assets/resumes/Massoom_Dickey_Nazeem_Resume_ATS.pdf',
      margin: { top: '0.3in', right: '0.45in', bottom: '0.25in', left: '0.45in' },
    },
    {
      name: 'resume-styled',
      html: 'pages/Massoom_Dickey_Nazeem_Resume_Styled.html',
      pdf: 'assets/resumes/Massoom_Dickey_Nazeem_Resume_Styled.pdf',
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    },
  ];

  for (const file of files) {
    const url = 'file:///' + path.resolve(root, file.html).replace(/\\/g, '/');
    console.log(`Processing: ${file.name}`);
    await page.goto(url, { waitUntil: 'networkidle' });

    let scale = 1.0;
    let pdfBuffer;
    let pageCount = 2;

    // Intelligent scaling loop: reduce scale until it fits on exactly 1 page
    while (pageCount > 1 && scale > 0.7) {
      pdfBuffer = await page.pdf({
        format: 'Letter',
        printBackground: true,
        margin: file.margin,
        scale: scale,
      });

      const pdfText = pdfBuffer.toString('binary');
      pageCount = (pdfText.match(/\/Type \/Page[^s]/g) || []).length;

      if (pageCount > 1) {
        scale -= 0.01;
      }
    }

    if (pageCount > 1) {
      console.error(`  ERROR: ${file.name}.pdf still ${pageCount} pages at scale ${scale.toFixed(2)}!`);
      await browser.close();
      process.exit(1);
    }

    fs.writeFileSync(path.resolve(root, file.pdf), pdfBuffer);
    console.log(`  Successfully exported: ${file.pdf} (Scale: ${scale.toFixed(2)})`);
  }

  await browser.close();
  console.log('All resumes exported successfully.');
})();
