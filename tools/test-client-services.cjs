#!/usr/bin/env node
'use strict';

// Prepare the generated browser library first:
//   cd ptcg-play && npm run prepare:simulator
// Then, from the repository root:
//   node tools/test-client-services.cjs
// Optional arguments select individual spec paths relative to the repository.
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const root = path.resolve(__dirname, '..');
const browserEntry = path.join(root, 'ptcg-server/browser/browser.js');
const simulatorEntry = path.join(root, 'ptcg-server/browser/client/index.js');
if (!fs.existsSync(browserEntry) || !fs.existsSync(simulatorEntry)) {
  throw new Error('Run `cd ptcg-play && npm run prepare:simulator` before testing client services.');
}

// Match the Angular project's browser aliases. Never resolve the Node backend's
// package entry or mix its classes with the generated browser engine classes.
const resolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...args) {
  if (request === 'ptcg-server') request = browserEntry;
  if (request === 'ptcg-server/client') request = simulatorEntry;
  return resolve.call(this, request, parent, ...args);
};
require(path.join(root, 'ptcg-server/node_modules/ts-node')).register({
  project: path.join(root, 'ptcg-play/tsconfig.json'),
  transpileOnly: true,
  compilerOptions: { module: 'commonjs', target: 'es2018', experimentalDecorators: true }
});
const Jasmine = require(path.join(root, 'ptcg-server/node_modules/jasmine'));
const runner = new Jasmine({ projectBaseDir: root });
runner.loadConfig({
  spec_dir: '.',
  spec_files: process.argv.length > 2 ? process.argv.slice(2) : [
    'ptcg-play/src/app/app-base-href.spec.ts',
    'ptcg-play/src/app/sandbox-viewer/sandbox-viewer.component.spec.ts',
    'ptcg-play/src/app/api/services/game.local.spec.ts',
    'ptcg-play/src/app/api/services/cards.service.spec.ts',
    'ptcg-play/src/app/shared/cards/cards-base.service.spec.ts',
    'ptcg-play/src/app/shared/services/simulator-assets.service.spec.ts',
    'ptcg-play/src/app/shared/services/puzzle-payload.spec.ts',
    'ptcg-play/src/app/shared/services/puzzle-field-codes.spec.ts',
    'ptcg-play/src/app/shared/services/webview-bridge.service.spec.ts',
    'ptcg-play/src/app/shared/services/board-interaction.service.spec.ts',
    'ptcg-play/src/app/table/prompt/prompt.lifecycle.spec.ts',
    'ptcg-play/src/app/table/prompt/prompt-choose-cards/prompt-choose-cards.component.spec.ts',
    'ptcg-play/src/app/table/hand/hand.component.spec.ts',
    'ptcg-play/src/app/table/table.component.spec.ts',
    'ptcg-play/src/app/table/board/board.component.spec.ts'
  ],
  random: false
});
runner.execute();
