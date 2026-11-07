'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const zlib = require('node:zlib');
const {
  PREFIX, FIELD_CODE_PREFIX, MAX_COMPRESSED, MAX_EXPANDED, decoder,
  encodeGzipJson, encodeFieldCodeGzipJson, createCodec, transformInput,
} = require('./gzip-puzzle-payload.cjs');

const root = path.resolve(__dirname, '..');
const fixtureBytes = fs.readFileSync(path.join(__dirname, 'fixtures/deck-out-with-dengo.snapshot.json.gz'));
const fixture = JSON.parse(zlib.gunzipSync(fixtureBytes).toString('utf8'));
const json = Buffer.from(fixture.stateData, 'base64').toString('utf8');
const urlPrefix = 'https://sim-static.prizemap.app/sandbox-viewer?mode=example#';

function withCodec(decodeOnly, run, options) {
  const codec = createCodec(decodeOnly, options), log = console.log;
  try { console.log = () => {}; return run(codec); }
  finally { console.log = log; codec.cleanup(); }
}
function encoded() { return withCodec(false, codec => codec.convert(fixture.stateData, 'fixture')); }
function fieldEncoded() {
  return withCodec(false, codec => codec.convert(fixture.stateData, 'fixture'), { fieldCodes: true });
}

test('real Dengo fixture round-trips through the actual production decoder and engine oracle', () => {
  withCodec(false, codec => {
    const result = transformInput(fixtureBytes, codec);
    assert.equal(result.format, 'gzip-json-fixture');
    const value = JSON.parse(zlib.gunzipSync(result.bytes).toString('utf8'));
    assert.equal(value.name, fixture.name);
    assert.equal(value.sourceUrl, fixture.sourceUrl);
    assert.match(value.stateData, /^gz1\.[A-Za-z0-9_-]+$/);
    assert.ok(value.stateData.length < 2300);
    const restored = decoder()(value.stateData);
    assert.equal(restored.length, 10000);
    assert.equal(codec.records[0].verification.fullHydratedStateIdentical, true);
    assert.equal(codec.records[0].verification.normalizedEmissionIdempotent, true);
    const bytes = Buffer.from(value.stateData.slice(PREFIX.length), 'base64url');
    assert.deepEqual(bytes.subarray(0, 3), Buffer.from([0x1f, 0x8b, 8]));
    assert.equal(zlib.gunzipSync(bytes).toString('base64'), restored);
  });
});

test('plain Base64, raw JSON and URL inputs produce the same transport without changing URL routing', () => {
  withCodec(false, codec => {
    const token = encoded();
    for (const input of [fixture.stateData, json]) {
      assert.equal(transformInput(Buffer.from(input), codec).bytes.toString('utf8').trim(), token);
    }
    const result = transformInput(Buffer.from(urlPrefix + fixture.stateData), codec);
    const url = new URL(result.bytes.toString('utf8').trim());
    assert.equal(url.origin, 'https://sim-static.prizemap.app');
    assert.equal(url.pathname, '/sandbox-viewer');
    assert.equal(url.search, '?mode=example');
    assert.equal(url.hash.slice(1), token);
    assert.equal(result.format, 'url');
  });
});

test('wrapper conversion touches only simulator snapshot fields and leaves TCG Masters source metadata intact', () => {
  const sourceUrl = 'https://tcgmasters.net/play#original-source';
  const original = { sourceUrl, description: 'gz1.not-a-payload', puzzle: {
    name: fixture.name, tcgMastersUrl: sourceUrl, metadata: { raw: fixture.stateData },
    stateData: fixture.stateData, webviewUrl: urlPrefix + fixture.stateData,
    newWebviewUrl: urlPrefix + fixture.stateData,
  } };
  withCodec(false, codec => {
    const result = JSON.parse(transformInput(Buffer.from(JSON.stringify(original)), codec).bytes.toString('utf8'));
    assert.equal(result.sourceUrl, sourceUrl);
    assert.equal(result.description, original.description);
    assert.equal(result.puzzle.tcgMastersUrl, sourceUrl);
    assert.deepEqual(result.puzzle.metadata, original.puzzle.metadata);
    assert.equal(result.puzzle.stateData, encoded());
    assert.equal(new URL(result.puzzle.webviewUrl).hash.slice(1), result.puzzle.stateData);
    assert.equal(result.puzzle.webviewUrl, result.puzzle.newWebviewUrl);
  });
});

