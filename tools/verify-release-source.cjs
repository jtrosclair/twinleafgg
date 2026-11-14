#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { buildInputFiles } = require('../ptcg-play/scripts/build-attestation.cjs');

// Include release checks and tests as well as the code that reaches the package.
// Unrelated documentation changes do not affect a simulator release.
const releasePaths = ['ptcg-play', 'ptcg-server', 'tools', 'cloudflare', '.github',
  'package.json', 'package-lock.json', '.nvmrc', '.gitignore', '.gitattributes'];

function verifyReleaseSource({ workspaceRoot = path.resolve(__dirname, '..') } = {}) {
  const git = args => execFileSync('git', args, {
    cwd: workspaceRoot, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, GIT_TERMINAL_PROMPT: '0' }
  });
  const commit = git(['rev-parse', '--verify', 'HEAD']).trim();
  const changes = git(['status', '--porcelain=v1', '-z', '--untracked-files=all', '--', ...releasePaths]);
  assert.equal(changes, '', 'Simulator release sources have uncommitted or untracked changes. Commit and push them before deploying.');

  // Ignored files do not appear in git status, but must not silently become
  // executable build inputs that would disappear in the next clean checkout.
  const tracked = new Set(git(['ls-tree', '-r', '--name-only', '-z', 'HEAD']).split('\0'));
  const missing = buildInputFiles({ workspaceRoot }).filter(name => !tracked.has(name));
  assert.equal(missing.length, 0, `Simulator build inputs are not committed: ${missing.slice(0, 5).join(', ')}. Commit them before deploying.`);

  const remote = git(['ls-remote', '--exit-code', 'origin', 'refs/heads/production']).trim();
  const match = /^([a-f0-9]{40})\s+refs\/heads\/production$/.exec(remote);
  assert(match, 'Could not verify the published production branch. No deployment is allowed.');
  assert.equal(commit, match[1], 'Deployment must use the latest published production commit. Push your commit, or update this checkout and rebuild; do not deploy an older checkout.');
  return { ok: true, sourceCommit: commit, branch: 'production' };
}

if (require.main === module) {
  try {
    assert.equal(Number(process.versions.node.split('.')[0]), 24, 'Use Node.js 24 for simulator releases (nvm use).');
    console.log(JSON.stringify(verifyReleaseSource(), null, 2));
  }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { verifyReleaseSource };
