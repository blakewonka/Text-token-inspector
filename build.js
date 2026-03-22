const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const watch = process.argv.includes('--watch');

function build() {
  execSync('npx tsc -p tsconfig.json', { stdio: 'inherit' });
  const html = fs.readFileSync(path.join(__dirname, 'ui/index.html'), 'utf8');
  const code = fs.readFileSync(path.join(__dirname, 'code.js'), 'utf8');
  const patched = code.replace('__html__', JSON.stringify(html));
  fs.writeFileSync(path.join(__dirname, 'code.js'), patched);
  console.log('Build complete.');
}

build();

if (watch) {
  fs.watch(path.join(__dirname, 'ui/index.html'), () => { console.log('HTML changed, rebuilding...'); build(); });
  fs.watch(path.join(__dirname, 'code.ts'), () => { console.log('TS changed, rebuilding...'); build(); });
}
