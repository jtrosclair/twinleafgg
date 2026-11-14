const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { verifyReleaseSource } = require('./verify-release-source.cjs');

function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sim-release-source-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const root = path.join(dir, 'checkout'); fs.mkdirSync(root);
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: 'pipe' }).trim();
  const put = (file, text) => { const dest = path.join(root, file); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, text); };
  git('init', '--bare', path.join(dir, 'remote.git'));
  git('init', '-b', 'production');
  git('config', 'user.name', 'Release Test'); git('config', 'user.email', 'release@example.invalid');
  git('remote', 'add', 'origin', path.join(dir, 'remote.git'));
  put('.gitignore', '*.ignored\n');
  put('ptcg-play/src/main.ts', 'export const app = 1;');
  put('ptcg-server/src/engine.ts', 'export const engine = 1;');
  git('add', '.'); git('commit', '-m', 'initial'); git('push', 'origin', 'production');
  return { root, put, git, verify: () => verifyReleaseSource({ workspaceRoot: root }) };
}

test('a clean checkout of published production is eligible, including detached CI checkouts', t => {
  const f = fixture(t), result = f.verify();
  assert.equal(result.sourceCommit, f.git('rev-parse', 'HEAD'));
  f.git('checkout', '--detach');
  assert.equal(f.verify().ok, true);
});

test('unstaged and staged source edits are rejected even if a build could succeed', t => {
  const f = fixture(t);
  f.put('ptcg-play/src/main.ts', 'export const app = 2;');
  assert.throws(f.verify, /uncommitted/);
  f.git('add', '.');
  assert.throws(f.verify, /uncommitted/);
});

test('new source files, deleted files, and dirty release checks cannot be omitted from the next release', t => {
  const f = fixture(t);
  f.put('tools/release-check.cjs', 'new check'); assert.throws(f.verify, /uncommitted/);
  f.git('clean', '-fd');
  fs.unlinkSync(path.join(f.root, 'ptcg-play/src/main.ts')); assert.throws(f.verify, /uncommitted/);
  f.git('restore', '.');
  f.put('cloudflare/worker.mjs', 'new worker'); assert.throws(f.verify, /uncommitted/);
});

test('ignored source inputs are rejected instead of disappearing on a clean checkout', t => {
  const f = fixture(t); f.put('ptcg-play/src/extra.ignored', 'not in Git');
  assert.throws(f.verify, /build inputs are not committed/);
});

test('a local commit must be pushed before deployment', t => {
  const f = fixture(t); f.put('ptcg-play/src/main.ts', 'export const app = 2;');
  f.git('add', '.'); f.git('commit', '-m', 'fix');
  assert.throws(f.verify, /latest published production/);
  f.git('push', 'origin', 'production'); assert.equal(f.verify().ok, true);
});

test('a clean older checkout is rejected after production advances', t => {
  const f = fixture(t), old = f.git('rev-parse', 'HEAD');
  f.put('ptcg-play/src/main.ts', 'export const app = 2;');
  f.git('add', '.'); f.git('commit', '-m', 'fix'); f.git('push', 'origin', 'production');
  f.git('checkout', '--detach', old); assert.throws(f.verify, /latest published production/);
});

test('unrelated documentation changes are allowed', t => {
  const f = fixture(t); f.put('docs/notes.md', 'unfinished notes');
  assert.equal(f.verify().ok, true);
});

test('an unavailable origin fails closed', t => {
  const f = fixture(t); f.git('remote', 'remove', 'origin');
  assert.throws(f.verify);
});
