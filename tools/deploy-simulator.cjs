#!/usr/bin/env node
// Publish one verified simulator build and its matching PrizeMap API engine.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const cloudflare = path.join(root, 'cloudflare');
const sync = path.join(root, 'tools/sync-prizemap-engine.cjs');

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', env: process.env });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${path.basename(command)} failed${result.signal ? ` (${result.signal})` : ` (exit ${result.status})`}`);
}

function deploy({ execute = run, makeStage = () => fs.mkdtempSync(path.join(os.tmpdir(), 'prizemap-simulator-sync-')),
  removeStage = stage => fs.rmSync(stage, { recursive: true, force: true }), log = console.log } = {}) {
  const stage = makeStage();
  let published = false;
  try {
    execute(process.execPath, [path.join(root, 'ptcg-play/scripts/build-attestation.cjs'), 'verify'], root);
    execute(process.execPath, [sync, 'prepare', '--stage', stage], root);
    execute(process.execPath, [path.join(cloudflare, 'retain-previous-release.mjs')], cloudflare);
    execute(path.join(cloudflare, 'node_modules/.bin/wrangler'), ['deploy'], cloudflare);
    published = true;
    execute(process.execPath, [sync, 'publish', '--stage', stage], root);
    removeStage(stage);
    log('Simulator and PrizeMap engine deployment verified.');
  } catch (error) {
    const recovery = published
      ? `The simulator was published, but its PrizeMap sync did not finish. Retry: node ${sync} publish --stage ${stage}`
      : `The simulator release did not finish. Staged files are retained at ${stage}.`;
    throw new Error(`${error.message}\n${recovery}`, { cause: error });
  }
}

if (require.main === module) {
  try { deploy(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { deploy };
