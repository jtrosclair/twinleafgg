#!/usr/bin/env node
'use strict';

// Local initial-URL transport encoder. Does not change the existing trim CLI,
// saved puzzle APIs, engine snapshots, or host history message formats.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const zlib = require('node:zlib');
const crypto = require('node:crypto');
const { createTrimmer } = require('./trim-puzzle-payload.cjs');

const root = path.resolve(__dirname, '..');
const PREFIX = 'gz1.';
const FIELD_CODE_PREFIX = 'gz2.';
const MAX_COMPRESSED = 1024 * 1024;
const MAX_EXPANDED = 8 * 1024 * 1024;
let productionDecoder;
const frontendModules = new Map();

/** Load pure frontend TS modules and relative TS imports with their own deps. */
function frontendModule(file) {
  file = path.resolve(file);
  if (frontendModules.has(file)) return frontendModules.get(file).exports;
  const ts = require(path.join(root, 'ptcg-play/node_modules/typescript'));
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2018, esModuleInterop: true }
  }).outputText;
  const loaded = new Module(file, module);
  loaded.filename = file;
  loaded.paths = Module._nodeModulePaths(path.dirname(file));
  const requireNative = loaded.require.bind(loaded);
  loaded.require = request => {
    if (request.startsWith('.')) {
      const base = path.resolve(path.dirname(file), request);
      const candidate = [base, base + '.ts', path.join(base, 'index.ts')]
        .find(value => value.endsWith('.ts') && fs.existsSync(value) && fs.statSync(value).isFile());
      if (candidate) return frontendModule(candidate);
    }
    return requireNative(request);
  };
  frontendModules.set(file, loaded);
  try { loaded._compile(code, file); }
  catch (error) { frontendModules.delete(file); throw error; }
  return loaded.exports;
}

/** Load the actual pure frontend codec with its own pinned dependencies. */
function decoder() {
  if (productionDecoder) return productionDecoder;
  const api = frontendModule(path.join(root, 'ptcg-play/src/app/shared/services/puzzle-payload.ts'));
  assert.equal(api.GZIP_PUZZLE_PREFIX, PREFIX);
  assert.equal(api.MAX_COMPRESSED_PUZZLE_BYTES, MAX_COMPRESSED);
  assert.equal(api.MAX_EXPANDED_PUZZLE_BYTES, MAX_EXPANDED);
  assert.equal(typeof api.decodePuzzlePayload, 'function');
  productionDecoder = api.decodePuzzlePayload;
  return productionDecoder;
}

function gzipTransport(json, prefix, decodedJson) {
  const bytes = Buffer.from(json, 'utf8'), decodedBytes = Buffer.from(decodedJson, 'utf8');
  if (bytes.length > MAX_EXPANDED || decodedBytes.length > MAX_EXPANDED) throw new Error('Expanded puzzle is too large.');
  const gzip = zlib.gzipSync(bytes, { level: 6 });
  if (gzip.length > MAX_COMPRESSED) throw new Error('Compressed puzzle is too large.');
  const result = prefix + gzip.toString('base64url');
  assert.equal(decoder()(result), decodedBytes.toString('base64'), 'Production decoder must restore the exact canonical UTF-8 bytes.');
  return result;
}

function encodeGzipJson(json) { return gzipTransport(json, PREFIX, json); }

function encodeFieldCodeGzipJson(json) {
  const api = frontendModule(path.join(root, 'ptcg-play/src/app/shared/services/puzzle-field-codes.ts'));
  assert.equal(typeof api.encodePuzzleFieldCodes, 'function');
  const canonical = JSON.stringify(JSON.parse(json));
  return gzipTransport(api.encodePuzzleFieldCodes(canonical), FIELD_CODE_PREFIX, canonical);
}

function createCodec(decodeOnly = false, { fieldCodes = false } = {}) {
  const records = [];
  let trimmer;
  const getTrimmer = () => trimmer || (trimmer = createTrimmer());
  const digest = value => crypto.createHash('sha256').update(value).digest('hex');
  const convert = (stateData, location) => {
    const plain = decoder()(stateData);
    if (decodeOnly) {
      records.push({ location, inputCharacters: stateData.length, outputCharacters: plain.length,
        decodedGzip: stateData.startsWith(PREFIX) || stateData.startsWith(FIELD_CODE_PREFIX),
        legacyBytesUnchanged: !stateData.startsWith(PREFIX) && !stateData.startsWith(FIELD_CODE_PREFIX) });
      return plain;
    }
    const trim = getTrimmer();
    const compact = trim.trimStateData(plain, location);
    const json = Buffer.from(compact, 'base64').toString('utf8');
    const result = fieldCodes ? encodeFieldCodeGzipJson(json) : encodeGzipJson(json);
    const verification = trim.records[trim.records.length - 1];
    records.push({ location, inputCharacters: stateData.length, compactBase64Characters: compact.length,
      gzipPayloadCharacters: result.length, compactJsonUtf8Bytes: Buffer.byteLength(json),
      transport: fieldCodes ? FIELD_CODE_PREFIX : PREFIX,
      gzipBytes: Buffer.from(result.slice(result.indexOf('.') + 1), 'base64url').length,
      gzipPayloadSha256: digest(result), verification: verification.verification });
    return result;
  };
  return {
    records,
    convert,
    convertJson(json, location) {
      return convert(Buffer.from(json, 'utf8').toString('base64'), location);
    },
    cleanup() { trimmer?.cleanup(); }
  };
}

