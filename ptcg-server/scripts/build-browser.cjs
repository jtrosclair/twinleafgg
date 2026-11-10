'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const project = path.resolve(__dirname, '..');
const compiler = require.resolve('typescript/bin/tsc');

// Node-based asset generation and verification retain their CommonJS entry.
// The application imports ES modules so webpack can concatenate and tree-shake.
for (const configuration of ['tsconfig.browser.json', 'tsconfig.browser-esm.json']) {
  const result = spawnSync(process.execPath, [compiler, '-p', configuration], { cwd: project, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}
fs.writeFileSync(path.join(project, 'browser-esm/package.json'), JSON.stringify({
  private: true,
  sideEffects: ['./game/store/card/card-types.js', './sets/**']
}, null, 2));
