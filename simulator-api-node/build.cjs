// Prepare a self-contained Node service from the shared API and engine.
// Build from the repository root; only the generated output enters the image.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const esbuild = require('../cloudflare/node_modules/esbuild');

const root = path.resolve(__dirname, '..');
const output = path.join(__dirname, 'dist');
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(path.join(output, 'lib'), { recursive: true });
esbuild.buildSync({
  entryPoints: [path.join(root, 'simulator-api/service.ts')],
  outfile: path.join(output, 'lib/service.mjs'),
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node24',
  minify: true,
  logLevel: 'info',
});
fs.copyFileSync(path.join(__dirname, 'server.mjs'), path.join(output, 'server.mjs'));
fs.writeFileSync(path.join(output, 'package.json'), JSON.stringify({
  name: 'prizemap-simulator-api', private: true, type: 'module',
  engines: { node: '>=24 <25' },
}, null, 2) + '\n');
const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
fs.writeFileSync(path.join(output, 'bundle-info.json'), JSON.stringify({
  node: process.version,
  esbuild: esbuild.version,
  serviceSha256: sha256(path.join(output, 'lib/service.mjs')),
  imageMapSha256: sha256(path.join(root, 'simulator-api/large-card-images.json')),
}, null, 2) + '\n');
console.log(`Prepared ${output}`);