function transformInput(bytes, codec) {
  const containerGzip = bytes.length > 1 && bytes[0] === 0x1f && bytes[1] === 0x8b;
  const text = (containerGzip ? zlib.gunzipSync(bytes) : bytes).toString('utf8').trim();
  if (!text) throw new Error('A puzzle payload is required.');
  const convertUrl = (text, location) => {
    const url = new URL(text);
    if (!url.hash || !url.hash.slice(1).trim()) throw new Error('A puzzle URL must include a snapshot fragment.');
    url.hash = codec.convert(decodeURIComponent(url.hash.slice(1)), location);
    return url.href;
  };
  let result, format;
  if (/^https?:\/\//i.test(text)) {
    result = convertUrl(text, 'url.fragment'); format = 'url';
  } else if (/^[{\[]/.test(text)) {
    const value = JSON.parse(text);
    if (Array.isArray(value) && Array.isArray(value[1]?.cardNames)) {
      result = codec.convertJson(text, 'serialized-state'); format = 'payload';
    } else {
      let changed = 0;
      for (const [location, object] of [['fixture', value], ['fixture.puzzle', value?.puzzle]]) {
        if (!object || typeof object !== 'object' || Array.isArray(object)) continue;
        if (typeof object.stateData === 'string' && object.stateData.trim()) {
          object.stateData = codec.convert(object.stateData, location + '.stateData'); changed++;
        }
        for (const key of ['newWebviewUrl', 'webviewUrl']) {
          if (typeof object[key] === 'string' && object[key].trim()) {
            object[key] = convertUrl(object[key], location + '.' + key + '.fragment'); changed++;
          }
        }
      }
      if (!changed) throw new Error('JSON does not contain a simulator snapshot.');
      result = JSON.stringify(value, null, 2); format = 'json-fixture';
    }
  } else { result = codec.convert(text, 'stateData'); format = 'payload'; }
  const output = Buffer.from(result + '\n', 'utf8');
  return { bytes: containerGzip ? zlib.gzipSync(output, { level: 6 }) : output,
    format: containerGzip ? 'gzip-' + format : format };
}

function usage() {
  return 'Usage: node tools/gzip-puzzle-payload.cjs <file | Base64 | gz1.payload | gz2.payload | full-URL | ->\n'
    + '       [--field-codes | --decode] [--out output-file] [--report report.json]\n'
    + 'Default: compact and verify the existing snapshot, then encode initial transport as gz1.\n'
    + '--field-codes selects gz2 with the fixed shared field-name map.\n'
    + '--decode restores either transport to plain Base64; legacy payload bytes are unchanged.\n'
    + 'URLs, known fixture fields and gzip fixture containers keep their outer form.\n'
    + 'Raw serialized JSON becomes a transport token. No network or API writes occur.\n'
    + 'Without --out, payload goes to stdout and metrics to stderr.';
}

function main(args = process.argv.slice(2)) {
  if (args.includes('--help') || args.includes('-h')) { console.log(usage()); return; }
  let input, out, reportPath, decodeOnly = false, fieldCodes = false;
  for (let index = 0; index < args.length; index++) {
    const argument = args[index];
    if (argument === '--decode') decodeOnly = true;
    else if (argument === '--field-codes') fieldCodes = true;
    else if (argument === '--out' || argument === '--report') {
      const value = args[++index];
      if (!value || value.startsWith('--')) throw new Error(argument + ' requires a file path.');
      if (argument === '--out') out = value; else reportPath = value;
    } else if (argument.startsWith('--')) throw new Error('Unknown option: ' + argument);
    else if (input === undefined) input = argument;
    else throw new Error('Unexpected argument: ' + argument);
  }
  if (input === undefined) throw new Error(usage());
  if (decodeOnly && fieldCodes) throw new Error('--field-codes selects encoding; omit it with --decode.');
  if (out && reportPath && path.resolve(out) === path.resolve(reportPath)) throw new Error('Payload and report paths must differ.');
  const file = input !== '-' && fs.existsSync(input);
  const bytes = input === '-' ? fs.readFileSync(0) : file ? fs.readFileSync(input) : Buffer.from(input, 'utf8');
  const codec = createCodec(decodeOnly, { fieldCodes });
  const log = console.log;
  try {
    console.log = (...values) => console.error(...values);
    const transformed = transformInput(bytes, codec);
    const report = { schemaVersion: 1, operation: decodeOnly ? 'decode' : 'encode',
      transport: decodeOnly ? 'plain-base64' : fieldCodes ? FIELD_CODE_PREFIX : PREFIX,
      format: transformed.format, input: file ? path.resolve(input) : input === '-' ? 'stdin' : 'literal',
      inputContainerBytes: bytes.length, outputContainerBytes: transformed.bytes.length, snapshots: codec.records };
    const text = JSON.stringify(report, null, 2) + '\n';
    if (out) fs.writeFileSync(out, transformed.bytes);
    if (reportPath) fs.writeFileSync(reportPath, text);
    if (out) process.stdout.write(text);
    else { process.stdout.write(transformed.bytes); process.stderr.write(text); }
    return report;
  } finally { console.log = log; codec.cleanup(); }
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(error.stack || error); process.exitCode = 1; }
}
module.exports = { PREFIX, FIELD_CODE_PREFIX, MAX_COMPRESSED, MAX_EXPANDED, decoder,
  encodeGzipJson, encodeFieldCodeGzipJson, createCodec, transformInput, main };
