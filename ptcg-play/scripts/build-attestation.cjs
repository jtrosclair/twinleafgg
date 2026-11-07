'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { validateManifest } = require('../../tools/check-simulator-package.cjs');

const DEFAULT_ROOT = path.resolve(__dirname, '../..');
const SHA256 = /^[a-f0-9]{64}$/;
const digest = data => crypto.createHash('sha256').update(data).digest('hex');
const rootFor = options => path.resolve(options?.workspaceRoot || DEFAULT_ROOT);
const recordPath = root => path.join(root, 'ptcg-play/.simulator-build.json');
const isTest = name => /(?:^|\/)(?:tests|__tests__)(?:\/|$)/.test(name)
  || /\.spec\.[^/]+$/.test(name);

function filesUnder(root, directory) {
  const absolute = path.join(root, directory);
  if (!fs.existsSync(absolute)) return [];
  return fs.readdirSync(absolute, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
    .flatMap(entry => entry.isDirectory() ? filesUnder(root, `${directory}/${entry.name}`)
      : entry.isFile() ? [`${directory}/${entry.name}`] : []);
}

/** Content hashes, never mtimes or private environment/credential files. */
function captureBuildInputs(options = {}) {
  const root = rootFor(options);
  const source = filesUnder(root, 'ptcg-play/src').filter(name => !isTest(name)
    && !name.startsWith('ptcg-play/src/assets/simulator/')
    && !['ptcg-play/src/simulator-static.js', 'ptcg-play/src/app/client-library-version.ts',
      'ptcg-play/src/test.ts', 'ptcg-play/src/karma.conf.js'].includes(name));
  const engine = filesUnder(root, 'ptcg-server/src').filter(name => name.endsWith('.ts')
    && !name.endsWith('.d.ts') && !isTest(name));
  const scripts = filesUnder(root, 'ptcg-play/scripts').filter(name => !isTest(name)
    && /\.(?:cjs|mjs|js|json)$/.test(name));
  const configuration = ['package.json', 'package-lock.json', '.nvmrc',
    'ptcg-play/angular.json', 'ptcg-play/package.json', 'ptcg-play/package-lock.json', 'ptcg-play/.browserslistrc',
    'ptcg-server/package.json', 'ptcg-server/package-lock.json', 'ptcg-server/scripts/build-browser.cjs',
    'ptcg-server/data/limitlesstcg-images.json'];
  for (const directory of ['ptcg-play', 'ptcg-server']) {
    const absolute = path.join(root, directory);
    if (fs.existsSync(absolute)) configuration.push(...fs.readdirSync(absolute)
      .filter(name => /^tsconfig.*\.json$/.test(name) && !isTest(name))
      .map(name => `${directory}/${name}`));
  }
  const names = [...new Set([...source, ...engine, ...scripts, ...configuration])]
    .filter(name => fs.existsSync(path.join(root, name))).sort();
  assert.ok(source.length && engine.length, 'Simulator build sources are missing; run this command from a complete checkout.');
  const hash = crypto.createHash('sha256').update('simulator-build-inputs:v1\0');
  for (const name of names) { hash.update(name).update('\0').update(fs.readFileSync(path.join(root, name))).update('\0'); }
  return hash.digest('hex');
}

function readRecord(root) {
  let record;
  try { record = JSON.parse(fs.readFileSync(recordPath(root), 'utf8')); }
  catch { throw new Error('No successful simulator build attestation exists. Run npm run build before deploying.'); }
  assert.ok(record?.schemaVersion === 1 && SHA256.test(record.inputHash), 'Invalid simulator build attestation. Rebuild before deploying.');
  return record;
}

function writeRecord(root, record) {
  const file = recordPath(root), temporary = `${file}.${crypto.randomUUID()}.tmp`;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  try { fs.writeFileSync(temporary, JSON.stringify(record, null, 2) + '\n'); fs.renameSync(temporary, file); }
  finally { fs.rmSync(temporary, { force: true }); }
}

/** Call only after the actual Angular build exits successfully. */
function recordCompiledBuild({ inputHash, configuration, ...options }) {
  assert.ok(SHA256.test(inputHash), 'An input hash captured before compilation is required.');
  assert.ok(typeof configuration === 'string' && configuration.length > 0, 'The Angular build configuration is required.');
  assert.equal(captureBuildInputs(options), inputHash, 'Simulator inputs changed during compilation. Rebuild before deploying.');
  const record = { schemaVersion: 1, inputHash, configuration, compiledAt: new Date().toISOString() };
  // A newly compiled build must pass finalization and budgets again; never carry
  // the previous package verification over a partially successful build.
  writeRecord(rootFor(options), record);
  return record;
}

function verifiedFiles(root, expectedHash) {
  const directory = path.join(root, 'ptcg-play/cloudflare-public');
  const manifestBytes = fs.readFileSync(path.join(directory, 'simulator-manifest.json'));
  const manifest = JSON.parse(manifestBytes);
  validateManifest(manifest, 'https://local.invalid/simulator-manifest.json');
  assert.equal(manifest.packageHash, expectedHash, 'The release pointer differs from the verified simulator package. Rebuild before deploying.');
  assert.ok(manifest.archive, 'The simulator ZIP archive is missing. Rebuild before deploying.');
  const release = path.join(directory, 'releases', manifest.packageHash);
  for (const asset of [...manifest.assets, manifest.archive]) {
    const bytes = fs.readFileSync(path.join(release, asset.path));
    assert.equal(bytes.length, asset.bytes, `${asset.path}: package byte count changed. Rebuild before deploying.`);
    assert.equal(digest(bytes), asset.sha256, `${asset.path}: package content changed. Rebuild before deploying.`);
  }
  return { manifest, manifestHash: digest(manifestBytes) };
}

/** Call only after finalization and all size-budget checks succeed. */
function recordVerifiedPackage(packageHash, options = {}) {
  assert.ok(SHA256.test(packageHash), 'A finalized package hash is required.');
  const root = rootFor(options), compiled = readRecord(root);
  assert.equal(captureBuildInputs(options), compiled.inputHash, 'Simulator inputs changed after compilation. Rebuild before deploying.');
  const { manifest, manifestHash } = verifiedFiles(root, packageHash);
  const record = { ...compiled, verifiedPackageHash: packageHash, verifiedManifestHash: manifestHash,
    verifiedBuildId: manifest.buildId, verifiedAt: new Date().toISOString() };
  writeRecord(root, record);
  return record;
}

/** Read-only predeploy gate; Worker/domain changes do not invalidate frontend inputs. */
function verifyDeploy(options = {}) {
  const root = rootFor(options), record = readRecord(root);
  assert.equal(record.configuration, 'production', 'Deployment requires a successful production simulator build.');
  assert.ok(SHA256.test(record.verifiedPackageHash) && SHA256.test(record.verifiedManifestHash),
    'Simulator finalization and size budgets have not been verified for this build. Run npm run build before deploying.');
  assert.equal(captureBuildInputs(options), record.inputHash, 'Simulator source/configuration changed since the verified build. Rebuild before deploying.');
  const { manifest, manifestHash } = verifiedFiles(root, record.verifiedPackageHash);
  assert.equal(manifestHash, record.verifiedManifestHash, 'The simulator manifest changed since verification. Rebuild before deploying.');
  return { ok: true, inputHash: record.inputHash, configuration: record.configuration,
    packageHash: manifest.packageHash, buildId: manifest.buildId, assets: manifest.assets.length, archiveBytes: manifest.archive.bytes };
}

if (require.main === module) {
  try {
    assert.ok(process.argv.length === 3 && ['verify', 'capture'].includes(process.argv[2]),
      'Usage: node build-attestation.cjs verify|capture');
    console.log(process.argv[2] === 'capture' ? captureBuildInputs() : JSON.stringify(verifyDeploy(), null, 2));
  } catch (failure) { console.error(failure.message); process.exitCode = 1; }
}
module.exports = { captureBuildInputs, recordCompiledBuild, recordVerifiedPackage, verifyDeploy };
