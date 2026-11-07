#!/usr/bin/env node
'use strict';

// Local files/stdin only. Uses the built production helper and verifies the
// complete hydrated state with the untrimmed StateSerializer oracle.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');

function sizes(json, stateData) {
  const gzip = zlib.gzipSync(Buffer.from(json, 'utf8'), { level: 6 });
  return { jsonUtf8Bytes: Buffer.byteLength(json), base64Chars: stateData.length,
    gzip6JsonBytes: gzip.length, gzip6JsonBase64Chars: gzip.toString('base64').length };
}

function productionTools() {
  const entry = path.join(root, 'ptcg-server/browser');
  const { ClientSimulator, compactSerializedState } = require(path.join(entry, 'client'));
  if (typeof compactSerializedState !== 'function') {
    throw new Error('Build the engine first; browser/client must export compactSerializedState.');
  }
  const { Base64 } = require(path.join(entry, 'utils/base64'));
  const { StateSerializer } = require(path.join(entry, 'game/serializer/state-serializer'));
  return { ClientSimulator, compactSerializedState, Base64, StateSerializer };
}

function createTrimmer() {
  const { ClientSimulator, compactSerializedState, Base64, StateSerializer } = productionTools();
  const codec = new Base64();
  const serializer = new StateSerializer();
  const simulator = new ClientSimulator();
  const cached = new Map();
  const records = [];
  function trimJson(json, originalStateData, location) {
    const original = originalStateData || codec.encode(json);
    let result = cached.get(original);
    if (!result) {
      const compactJson = compactSerializedState(json);
      const stateData = codec.encode(compactJson);
      // Full serialization is deliberately retained as the independent oracle:
      // ClientSimulator.getStateData itself may now return a compact payload.
      const full = serializer.serialize(simulator.validateSnapshot(original));
      const restored = serializer.serialize(simulator.validateSnapshot(stateData));
      assert.equal(restored, full, 'Trimming must preserve the complete hydrated state and shared references.');
      const first = new ClientSimulator(), reload = new ClientSimulator();
      let emission;
      try {
        first.loadSnapshot({ stateData });
        emission = first.getStateData();
        reload.loadSnapshot({ stateData: emission });
        assert.equal(reload.getStateData(), emission, 'A normalized emitted snapshot must remain byte-stable on reload.');
      } finally { first.cleanup(); reload.cleanup(); }
      const before = sizes(json, original), after = sizes(compactJson, stateData);
      result = { json: compactJson, stateData, report: {
        before, after, saved: Object.fromEntries(Object.keys(before).map(key => [key, before[key] - after[key]])),
        verification: { fullHydratedStateIdentical: true, sharedReferenceGraphIdentical: true,
          winConditionsPreserved: true, canonicalFullStateSha256: hash(full),
          normalizedEmissionIdempotent: true, normalizedEmissionSha256: hash(emission) },
        inputStateDataSha256: hash(original), outputStateDataSha256: hash(stateData)
      } };
      cached.set(original, result);
    }
    records.push({ location, ...result.report });
    return result;
  }
  return {
    records,
    trimJson,
    trimStateData(value, location) { return trimJson(codec.decode(value), value, location).stateData; },
    cleanup() { simulator.cleanup(); }
  };
}

