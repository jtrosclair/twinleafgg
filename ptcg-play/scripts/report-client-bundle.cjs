#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const { validateManifest } = require('../../tools/check-simulator-package.cjs');

const MiB = 1048576;
const DEFAULT_BUDGETS = { gzipRuntimeBytes: 4 * MiB, archiveBytes: 5 * MiB, individualFileBytes: 20 * MiB };
const digest = data => crypto.createHash('sha256').update(data).digest('hex');
const sum = (files, key) => files.reduce((total, file) => total + (file[key] || 0), 0);
function category(filename) {
  const name = path.posix.basename(filename);
  if (/^main(?:\.|$)/.test(name) && name.endsWith('.js')) return 'main';
  if (/^simulator-static\.[^.]+\.js$/.test(name)) return 'bootstrap';
  if (/^cards\.(?!hash\.)[^.]+\.json$/.test(name)) return 'metadata';
  if (/^styles(?:\.|$)/.test(name) && name.endsWith('.css')) return 'styles';
  if (/^polyfills(?:\.|$)/.test(name) && name.endsWith('.js')) return 'polyfills';
  if (/^runtime(?:\.|$)/.test(name) && name.endsWith('.js')) return 'runtime';
  return 'other';
}
function totals(files) {
  return { files: files.length, bytes: sum(files, 'bytes'), gzipBytes: sum(files, 'gzipBytes'),
    ...(files.every(file => file.brotliBytes !== undefined) ? { brotliBytes: sum(files, 'brotliBytes') } : {}) };
}
function groups(files) {
  return Object.fromEntries([...new Set(files.map(file => file.category))].sort().map(name =>
    [name, totals(files.filter(file => file.category === name))]));
}
function validateBudgets(report, budgets = DEFAULT_BUDGETS) {
  return [
    { name: 'gzipRuntimeBytes', actual: report.runtime.gzipBytes, maximum: budgets.gzipRuntimeBytes },
    { name: 'archiveBytes', actual: report.archive.bytes, maximum: budgets.archiveBytes },
    { name: 'individualFileBytes', actual: Math.max(report.archive.bytes, ...report.files.map(file => file.bytes)),
      maximum: budgets.individualFileBytes }
  ].map(check => ({ ...check, passed: check.actual <= check.maximum }));
}
function createReport({ root = path.resolve(__dirname, '../cloudflare-public'), baseline,
  brotliQuality = 6, budgets = DEFAULT_BUDGETS } = {}) {
  assert.ok(Number.isInteger(brotliQuality) && brotliQuality >= 0 && brotliQuality <= 11, 'Brotli quality must be0–11');
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'simulator-manifest.json'), 'utf8'));
  validateManifest(manifest, 'https://local.invalid/simulator-manifest.json');
  assert.ok(manifest.archive, 'A finalized package with a ZIP archive is required');
  const release = path.join(root, 'releases', manifest.packageHash);
  function verifiedFile(asset) {
    const data = fs.readFileSync(path.join(release, asset.path));
    assert.equal(data.length, asset.bytes, `${asset.path}: file size differs from the manifest`);
    assert.equal(digest(data), asset.sha256, `${asset.path}: SHA-256 differs from the manifest`);
    return data;
  }
  const files = manifest.assets.map(asset => {
    const data = verifiedFile(asset);
    return { path: asset.path, category: category(asset.path), bytes: data.length,
      gzipBytes: zlib.gzipSync(data, { level: 6 }).length,
      brotliBytes: zlib.brotliCompressSync(data, { params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: brotliQuality,
        [zlib.constants.BROTLI_PARAM_SIZE_HINT]: data.length
      } }).length };
  });
  verifiedFile(manifest.archive);
  const report = {
    schemaVersion: 1, packageHash: manifest.packageHash, buildId: manifest.buildId, builtAt: manifest.builtAt,
    method: { runtimeScope: 'Every file in simulator-manifest.json assets; archive is separate.',
      compression: { gzipLevel: 6, brotliQuality, aggregation: 'Sum of separately compressed files, without HTTP headers.' },
      exclusions: 'Remote card artwork and network/protocol overhead are excluded. Sizes do not measure device loading or play performance.' },
    runtime: totals(files), groups: groups(files), archive: manifest.archive, files
  };
  if (baseline) {
    // A saved report retains the original measurements, so future builds can
    // compare against the same baseline without depending on a temporary file.
    const recorded = baseline.comparison?.beforeFiles || baseline.files;
    const entries = Array.isArray(recorded) ? recorded.map(file => [file.path, file]) : Object.entries(baseline);
    const beforeFiles = entries.map(([name, value]) => {
      assert.ok(Number.isSafeInteger(value.bytes) && value.bytes >= 0
        && Number.isSafeInteger(value.gzipBytes) && value.gzipBytes >= 0, `Invalid baseline entry:${name}`);
      return { path: name, category: category(name), bytes: value.bytes, gzipBytes: value.gzipBytes };
    });
    const categories = new Set(beforeFiles.map(file => file.category));
    const cohort = files.filter(file => categories.has(file.category));
    const before = totals(beforeFiles), after = totals(cohort);
    report.comparison = {
      scope: 'Recorded main/polyfills/runtime/bootstrap/styles/card-library cohort; excludes HTML, license, font CSS, favicon, manifest overhead and ZIP. Only recorded raw/gzip baseline values are compared.',
      before, beforeGroups: groups(beforeFiles), beforeFiles,
      after, afterGroups: groups(cohort),
      saved: { bytes: before.bytes - after.bytes, gzipBytes: before.gzipBytes - after.gzipBytes,
        rawPercent: Number((100 * (1 - after.bytes / before.bytes)).toFixed(2)),
        gzipPercent: Number((100 * (1 - after.gzipBytes / before.gzipBytes)).toFixed(2)) }
    };
  }
  report.budgets = validateBudgets(report, budgets);
  report.passed = report.budgets.every(check => check.passed);
  return report;
}
function parseArgs(args) {
  const options = {};
  for (let i = 0; i < args.length; i++) {
    const key = { '--root': 'root', '--baseline': 'baselineFile', '--output': 'output', '--brotli-quality': 'brotliQuality' }[args[i]];
    assert.ok(key && args[i + 1] !== undefined && options[key] === undefined, `Unknown, duplicate or incomplete option:${args[i]}`);
    options[key] = key === 'brotliQuality' ? Number(args[++i]) : path.resolve(args[++i]);
  }
  return options;
}
function main(args) {
  const options = parseArgs(args);
  if (options.baselineFile) options.baseline = JSON.parse(fs.readFileSync(options.baselineFile, 'utf8'));
  const report = createReport(options);
  const format = bytes => `${(bytes / MiB).toFixed(2)} MiB`;
  console.table(Object.fromEntries(Object.entries(report.groups).map(([name, value]) => [name, {
    files: value.files, raw: format(value.bytes), gzip6: format(value.gzipBytes), brotli: format(value.brotliBytes)
  }])));
  console.log(`Runtime: ${format(report.runtime.bytes)} raw; ${format(report.runtime.gzipBytes)} gzip6; ${format(report.runtime.brotliBytes)} Brotli${report.method.compression.brotliQuality}. ZIP: ${format(report.archive.bytes)}.`);
  if (report.comparison) console.log(`Recorded cohort reductions: ${report.comparison.saved.rawPercent}% raw, ${report.comparison.saved.gzipPercent}% gzip.`);
  for (const check of report.budgets) console.log(`${check.passed ? 'PASS' : 'FAIL'} ${check.name}: ${format(check.actual)} / ${format(check.maximum)}`);
  if (options.output) {
    fs.mkdirSync(path.dirname(options.output), { recursive: true });
    fs.writeFileSync(options.output, JSON.stringify(report, null, 2) + '\n');
    console.log(`Report: ${options.output}`);
  }
  if (!report.passed) process.exitCode = 1;
  return report;
}
if (require.main === module) {
  try { main(process.argv.slice(2)); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { category, totals, validateBudgets, createReport, parseArgs, DEFAULT_BUDGETS };
