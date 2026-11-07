'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { packageClientBuild, SNAPSHOT_FORMATS_META } = require('./package-client-build.cjs');
const { captureBuildInputs, recordCompiledBuild, recordVerifiedPackage, verifyDeploy } = require('./build-attestation.cjs');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'simulator-attestation-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (name, value) => { const file = path.join(root, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, value); };
  put('ptcg-play/src/main.ts', 'export const app = 1;');
  put('ptcg-server/src/game/engine.ts', 'export const engine = 1;');
  put('ptcg-play/angular.json', '{"production":true}');
  put('ptcg-server/data/limitlesstcg-images.json', '{}');
  put('ptcg-play/dist/ptcg-play/index.html', SNAPSHOT_FORMATS_META + '<base href="./"><script src="main.js"></script><script src="simulator-static.abc.js"></script>');
  put('ptcg-play/dist/ptcg-play/main.js', 'var app=1;');
  put('ptcg-play/dist/ptcg-play/simulator-static.abc.js', 'var images={};');
  const manifest = packageClientBuild({ root: path.join(root, 'ptcg-play/dist/ptcg-play'),
    destination: path.join(root, 'ptcg-play/cloudflare-public') });
  const options = { workspaceRoot: root };
  const compile = configuration => recordCompiledBuild({ ...options, inputHash: captureBuildInputs(options), configuration: configuration || 'production' });
  const verify = () => recordVerifiedPackage(manifest.packageHash, options);
  return { root, put, manifest, options, compile, verify };
}

test('a production build is deployable only after verified finalization; a new compile clears that verification', t => {
  const f = fixture(t);
  assert.throws(() => verifyDeploy(f.options), /No successful simulator build/);
  f.compile();
  assert.throws(() => verifyDeploy(f.options), /finalization and size budgets/);
  f.verify();
  assert.equal(verifyDeploy(f.options).packageHash, f.manifest.packageHash);
  f.compile();
  assert.throws(() => verifyDeploy(f.options), /finalization and size budgets/);
  f.compile('local'); f.verify();
  assert.throws(() => verifyDeploy(f.options), /production/);
});

test('source changes during compilation or after successful packaging require a rebuild', t => {
  const f = fixture(t), before = captureBuildInputs(f.options);
  f.put('ptcg-play/src/main.ts', 'export const app=2;');
  assert.throws(() => recordCompiledBuild({ ...f.options, inputHash: before, configuration: 'production' }), /changed during compilation/);
  f.compile(); f.verify();
  f.put('ptcg-server/src/game/engine.ts', 'export const engine=2;');
  assert.throws(() => verifyDeploy(f.options), /changed since the verified build/);
  assert.throws(() => f.verify(), /changed after compilation/);
});

test('worker/domain-only updates and regenerated metadata do not change frontend build inputs', t => {
  const f = fixture(t); f.compile(); f.verify();
  f.put('cloudflare/worker.mjs', 'export default {newRoutes:true};');
  f.put('cloudflare/wrangler.jsonc', '{"routes":["stable.example"]}');
  f.put('ptcg-play/src/assets/simulator/cards.hash.json', '{"generated":true}');
  f.put('ptcg-play/src/app/client-library-version.ts', 'export const hash="generated";');
  f.put('ptcg-play/src/simulator-static.js', 'var generated=true;');
  f.put('ptcg-play/src/example.spec.ts', 'test("updated");');
  assert.equal(verifyDeploy(f.options).ok, true);
  f.put('ptcg-server/data/limitlesstcg-images.json', '{"image":"changed"}');
  assert.throws(() => verifyDeploy(f.options), /changed since the verified build/);
});

test('tampered release files, ZIP or manifest cannot pass deployment verification', t => {
  const f = fixture(t); f.compile(); f.verify();
  const release = `ptcg-play/cloudflare-public/releases/${f.manifest.packageHash}/`;
  f.put(release + 'main.js', 'var app=9;');
  assert.throws(() => verifyDeploy(f.options), /package content changed/);
  f.put(release + 'main.js', 'var app=1;');
  const archive = path.join(f.root, release + f.manifest.archive.path), original = fs.readFileSync(archive);
  fs.appendFileSync(archive, 'changed');
  assert.throws(() => verifyDeploy(f.options), /package byte count changed/);
  fs.writeFileSync(archive, original);
  const file = path.join(f.root, 'ptcg-play/cloudflare-public/simulator-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(file));
  manifest.buildId = 'not-the-verified-build'; fs.writeFileSync(file, JSON.stringify(manifest));
  assert.throws(() => verifyDeploy(f.options), /manifest changed since verification/);
});