test('already encoded input is idempotent and decode restores plain compact Base64', () => {
  const token = encoded();
  withCodec(false, codec => assert.equal(codec.convert(token, 'encoded'), token));
  withCodec(true, codec => {
    const plain = codec.convert(token, 'encoded');
    assert.equal(plain, decoder()(token));
    assert.ok(!plain.startsWith(PREFIX));
    const result = transformInput(Buffer.from(urlPrefix + token), codec);
    assert.equal(new URL(result.bytes.toString('utf8')).hash.slice(1), plain);
  });
});

test('decode mode preserves plain legacy bytes and does not implicitly trim history snapshots', () => {
  for (const value of ['', 'not-base64', ' YQ==\n', fixture.stateData]) {
    assert.equal(decoder()(value), value);
    withCodec(true, codec => assert.equal(codec.convert(value, 'legacy'), value));
  }
  const token = encoded();
  const { ClientSimulator } = require('../ptcg-server/browser/client');
  const simulator = new ClientSimulator();
  try {
    simulator.loadSnapshot({ stateData: decoder()(token) });
    const snapshot = simulator.getStateData();
    assert.ok(!snapshot.startsWith(PREFIX));
    assert.equal(decoder()(snapshot), snapshot);
    simulator.pushState(snapshot);
    assert.equal(simulator.getStateData(), snapshot);
  } finally { simulator.cleanup(); }
});

test('UTF-8 names, astral characters and escaped lone-surrogate JSON survive gzip transport', () => {
  const value = JSON.parse(json);
  value[0][0].name = 'Pokémon 日本語 🐉';
  value[1].notes = { raw: 'A\ud800B', astral: '𝄞' };
  withCodec(false, codec => {
    const result = codec.convertJson(JSON.stringify(value), 'unicode');
    const restored = JSON.parse(Buffer.from(decoder()(result), 'base64').toString('utf8'));
    assert.equal(restored[0][0].name, value[0][0].name);
    assert.deepEqual(restored[1].notes, value[1].notes);
  });
});

test('producer bounds match the production decoder and never emit an oversized transport', () => {
  assert.throws(() => encodeGzipJson('x'.repeat(MAX_EXPANDED + 1)), /Expanded puzzle is too large/);
  const random = crypto.randomBytes(MAX_COMPRESSED + 200000).toString('base64');
  assert.throws(() => encodeGzipJson(random), /Compressed puzzle is too large/);
});

test('explicit invalid inputs fail closed while unrelated fixture fields are not treated as payloads', () => {
  withCodec(false, codec => {
    for (const input of ['', '  ', '{}', '[]', 'not a puzzle', 'https://tcgmasters.net/play',
      JSON.stringify({ tcgMastersUrl: 'https://tcgmasters.net/play#source' })]) {
      assert.throws(() => transformInput(Buffer.from(input), codec));
    }
  });
  for (const value of ['gz1.', 'gz1.abc=', 'gz1.abc+', 'gz2.abc']) {
    assert.throws(() => decoder()(value));
  }
});

