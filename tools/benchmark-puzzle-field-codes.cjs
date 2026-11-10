#!/usr/bin/env node
'use strict';

// Desktop Node microbenchmark of the actual frontend decoder, without network,
// browser rendering, engine startup, or producer compression in the timed spans.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const zlib = require('node:zlib');
const crypto = require('node:crypto');
const { performance } = require('node:perf_hooks');
const { decoder, encodeGzipJson, encodeFieldCodeGzipJson } = require('./gzip-puzzle-payload.cjs');
const { createTrimmer } = require('./trim-puzzle-payload.cjs');
const root = path.resolve(__dirname, '..');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const round = value => Number(value.toFixed(4));

function options(args) {
  const value = { runs: 500, warmup: 100, files: [] };
  for (let index = 0; index < args.length; index++) {
    if (args[index] === '--runs' || args[index] === '--warmup') {
      const key = args[index].slice(2), number = Number(args[++index]);
      if (!Number.isSafeInteger(number) || number < (key === 'runs' ? 1 : 0)) {
        throw new Error('--' + key + ' requires ' + (key === 'runs' ? 'a positive' : 'a nonnegative') + ' integer.');
      }
      value[key] = number;
    } else if (args[index].startsWith('-')) {
      throw new Error('Usage: node tools/benchmark-puzzle-field-codes.cjs [--warmup 100] [--runs 500] [fixture ...]');
    } else value.files.push(args[index]);
  }
  if (!value.files.length) {
    value.files = ['phantom-maze', 'explosive-hand', 'breaking-through-wall', 'somethings-fishy']
      .map(name => path.join(__dirname, '.puzzle-playthrough', name + '.solution.json'));
    value.files.push(path.join(__dirname, 'fixtures/deck-out-with-dengo.snapshot.json.gz'));
  }
  value.files = value.files.map(file => path.resolve(file));
  return value;
}

function fixture(file) {
  const bytes = fs.readFileSync(file);
  const text = (file.endsWith('.gz') ? zlib.gunzipSync(bytes) : bytes).toString('utf8').trim();
  const value = /^[{\[]/.test(text) ? JSON.parse(text) : text;
  const puzzle = value.puzzle || value;
  const url = puzzle.newWebviewUrl || puzzle.webviewUrl;
  const stateData = Array.isArray(value) ? Buffer.from(text).toString('base64')
    : typeof value === 'string' ? value : value.stateData || puzzle.stateData
      || (url && decodeURIComponent(new URL(url).hash.slice(1)));
  if (typeof stateData !== 'string' || !stateData) throw new Error('Missing puzzle snapshot in ' + file);
  return { file: path.relative(root, file), name: puzzle.name || path.basename(file), stateData };
}

function stats(samples) {
  const sorted = samples.slice().sort((a, b) => a - b), middle = Math.floor(sorted.length / 2);
  return {
    medianMs: round(sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2),
    p95Ms: round(sorted[Math.ceil(sorted.length * 0.95) - 1]), minMs: round(sorted[0])
  };
}

function main(args = process.argv.slice(2)) {
  const config = options(args), decode = decoder();
  const originalLog = console.log;
  let trimmer;
  console.log = (...values) => console.error(...values);
  try {
    trimmer = createTrimmer();
    const fixtures = config.files.map(file => {
      const value = fixture(file);
      const expected = trimmer.trimStateData(decode(value.stateData), value.file);
      const json = Buffer.from(expected, 'base64').toString('utf8');
      const tokens = { gz1: encodeGzipJson(json), gz2: encodeFieldCodeGzipJson(json) };
      const samples = { gz1: [], gz2: [] };
      for (let index = -config.warmup; index < config.runs; index++) {
        // Alternate paired order to avoid consistently giving either format
        // the first allocation/GC position. Output checks are outside timing.
        for (const version of Math.abs(index) % 2 ? ['gz2', 'gz1'] : ['gz1', 'gz2']) {
          const start = performance.now(), actual = decode(tokens[version]);
          const elapsed = performance.now() - start;
          assert.equal(actual, expected);
          if (index >= 0) samples[version].push(elapsed);
        }
      }
      const formats = Object.fromEntries(Object.entries(tokens).map(([version, token]) => [version, {
        tokenCharacters: token.length,
        compressedBytes: Buffer.from(token.slice(4), 'base64url').length,
        ...stats(samples[version])
      }]));
      return { name: value.name, fixture: value.file, compactJsonUtf8Bytes: Buffer.byteLength(json),
        decodedBase64Characters: expected.length, decodedBase64Sha256: hash(expected),
        everyDecodedOutputIdentical: true, ...formats,
        gz2MinusGz1MedianMs: round(formats.gz2.medianMs - formats.gz1.medianMs) };
    });
    const result = { schemaVersion: 1, measuredAt: new Date().toISOString(), desktopNodeOnly: true,
      runtime: process.version, platform: process.platform, arch: process.arch, cpu: os.cpus()[0].model,
      method: 'Actual production decodePuzzlePayload via CLI decoder(); identical validated compact JSON; gzip level 6; paired alternating order; output equality checked outside timed spans. No browser, phone, engine setup, DOM, network or producer encoding timings.',
      warmupPerFormatPerFixture: config.warmup, samplesPerFormatPerFixture: config.runs,
      decoderSha256: hash(fs.readFileSync(path.join(root, 'ptcg-play/src/app/shared/services/puzzle-payload.ts'))),
      fieldHelperSha256: hash(fs.readFileSync(path.join(root, 'ptcg-play/src/app/shared/services/puzzle-field-codes.ts'))),
      fixtures };
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    return result;
  } finally { trimmer?.cleanup(); console.log = originalLog; }
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(error.stack || error); process.exitCode = 1; }
}
module.exports = { main };
