'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const test = require('node:test');
const { packageClientBuild, SNAPSHOT_FORMATS_META } = require('./package-client-build.cjs');
const { createReport, validateBudgets } = require('./report-client-bundle.cjs');

function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'simulator-bundle-report-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const source = path.join(directory, 'source'), destination = path.join(directory, 'cdn');
  fs.mkdirSync(path.join(source, 'assets/simulator'), { recursive: true });
  fs.writeFileSync(path.join(source, 'index.html'), SNAPSHOT_FORMATS_META + '<base href="./"><script src="main.abc.js"></script><script src="simulator-static.abc.js"></script>');
  fs.writeFileSync(path.join(source, 'main.abc.js'), 'var cards="executable";'.repeat(100));
  fs.writeFileSync(path.join(source, 'simulator-static.abc.js'), 'var icons="embedded";');
  fs.writeFileSync(path.join(source, 'assets/simulator/cards.abc.json'), '{"cards":[]}');
  fs.writeFileSync(path.join(source, '3rdpartylicenses.txt'), 'Preserved runtime inventory overhead.');
  const manifest = packageClientBuild({ root: source, destination });
  return { root: destination, manifest };
}

test('report measures the complete verified inventory and separates the recorded baseline cohort', t => {
  const { root, manifest } = fixture(t);
  const report = createReport({ root, baseline: { 'main.old.js': { bytes: 5000, gzipBytes: 1000 },
    'simulator-static.old.js': { bytes: 3000, gzipBytes: 2000 }, 'cards.old.json': { bytes: 2000, gzipBytes: 1500 } } });
  assert.equal(report.runtime.files, manifest.assets.length);
  assert.equal(report.runtime.bytes, manifest.assets.reduce((total, asset) => total + asset.bytes, 0));
  assert.ok(report.runtime.bytes > report.comparison.after.bytes, 'HTML/license overhead belongs only to the complete inventory');
  assert.equal(report.comparison.before.bytes, 10000);
  assert.equal(report.comparison.before.gzipBytes, 4500);
  assert.equal(report.groups.main.files, 1);
  assert.equal(report.groups.bootstrap.files, 1);
  assert.equal(report.groups.metadata.files, 1);
  assert.equal(report.archive.bytes, manifest.archive.bytes);
  assert.ok(report.runtime.gzipBytes > 0 && report.runtime.brotliBytes > 0 && report.passed);
  const repeat = createReport({ root, baseline: report });
  assert.deepEqual(repeat.comparison.before, report.comparison.before, 'Saved reports preserve the original baseline for future builds');
});

test('report rejects stale or corrupted release bytes rather than measuring the wrong artifact', t => {
  const { root, manifest } = fixture(t);
  const file = path.join(root, 'releases', manifest.packageHash, 'main.abc.js');
  const original = fs.readFileSync(file);
  fs.writeFileSync(file, Buffer.alloc(original.length, 'x'));
  assert.throws(() => createReport({ root }), /SHA-256 differs/);
  fs.writeFileSync(file, original);
  fs.appendFileSync(path.join(root, 'releases', manifest.packageHash, manifest.archive.path), 'x');
  assert.throws(() => createReport({ root }), /file size differs/);
});

test('size gates fail independently for compressed runtime, ZIP and individual files', () => {
  const checks = validateBudgets({ runtime: { gzipBytes: 7 }, archive: { bytes: 9 }, files: [{ bytes: 26 }] },
    { gzipRuntimeBytes: 6, archiveBytes: 8, individualFileBytes: 25 });
  assert.deepEqual(checks.map(check => check.passed), [false, false, false]);
  assert.deepEqual(checks.map(check => check.actual), [7, 9, 26]);
});
