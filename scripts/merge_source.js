const fs = require('fs');
const path = require('path');

function copyDirRecursive(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Copying original_source/src -> src...');
copyDirRecursive('original_source/src', 'src');

console.log('Merging original_source/styles/src -> src...');
copyDirRecursive('original_source/styles/src', 'src');

// Ensure sass-mq is in node_modules if needed, or in src
console.log('Copying sass-mq...');
fs.mkdirSync('src/styles/vendor/sass-mq', { recursive: true });
copyDirRecursive('original_source/styles/node_modules/sass-mq', 'src/styles/vendor/sass-mq');
fs.mkdirSync('node_modules/sass-mq', { recursive: true });
copyDirRecursive('original_source/styles/node_modules/sass-mq', 'node_modules/sass-mq');

// Create src/styles/partials.scss
const partialsScss = `
@import "node_modules/sass-mq/_mq";
@import "styles/variables/_colors";
@import "styles/variables/_font";
@import "styles/variables/_z";
@import "styles/variables/_ease";
@import "styles/metrics/_metrics";
@import "styles/mixins/_fluid-typo";
@import "styles/mixins/_wrapper";
@import "styles/mixins/_grid";
`;
fs.writeFileSync('src/styles/partials.scss', partialsScss);
console.log('Created src/styles/partials.scss');

// Setup src/index.css with font faces
const indexCss = `
html, body {
  margin: 0;
  font-family: "neuzeit-grotesk", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  overscroll-behavior-y: none;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
}

@font-face {
  font-family: "simplon-mono";
  src: url("/static/media/SimplonMono-Regular-WebS.7974b82a.woff") format("woff");
}

@font-face {
  font-family: "Vanitas-Regular";
  src: url("/static/media/vanitas.183b7edd.woff") format("woff");
}

@font-face {
  font-family: "neuzeit-grotesk";
  src: url("/static/media/neuzeit.7dd8c073.woff") format("woff");
}
`;
fs.writeFileSync('src/index.css', indexCss);
console.log('Updated src/index.css');