function transformInput(bytes, trimmer) {
  const gzipped = bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;
  const text = (gzipped ? zlib.gunzipSync(bytes) : bytes).toString('utf8').trim();
  const trimUrl = (value, location) => {
    const url = new URL(value);
    if (!url.hash) throw new Error('A puzzle URL must contain its Base64 snapshot fragment.');
    url.hash = trimmer.trimStateData(decodeURIComponent(url.hash.slice(1)), location);
    return url.href;
  };
  let result, format;
  if (/^https?:\/\//i.test(text)) {
    result = trimUrl(text, 'url.fragment');
    format = 'url';
  } else if (/^[{\[]/.test(text)) {
    const value = JSON.parse(text);
    if (Array.isArray(value) && Array.isArray(value[1]?.cardNames)) {
      result = trimmer.trimJson(text, undefined, 'serialized-state').json;
      format = 'serialized-json';
    } else {
      let count = 0;
      for (const [location, object] of [['fixture', value], ['fixture.puzzle', value?.puzzle]]) {
        if (!object || typeof object !== 'object' || Array.isArray(object)) continue;
        if (typeof object.stateData === 'string') {
          object.stateData = trimmer.trimStateData(object.stateData, location + '.stateData'); count++;
        }
        for (const key of ['newWebviewUrl', 'webviewUrl']) {
          if (typeof object[key] === 'string' && object[key]) {
            object[key] = trimUrl(object[key], location + '.' + key + '.fragment'); count++;
          }
        }
      }
      if (!count) throw new Error('JSON must be a serialized state or contain stateData/newWebviewUrl/webviewUrl.');
      result = JSON.stringify(value, null, 2);
      format = 'json-fixture';
    }
  } else {
    result = trimmer.trimStateData(text, 'stateData');
    format = 'base64';
  }
  const output = Buffer.from(result + '\n', 'utf8');
  return { bytes: gzipped ? zlib.gzipSync(output, { level: 6 }) : output,
    format: gzipped ? 'gzip-' + format : format };
}

function usage() {
  return 'Usage: node tools/trim-puzzle-payload.cjs <input-file | Base64 | full-URL | ->\n'
    + '       [--out output-file] [--report report.json]\n'
    + 'Accepts serialized JSON, JSON puzzle/solution fixtures and gzip fixture containers.\n'
    + 'Output keeps that format; gzip is a local container, not a new simulator payload format.\n'
    + 'Without --out, payload goes to stdout and the sizes/equivalence report to stderr.\n'
    + 'With --out, only the report goes to stdout. No requests or API mutations are made.';
}

function main(args = process.argv.slice(2)) {
  if (args.includes('--help') || args.includes('-h')) { console.log(usage()); return; }
  let input, outputFile, reportFile;
  for (let index = 0; index < args.length; index++) {
    if (args[index] === '--out' || args[index] === '--report') {
      const option = args[index], value = args[++index];
      if (!value || value.startsWith('--')) throw new Error(option + ' requires a file path.');
      if (option === '--out') outputFile = value;
      else reportFile = value;
    }
    else if (input === undefined) input = args[index];
    else throw new Error('Unexpected argument: ' + args[index]);
  }
  if (!input) throw new Error(usage());
  const fromFile = input !== '-' && fs.existsSync(input);
  const bytes = input === '-' ? fs.readFileSync(0) : fromFile ? fs.readFileSync(input) : Buffer.from(input, 'utf8');
  const log = console.log;
  let trimmer;
  // Card registry initialization logs to stdout; never contaminate payload bytes.
  try { console.log = (...values) => console.error(...values); trimmer = createTrimmer(); }
  finally { console.log = log; }
  try {
    const transformed = transformInput(bytes, trimmer);
    const report = { schemaVersion: 1, format: transformed.format,
      input: fromFile ? path.resolve(input) : input === '-' ? 'stdin' : 'literal',
      inputContainerBytes: bytes.length, outputContainerBytes: transformed.bytes.length,
      sameExistingPayloadSchema: true, snapshots: trimmer.records };
    const reportText = JSON.stringify(report, null, 2) + '\n';
    if (outputFile) fs.writeFileSync(outputFile, transformed.bytes);
    if (reportFile) fs.writeFileSync(reportFile, reportText);
    if (outputFile) process.stdout.write(reportText);
    else { process.stdout.write(transformed.bytes); process.stderr.write(reportText); }
    return report;
  } finally { trimmer.cleanup(); }
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(error.stack || error); process.exitCode = 1; }
}
module.exports = { main, transformInput, createTrimmer, sizes };
