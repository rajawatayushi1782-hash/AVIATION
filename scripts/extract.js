const fs = require('fs');
const path = require('path');

function sanitizePath(p) {
  let clean = p.replace(/^webpack:\/\//, '').replace(/^\.\//, '');
  // normalize slashes
  clean = clean.split('\\').join('/');
  // Filter out invalid characters for windows
  const parts = clean.split('/').map(part => {
    return part.replace(/[:*?"<>|]/g, '_');
  });
  return parts.join(path.sep);
}

async function extractSourceMap(url, outDir) {
  console.log('Fetching', url);
  const res = await fetch(url);
  const json = await res.json();
  if (!json.sources || !json.sourcesContent) {
    console.log('No sourcesContent in', url);
    return;
  }
  let count = 0;
  for (let i = 0; i < json.sources.length; i++) {
    const rawPath = json.sources[i];
    const content = json.sourcesContent[i];
    if (!content) continue;
    const clean = sanitizePath(rawPath);
    const fullPath = path.join(outDir, clean);
    try {
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, content);
      count++;
    } catch (e) {
      console.warn('Failed to write:', rawPath, e.message);
    }
  }
  console.log('Extracted', count, 'sources from', url);
}

async function run() {
  await extractSourceMap('https://www.flyplatoon.com/static/js/main.b9694987.chunk.js.map', './original_source/src');
  await extractSourceMap('https://www.flyplatoon.com/static/css/main.14592af8.chunk.css.map', './original_source/styles');
}
run();
