const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function generatePDF(filename) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Use absolute path for the local file
  const absolutePath = path.resolve(__dirname, '../pages', filename + '.html');
  const fileUrl = `file://${absolutePath}`;
  console.log(`Processing: ${filename}`);
  
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  // Measure content height to ensure it fits on one page (11 inches = 1056px at 96dpi)
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`  Content height: ${height}px`);
  
  // Standard Letter page is 11in. With 0.4in margins, usable height is 10.2in (~980px)
  // If height is significantly larger, we scale down.
  let scale = 1.0;
  if (height > 1000) {
    scale = Math.max(0.7, 980 / height);
    console.log(`  Scaling down to ${scale.toFixed(2)} to fit on one page.`);
  }

  const pdfPath = path.join(__dirname, '../assets/resumes', filename + '.pdf');
  
  await page.pdf({
    path: pdfPath,
    format: 'Letter',
    printBackground: true,
    margin: {
      top: '0.4in',
      right: '0.4in',
      bottom: '0.4in',
      left: '0.4in'
    },
    scale: scale,
    displayHeaderFooter: false,
    preferCSSPageSize: true
  });

  await browser.close();
  console.log(`  Successfully generated: assets/resumes/${filename}.pdf`);
}

(async () => {
  const resumesDir = path.join(__dirname, '../assets/resumes');
  if (!fs.existsSync(resumesDir)) {
    fs.mkdirSync(resumesDir, { recursive: true });
  }

  try {
    await generatePDF('resume-styled');
    await generatePDF('resume-ats');
  } catch (err) {
    console.error('PDF Generation Error:', err);
  }
})();
