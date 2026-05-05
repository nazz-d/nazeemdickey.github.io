const fs = require('fs');
const content = fs.readFileSync('assets/js/script.js', 'utf8');
const startMarker = 'const INDEX = [';
const endMarker = '// Inject overlay HTML once';

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `  // The INDEX is now generated with "pages/filename.html" paths.
  const processedIndex = INDEX.map(item => {
    let url = item.url;
    if (url === "index.html") {
      url = root + "index.html";
    } else {
      if (isSubpage) {
        url = url.replace("pages/", "");
      } else {
        url = root + url;
      }
    }
    return { ...item, url };
  });

  // Inject overlay HTML once`;

  const newContent = content.substring(0, startIdx) + replacement + content.substring(endIdx + endMarker.length);
  fs.writeFileSync('assets/js/script.js', newContent);
  console.log('Successfully updated script.js');
} else {
  console.error('Markers not found');
  process.exit(1);
}
