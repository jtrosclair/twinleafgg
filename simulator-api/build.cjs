const path = require('node:path');
const fs = require('node:fs');
const esbuild = require('../cloudflare/node_modules/esbuild');
const dir = path.join(__dirname, '.build');
fs.mkdirSync(dir, { recursive: true });
esbuild.buildSync({ entryPoints: [path.join(__dirname, 'service.ts')], bundle: true,
  platform: 'browser', format: 'esm', target: 'es2022', minify: true,
  outfile: path.join(dir, 'worker.mjs') });
