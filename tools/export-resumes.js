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
      html: 'pages/resume-ats.html',
      pdf: 'assets/resumes/resume-ats.pdf',
      margin: { top: '0.3in', right: '0.45in', bottom: '0.25in', left: '0.45in' },
    },
    {
      name: 'resume-styled',
      html: 'pages/resume-styled.html',
      pdf: 'assets/resumes/resume-styled.pdf',
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    },
  ];

  for (const file of files) {
    const url = 'file:///' + path.resolve(root, file.html).replace(/\\/g, '/');
    console.log(`Processing: ${file.name}`);
    await page.goto(url, { waitUntil: 'networkidle' });

    // Measure content height (11 inches = 1056px at 96dpi)
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log(`  Content height: ${height}px`);

    // Scale down if it exceeds the limit (standard Letter is ~1050px height)
    let scale = 1.0;
    if (height > 1020) {
      scale = Math.max(0.7, 1000 / height);
      console.log(`  Scaling down to ${scale.toFixed(2)} to fit on one page.`);
    }

    let pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: file.margin,
      scale: scale,
    });

    // Verify page count
    let pdfText = pdfBuffer.toString('binary');
    let pageCount = (pdfText.match(/\/Type \/Page[^s]/g) || []).length;

    // Retry once with slightly smaller scale if it overflows
    if (pageCount > 1) {
      console.log(`  Warning: ${file.name}.pdf overflowed to ${pageCount} pages. Retrying with 0.95 scale...`);
      scale = scale * 0.95;
      pdfBuffer = await page.pdf({
        format: 'Letter',
        printBackground: true,
        margin: file.margin,
        scale: scale,
      });
      pdfText = pdfBuffer.toString('binary');
      pageCount = (pdfText.match(/\/Type \/Page[^s]/g) || []).length;
    }

    if (pageCount > 1) {
      console.error(`  ERROR: ${file.name}.pdf generated ${pageCount} pages! Must be exactly 1.`);
      console.error(`  Current height: ${height}px. Try reducing content in ${file.html}`);
      await browser.close();
      process.exit(1);
    }

    fs.writeFileSync(path.resolve(root, file.pdf), pdfBuffer);
    console.log(`  Successfully exported: ${file.pdf} (1 page, scale: ${scale.toFixed(2)})`);
  }

  await browser.close();
  console.log('All resumes exported successfully.');
})();