test('CLI stdin/stdout and output/report paths remain usable without contaminating payload bytes', () => {
  const cli = path.join(__dirname, 'gzip-puzzle-payload.cjs');
  const run = spawnSync(process.execPath, [cli, '-'], { cwd: root, input: fixture.stateData, encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  const token = run.stdout.trim();
  assert.match(token, /^gz1\.[A-Za-z0-9_-]+$/);
  assert.equal(token, encoded());
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'gzip-puzzle-cli-'));
  try {
    const out = path.join(directory, 'plain.txt'), report = path.join(directory, 'report.json');
    const decode = spawnSync(process.execPath, [cli, '-', '--decode', '--out', out, '--report', report], {
      cwd: root, input: token, encoding: 'utf8'
    });
    assert.equal(decode.status, 0, decode.stderr);
    assert.equal(fs.readFileSync(out, 'utf8').trim(), decoder()(token));
    assert.equal(JSON.parse(fs.readFileSync(report, 'utf8')).operation, 'decode');
    assert.equal(JSON.parse(decode.stdout).operation, 'decode');
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
});

test('gz2 uses the actual fixed field helper and restores the same canonical Dengo JSON as gz1', () => {
  const compactBase64 = decoder()(encoded());
  const compactJson = Buffer.from(compactBase64, 'base64').toString('utf8');
  const token = encodeFieldCodeGzipJson(compactJson);
  assert.match(token, /^gz2\.[A-Za-z0-9_-]+$/);
  assert.equal(token, fieldEncoded());
  assert.equal(decoder()(token), compactBase64);
  const codedJson = zlib.gunzipSync(Buffer.from(token.slice(FIELD_CODE_PREFIX.length), 'base64url')).toString('utf8');
  assert.notEqual(codedJson, compactJson, 'The gz2 body must actually contain coded field names.');
  assert.ok(Buffer.byteLength(codedJson) < Buffer.byteLength(compactJson));
  const pretty = JSON.stringify(JSON.parse(compactJson), null, 2);
  assert.equal(encodeFieldCodeGzipJson(pretty), token, 'Field coding canonicalizes JSON formatting.');
});

test('gz2 retains unknown/code-colliding field names, values, array order and reference paths', () => {
  const value = JSON.parse('[[],{"_type":"State","cardNames":["cards","_type","Gholdengo ex PAR"],"id":43,"a":"raw a","":"empty key","~future":"leading escape","__proto__":{"safe":true},"constructor":"data","custom":{"2":"two","10":"ten","日本語":"🐉"},"players":[{"_type":"Ref","path":"0.0.active.cards"}]}]');
  const canonical = JSON.stringify(value);
  const token = encodeFieldCodeGzipJson(canonical);
  const decodedJson = Buffer.from(decoder()(token), 'base64').toString('utf8');
  assert.equal(decodedJson, canonical);
  const decoded = JSON.parse(decodedJson);
  assert.deepEqual(decoded[1].cardNames, value[1].cardNames);
  assert.deepEqual(decoded[1].players, value[1].players);
  assert.equal(decoded[1].id, 43);
  assert.equal(Object.hasOwn(decoded[1], '__proto__'), true);
  assert.equal({}.safe, undefined);
});

test('gz2 options preserve URL/wrapper forms and support idempotence plus rollback to gz1/plain', () => {
  const gz1 = encoded(), gz2 = fieldEncoded();
  withCodec(false, codec => {
    for (const value of [fixture.stateData, gz1, gz2]) assert.equal(codec.convert(value, 'fixture'), gz2);
    const raw = transformInput(Buffer.from(json), codec).bytes.toString('utf8').trim();
    assert.equal(raw, gz2);
    const wrapped = { tcgMastersUrl: 'https://tcgmasters.net/play#source', puzzle: {
      stateData: fixture.stateData, webviewUrl: urlPrefix + fixture.stateData,
    } };
    const result = JSON.parse(transformInput(Buffer.from(JSON.stringify(wrapped)), codec).bytes.toString('utf8'));
    assert.equal(result.tcgMastersUrl, wrapped.tcgMastersUrl);
    assert.equal(result.puzzle.stateData, gz2);
    assert.equal(new URL(result.puzzle.webviewUrl).hash.slice(1), gz2);
    assert.equal(new URL(result.puzzle.webviewUrl).search, '?mode=example');
  }, { fieldCodes: true });
  withCodec(false, codec => assert.equal(codec.convert(gz2, 'rollback'), gz1));
  withCodec(true, codec => {
    assert.equal(codec.convert(gz2, 'decode'), decoder()(gz1));
    assert.equal(codec.convert(fixture.stateData, 'legacy'), fixture.stateData);
  });
});

test('CLI --field-codes selects gz2 while its default remains gz1 and --decode supports both', () => {
  const cli = path.join(__dirname, 'gzip-puzzle-payload.cjs');
  const run = spawnSync(process.execPath, [cli, '-', '--field-codes'], { cwd: root, input: fixture.stateData, encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  assert.equal(run.stdout.trim(), fieldEncoded());
  const decode = spawnSync(process.execPath, [cli, '-', '--decode'], { cwd: root, input: run.stdout.trim(), encoding: 'utf8' });
  assert.equal(decode.status, 0, decode.stderr);
  assert.equal(decode.stdout.trim(), decoder()(encoded()));
  const invalid = spawnSync(process.execPath, [cli, '-', '--decode', '--field-codes'], {
    cwd: root, input: run.stdout.trim(), encoding: 'utf8'
  });
  assert.notEqual(invalid.status, 0);
  assert.equal(invalid.stdout, '');
  assert.match(invalid.stderr, /omit it with --decode/);
});
