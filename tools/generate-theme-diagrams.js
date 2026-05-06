const fs = require('fs');
const path = require('path');

const diagramsDir = path.join(__dirname, '../assets/diagrams');

const lightPalette = new Map([
  ['#030208', '#f8fbff'],
  ['#0a0818', '#ffffff'],
  ['#0d0a18', '#edf5ff'],
  ['#0e0825', '#eef4ff'],
  ['#110d22', '#ffffff'],
  ['#1a1030', '#f2f7ff'],
  ['#1e1040', '#eaf2ff'],
  ['#2a1f44', '#dbeafe'],
  ['#4b4266', '#7890aa'],
  ['#6b5f88', '#58708a'],
  ['#7a6f9a', '#64748b'],
  ['#9488ad', '#38506d'],
  ['#f0eaff', '#eff6ff'],
  ['#f6f3ff', '#102033'],

  ['#6d28d9', '#4f46e5'],
  ['#7c3aed', '#2563eb'],
  ['#9333ea', '#0284c7'],
  ['#a78bfa', '#2563eb'],
  ['#c084fc', '#0369a1'],
  ['#4f46e5', '#2563eb'],
  ['#818cf8', '#1d4ed8'],

  ['#22d3ee', '#0284c7'],
  ['#0369a1', '#075985'],
  ['#0d9488', '#0f766e'],

  ['#d97706', '#c2410c'],
  ['#fbbf24', '#b45309'],
  ['#dc2626', '#dc2626'],
  ['#f87171', '#b91c1c'],
  ['#16a34a', '#15803d'],
  ['#4ade80', '#16a34a'],
  ['#4b6e40', '#4d7c0f'],
  ['#4b6e7a', '#0e7490'],
]);

function toLightSvg(svg) {
  let output = svg;

  for (const [dark, light] of lightPalette) {
    output = output.replace(new RegExp(dark, 'gi'), light);
  }

  return output.replace(
    '<svg ',
    '<svg data-diagram-theme="light" '
  );
}

function generate() {
  const files = fs.readdirSync(diagramsDir)
    .filter(file => file.endsWith('.svg') && !file.endsWith('-light.svg'));

  for (const file of files) {
    const source = path.join(diagramsDir, file);
    const target = path.join(diagramsDir, file.replace(/\.svg$/, '-light.svg'));
    const svg = fs.readFileSync(source, 'utf8');
    fs.writeFileSync(target, toLightSvg(svg));
    console.log(`Generated ${path.relative(process.cwd(), target)}`);
  }
}

generate();
