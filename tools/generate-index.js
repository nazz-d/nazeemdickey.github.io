const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, '../pages');
const INDEX_FILE = path.join(__dirname, '../assets/js/script.js');

// Icon mapping based on filename or content keywords
const ICON_MAP = {
  'certifications': '🏅',
  'resume': '📄',
  'homelab': '🖥️',
  'proxmox': '⚙️',
  'opnsense': '🛡️',
  'switching': '🔀',
  'remote-access': '🔐',
  'identity': '👤',
  'wazuh': '🔍',
  'status': '📡',
  'writeups': '✍️',
  'skillsusa': '🥇',
  'journey': '🗺️'
};

function getIcon(filename) {
  for (const [key, icon] of Object.entries(ICON_MAP)) {
    if (filename.includes(key)) return icon;
  }
  return '📄';
}

function generateIndex() {
  const files = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.html'));
  const index = [];

  // Add Home page manually as it's in root
  const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  index.push({
    title: 'Home',
    url: 'index.html', // This will be adjusted by setupSearch root logic
    icon: '🏠',
    desc: 'Portfolio landing page',
    keywords: 'home portfolio nazeem network admin soc noc msp skills projects contact hero'
  });

  files.forEach(file => {
    const content = fs.readFileSync(path.join(PAGES_DIR, file), 'utf8');
    
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    const descMatch = content.match(/<meta name="description" content="(.*?)"/);
    
    // Extract keywords from meta keywords if they exist, or just use the title/filename
    const title = titleMatch ? titleMatch[1].split('|')[0].trim() : file;
    const desc = descMatch ? descMatch[1] : '';
    const nameOnly = file.replace('.html', '');
    
    index.push({
      title: title,
      url: `pages/${file}`,
      icon: getIcon(nameOnly),
      desc: desc,
      keywords: `${nameOnly} ${title.toLowerCase()} ${desc.toLowerCase()}`.replace(/[^\w\s]/g, '')
    });
  });

  // Read current script.js
  let scriptContent = fs.readFileSync(INDEX_FILE, 'utf8');

  // Replace the INDEX array
  const indexJson = JSON.stringify(index, null, 2);
  const updatedScript = scriptContent.replace(
    /const INDEX = \[[\s\S]*?\];/,
    `const INDEX = ${indexJson};`
  );

  fs.writeFileSync(INDEX_FILE, updatedScript);
  console.log(`Successfully indexed ${index.length} pages.`);
}

generateIndex();
