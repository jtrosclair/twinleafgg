#!/usr/bin/env node
'use strict';

// Local payload experiments only. No production codecs, snapshots or game rules
// are changed. All timings below are Node timings, including its Web Streams API.
// Example: node tools/benchmark-puzzle-payload.cjs --runs 100 --warmup 15
//   --variants-out /tmp/startup-payload-browser-variants.json
//   --browser-out /tmp/twinleaf-payload-benchmark.html
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const crypto = require('node:crypto');
const { performance } = require('node:perf_hooks');

const root = path.resolve(__dirname, '..');
const enginePath = path.join(root, 'ptcg-server/browser');
const { Base64 } = require(path.join(enginePath, 'utils/base64'));
const { StateSerializer } = require(path.join(enginePath, 'game/serializer/state-serializer'));
const { ClientSimulator, ensureClientCards } = require(path.join(enginePath, 'client'));
const constructors = Object.assign({}, ...[
  'game/store/state/state', 'game/store/state/rules', 'game/store/state/player',
  'game/store/state/card-marker', 'game/core/game-settings',
  'game/store/state/card-list', 'game/store/state/pokemon-card-list'
].map(module => require(path.join(enginePath, module))));
const codec = new Base64();
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const rounded = value => Number(value.toFixed(4));

function arrayFromDecode(value) {
  const binary = atob(value);
  return new TextDecoder().decode(Uint8Array.from(binary, byte => byte.charCodeAt(0)));
}
function arrayFromEncode(value) {
  const bytes = new TextEncoder().encode(value);
  return btoa(Array.from(bytes, byte => String.fromCodePoint(byte)).join(''));
}

function nativeBytes(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
  return bytes;
}
function nativeDecode(value) { return decoder.decode(nativeBytes(value)); }
function nativeEncode(value) {
  const bytes = encoder.encode(value);
  let binary = '';
  for (let index = 0; index < bytes.length; index += 32768) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 32768));
  }
  return btoa(binary);
}
async function decompressStream(value) {
  const stream = new Blob([nativeBytes(value)]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Response(stream).text();
}
function stats(values) {
  const sorted = values.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return { medianMs: rounded(sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2),
    p95Ms: rounded(sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.95) - 1)]) };
}
function measure(run, runs, warmup) {
  const values = [];
  let last;
  for (let index = -warmup; index < runs; index++) {
    const start = performance.now();
    last = run();
    if (index >= 0) values.push(performance.now() - start);
  }
  return { ...stats(values), resultLength: typeof last === 'string' ? last.length : undefined };
}
async function measureAsync(run, runs, warmup) {
  const values = [];
  for (let index = -warmup; index < runs; index++) {
    const start = performance.now();
    await run();
    if (index >= 0) values.push(performance.now() - start);
  }
  return stats(values);
}
function fixture(file) {
  const bytes = fs.readFileSync(file);
  const text = (file.endsWith('.gz') ? zlib.gunzipSync(bytes) : bytes).toString('utf8').trim();
  const value = /^[{\[]/.test(text) ? JSON.parse(text) : text;
  const puzzle = value.puzzle || value;
  const url = puzzle.newWebviewUrl || puzzle.webviewUrl;
  const stateData = typeof value === 'string' ? value : value.stateData || puzzle.stateData
    || (url && decodeURIComponent(new URL(url).hash.slice(1)));
  if (!stateData) throw new Error(`No snapshot in ${file}`);
  return { name: puzzle.name || path.basename(file), file, stateData, winConditions: puzzle.winConditions };
}

function defaultTable() {
  const result = {};
  for (const name of ['State', 'Rules', 'Player', 'Marker', 'GameSettings', 'CardList', 'PokemonCardList']) {
    const Constructor = constructors[name];
    if (!Constructor) throw new Error(`Missing ${name} export`);
    result[name] = Object.fromEntries(Object.entries(new Constructor()).filter(([key, value]) =>
      // These fields are read before constructor defaults can restore them.
      !['_type', 'cards', 'cardNames'].includes(key)
      && (value === null || ['string', 'boolean', 'number'].includes(typeof value)
        || Array.isArray(value) && value.length === 0)));
  }
  return result;
}
function compactDefaults(value, defaults) {
  const references = new Set();
  const visit = node => {
    if (!node || typeof node !== 'object') return;
    if (node._type === 'Ref' && typeof node.path === 'string') references.add(node.path);
    Object.values(node).forEach(visit);
  };
  visit(value);
  let removed = 0;
  const copy = (node, at = '') => {
    if (!node || typeof node !== 'object') return node;
    if (Array.isArray(node)) return node.map((item, index) => copy(item, at ? `${at}.${index}` : String(index)));
    const result = {};
    for (const [key, item] of Object.entries(node)) {
      const location = at ? `${at}.${key}` : key;
      const table = defaults[node._type];
      const referenced = [...references].some(reference => reference === location || reference.startsWith(location + '.'));
      if (!referenced && table && Object.prototype.hasOwnProperty.call(table, key)
        && JSON.stringify(item) === JSON.stringify(table[key])) { removed++; continue; }
      result[key] = copy(item, location);
    }
    return result;
  };
  return { value: copy(value), removed };
}
function dictionary(value) {
  const keys = [], lookup = new Map();
  const encode = node => {
    if (!node || typeof node !== 'object') return node;
    if (Array.isArray(node)) return node.map(encode);
    const result = {};
    for (const [key, item] of Object.entries(node)) {
      if (!lookup.has(key)) { lookup.set(key, keys.length); keys.push(key); }
      result[lookup.get(key)] = encode(item);
    }
    return result;
  };
  return { v: 1, keys, data: encode(value) };
}
function expandDictionary(value) {
  const decode = node => {
    if (!node || typeof node !== 'object') return node;
    if (Array.isArray(node)) return node.map(decode);
    return Object.fromEntries(Object.entries(node).map(([key, item]) => [value.keys[Number(key)], decode(item)]));
  };
  return decode(value.data);
}
function unicodeChecks() {
  const cases = ['ASCII', 'Pokémon café 日本語', '🐉𝄞', '\ud800', '\udfff', 'A\ud800B'];
  return cases.map(value => {
    const json = JSON.stringify({ value });
    const expectedRaw = value.replace(/[\ud800-\udbff](?![\udc00-\udfff])|(?<![\ud800-\udbff])[\udc00-\udfff]/g, '\ufffd');
    assert.equal(nativeDecode(nativeEncode(json)), json);
    assert.equal(codec.decode(codec.encode(json)), json);
    assert.equal(nativeEncode(json), codec.encode(json));
    assert.equal(nativeDecode(nativeEncode(value)), expectedRaw);
    return { input: JSON.stringify(value), jsonRoundTrip: true, sameBase64Bytes: true,
      rawTextRoundTrip: nativeDecode(nativeEncode(value)) === value };
  });
}

function browserBenchmarkHtml(variants) {
  const data = variants.map(value => ({ ...value, gzipBase64: zlib.gzipSync(Buffer.from(value.originalStateData, 'base64'), { level: 6 }).toString('base64') }));
  return String.raw`<!doctype html><meta charset="utf-8"><title>Puzzle payload codec benchmark</title>
<style>body{font:16px system-ui;margin:28px;max-width:1100px;background:#f7f8fa;color:#14212d}button{padding:12px 20px;font:inherit}pre{white-space:pre-wrap;background:white;border:1px solid #ccd3da;padding:16px;font:12px ui-monospace,monospace}table{border-collapse:collapse;background:white;margin:20px 0;width:100%}th,td{border:1px solid #ccd3da;text-align:left;padding:8px}#status{margin:16px 0}</style>
<h1>Puzzle payload codec benchmark</h1>
<p>Actual browser microbenchmarks: array-from codec baseline versus indexed loops, decode + JSON.parse only. No engine hydration, page startup, artwork or networking. Five fixed snapshots, 150 measured samples and 10 warmups per method. Gzip uses this browser's DecompressionStream when available.</p>
<button id="run" type="button">Run benchmark</button><div id="status" role="status">Ready</div>
<table><thead><tr><th>Puzzle</th><th>Method</th><th>Median ms</th><th>p95 ms</th></tr></thead><tbody id="rows"></tbody></table>
<pre id="result">Results will appear here.</pre>
<script>
'use strict';
const fixtures=${JSON.stringify(data).replace(/</g, '\u003c')};
const runs=150,warmup=10;
function currentDecode(value){const binary=atob(value);const bytes=Uint8Array.from(binary,b=>b.charCodeAt(0));return new TextDecoder().decode(bytes);}
function currentEncode(value){const bytes=new TextEncoder().encode(value);const binary=Array.from(bytes,byte=>String.fromCodePoint(byte)).join('');return btoa(binary);}
function nativeBytes(value){const binary=atob(value);const bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);return bytes;}
function tightDecode(value){return new TextDecoder().decode(nativeBytes(value));}
function encode(value){const bytes=new TextEncoder().encode(value);let binary='';for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));return btoa(binary);}
async function gzipDecode(value){const stream=new Blob([nativeBytes(value)]).stream().pipeThrough(new DecompressionStream('gzip'));return new Response(stream).text();}
function assert(condition,message){if(!condition)throw new Error(message);}
function summary(values){values.sort((a,b)=>a-b);return {medianMs:Number(((values[74]+values[75])/2).toFixed(4)),p95Ms:Number(values[Math.ceil(values.length*.95)-1].toFixed(4))};}
let sink;
function measure(run){const values=[];for(let i=-warmup;i<runs;i++){const start=performance.now();sink=run();if(i>=0)values.push(performance.now()-start);}return summary(values);}
async function measureAsync(run){const values=[];for(let i=-warmup;i<runs;i++){const start=performance.now();sink=await run();if(i>=0)values.push(performance.now()-start);}return summary(values);}
const paint=()=>new Promise(resolve=>requestAnimationFrame(()=>setTimeout(resolve,0)));
function row(name,method,result){const tr=document.createElement('tr');for(const value of [name,method,result.medianMs,result.p95Ms]){const td=document.createElement('td');td.textContent=String(value);tr.appendChild(td);}document.getElementById('rows').appendChild(tr);}
function unicodeChecks(){const cases=['ASCII','Pokémon café 日本語','🐉𝄞',String.fromCharCode(0xd800),String.fromCharCode(0xdfff),'A'+String.fromCharCode(0xd800)+'B'];return cases.map(value=>{const json=JSON.stringify({value});assert(tightDecode(encode(json))===json,'JSON Unicode roundtrip failed');assert(currentDecode(encode(json))===json,'Current Unicode roundtrip failed');return {input:JSON.stringify(value),jsonRoundTrip:true,rawTextRoundTrip:tightDecode(encode(value))===value};});}
document.getElementById('run').addEventListener('click',async()=>{
 const button=document.getElementById('run');button.disabled=true;document.getElementById('rows').textContent='';
 const report={schemaVersion:1,measuredAt:new Date().toISOString(),userAgent:navigator.userAgent,runs,warmup,
  method:'Browser array-from codec baseline versus indexed loops, decode + JSON.parse microbenchmark; no engine hydration, startup, network or artwork. Node-generated gzip bytes are decompressed by the browser. Microsecond-scale values may be quantized by browser timer precision.',
  decompressionStream:typeof DecompressionStream==='function',unicode:[],fixtures:[]};
 try{
  report.unicode=unicodeChecks();
  for(let i=0;i<fixtures.length;i++){
   const f=fixtures[i],json=currentDecode(f.originalStateData),compactJson=currentDecode(f.compactStateData);
   assert(tightDecode(f.originalStateData)===json,'Byte conversion mismatch');
   assert(encode(json)===currentEncode(json),'Base64 encoding mismatch against current encoder');
   assert(JSON.stringify(JSON.parse(tightDecode(f.originalStateData)))===JSON.stringify(JSON.parse(json)),'Parsed JSON mismatch');
   if(report.decompressionStream)assert(await gzipDecode(f.gzipBase64)===json,'Gzip mismatch');
   const result={name:f.name,sizes:{base64Chars:f.originalStateData.length,jsonUtf8Bytes:new TextEncoder().encode(json).length,
    compactBase64Chars:f.compactStateData.length,gzipBase64Chars:f.gzipBase64.length},equivalenceVerified:true,originalBytesAreCanonicalUtf8:encode(json)===f.originalStateData,timings:{}};
   const methods={arrayFromBase64DecodeJsonParse:()=>JSON.parse(currentDecode(f.originalStateData)),
    tightLoopBase64DecodeJsonParse:()=>JSON.parse(tightDecode(f.originalStateData)),
    rawJsonParse:()=>JSON.parse(json),
    compatibleCompactArrayFromDecodeJsonParse:()=>JSON.parse(currentDecode(f.compactStateData)),
    compatibleCompactTightDecodeJsonParse:()=>JSON.parse(tightDecode(f.compactStateData))};
   for(const [name,run]of Object.entries(methods)){
    document.getElementById('status').textContent='Running '+(i+1)+'/'+fixtures.length+': '+f.name+' — '+name;await paint();
    result.timings[name]=measure(run);row(f.name,name,result.timings[name]);
   }
   if(report.decompressionStream){document.getElementById('status').textContent='Running '+f.name+' — gzip DecompressionStream';await paint();
    result.timings.gzipDecompressionStreamJsonParse=await measureAsync(async()=>JSON.parse(await gzipDecode(f.gzipBase64)));row(f.name,'gzipDecompressionStreamJsonParse',result.timings.gzipDecompressionStreamJsonParse);}
   report.fixtures.push(result);
   document.getElementById('result').textContent=JSON.stringify(report,null,2);
  }
  document.getElementById('status').textContent='Complete: all five payloads and Unicode checks passed';
 }catch(error){report.error=String(error.stack||error);document.getElementById('status').textContent='Failed: '+error.message;}
 finally{document.getElementById('result').textContent=JSON.stringify(report,null,2);button.disabled=false;}
});
</script>`;
}

async function main() {
  const args = process.argv.slice(2);
  let runs = 100, warmup = 15, variantsFile, browserFile;
  const files = [];
  for (let index = 0; index < args.length; index++) {
    if (args[index] === '--runs') runs = Number(args[++index]);
    else if (args[index] === '--warmup') warmup = Number(args[++index]);
    else if (args[index] === '--variants-out') variantsFile = args[++index];
    else if (args[index] === '--browser-out') browserFile = args[++index];
    else files.push(args[index]);
  }
  if (!Number.isInteger(runs) || runs < 1 || !Number.isInteger(warmup) || warmup < 0) throw new Error('Invalid run counts');
  if (!files.length) files.push(...['phantom-maze', 'explosive-hand', 'breaking-through-wall', 'somethings-fishy']
    .map(name => path.join(__dirname, '.puzzle-playthrough', `${name}.solution.json`)),
  path.join(__dirname, 'fixtures/deck-out-with-dengo.snapshot.json.gz'));
  const log = console.log;
  try { console.log = (...items) => console.error(...items); ensureClientCards(); } finally { console.log = log; }
  const defaults = defaultTable();
  const serializer = new StateSerializer();
  const validate = new ClientSimulator();
  const report = { schemaVersion: 1, measuredAt: new Date().toISOString(), node: process.version,
    platform: `${process.platform}/${process.arch}`, runs, warmup,
    method: 'Local Node only. Browser-compatible loops use atob/btoa/TextEncoder/TextDecoder; DecompressionStream is Node Web Streams, not measured in a browser. Buffer/zlib are Node-only controls. Hydrate timings use StateSerializer ref restoration and card construction. validateSnapshot timings additionally include the current codec, normalization and validation. No game effects, artwork, network or browser rendering.',
    base64SourceSha256: digest(fs.readFileSync(path.join(root, 'ptcg-server/src/utils/base64.ts'))),
    base64CompiledSha256: digest(fs.readFileSync(path.join(enginePath, 'utils/base64.js'))),
    defaultConstructorTableSha256: digest(JSON.stringify(defaults)), unicode: unicodeChecks(), fixtures: [] };
  const variants = [];
  for (const input of files.map(file => fixture(path.resolve(file)))) {
    const json = codec.decode(input.stateData);
    assert.equal(nativeDecode(input.stateData), json);
    assert.equal(arrayFromDecode(input.stateData), json);
    assert.equal(nativeEncode(json), arrayFromEncode(json));
    const raw = JSON.parse(json);
    const compact = compactDefaults(raw, defaults);
    const compactJson = JSON.stringify(compact.value);
    const compactStateData = nativeEncode(compactJson);
    const dict = dictionary(raw), dictJson = JSON.stringify(dict), dictBase64 = nativeEncode(dictJson);
    assert.deepEqual(expandDictionary(dict), raw);
    const canonical = serializer.serialize(validate.validateSnapshot(input.stateData));
    const compactCanonical = serializer.serialize(validate.validateSnapshot(compactStateData));
    assert.deepEqual(JSON.parse(compactCanonical), JSON.parse(canonical));
    const hydrated = serializer.deserialize(canonical);
    assert.equal(hydrated.gameSettings.rules, hydrated.rules);
    assert.deepEqual(hydrated.winConditions, raw[1].winConditions);
    const gzip = zlib.gzipSync(Buffer.from(json), { level: 6 });
    const gzipBase64 = gzip.toString('base64');
    assert.equal(await decompressStream(gzipBase64), json);
    const hydrate = decodedJson => serializer.deserialize(decodedJson);
    const timings = {
      baselineArrayFromBase64Decode: measure(() => arrayFromDecode(input.stateData), runs, warmup),
      currentBase64Decode: measure(() => codec.decode(input.stateData), runs, warmup),
      nativeLoopBase64Decode: measure(() => nativeDecode(input.stateData), runs, warmup),
      nodeBufferBase64Decode: measure(() => Buffer.from(input.stateData, 'base64').toString('utf8'), runs, warmup),
      currentBase64Encode: measure(() => codec.encode(json), runs, warmup),
      baselineArrayFromBase64Encode: measure(() => arrayFromEncode(json), runs, warmup),
      nativeChunkedBase64Encode: measure(() => nativeEncode(json), runs, warmup),
      jsonParseOnly: measure(() => JSON.parse(json), runs, warmup),
      rawJsonHydrate: measure(() => hydrate(json), runs, warmup),
      currentBase64DecodeHydrate: measure(() => hydrate(codec.decode(input.stateData)), runs, warmup),
      nativeLoopBase64DecodeHydrate: measure(() => hydrate(nativeDecode(input.stateData)), runs, warmup),
      compactCurrentBase64DecodeHydrate: measure(() => hydrate(codec.decode(compactStateData)), runs, warmup),
      compactBase64DecodeHydrate: measure(() => hydrate(nativeDecode(compactStateData)), runs, warmup),
      currentValidateSnapshot: measure(() => validate.validateSnapshot(input.stateData), runs, warmup),
      compactCurrentValidateSnapshot: measure(() => validate.validateSnapshot(compactStateData), runs, warmup),
      keyDictionaryDecodeHydrate: measure(() => hydrate(JSON.stringify(expandDictionary(JSON.parse(nativeDecode(dictBase64))))), runs, warmup),
      nodeGunzipDecodeHydrate: measure(() => hydrate(zlib.gunzipSync(Buffer.from(gzipBase64, 'base64')).toString('utf8')), runs, warmup),
      nodeWebStreamGzipDecodeHydrate: await measureAsync(async () => hydrate(await decompressStream(gzipBase64)), runs, warmup)
    };
    const verification = { currentDecoderCompatible: true, canonicalHydratedStateEqual: true,
      canonicalSha256: digest(canonical), sharedRulesReference: hydrated.gameSettings.rules === hydrated.rules,
      embeddedWinConditionsPreserved: true, removedDefaultFields: compact.removed };
    report.fixtures.push({ name: input.name, file: path.relative(root, input.file),
      inputBase64Sha256: digest(input.stateData), cardCount: raw[1].cardNames.length,
      sizes: { originalBase64Chars: input.stateData.length, jsonUtf8Bytes: Buffer.byteLength(json),
        rawJsonUriComponentChars: encodeURIComponent(json).length, gzip6Bytes: gzip.length,
        gzipBase64Chars: gzipBase64.length, compactJsonBytes: Buffer.byteLength(compactJson),
        compactBase64Chars: compactStateData.length, keyDictionaryJsonBytes: Buffer.byteLength(dictJson),
        keyDictionaryBase64Chars: dictBase64.length,
        keyDictionaryGzip6Bytes: zlib.gzipSync(dictJson, { level: 6 }).length }, verification, timings });
    variants.push({ name: input.name, originalStateData: input.stateData, compactStateData, verification });
  }
  validate.cleanup();
  if (variantsFile) fs.writeFileSync(variantsFile, JSON.stringify(variants, null, 2) + '\n');
  if (browserFile) fs.writeFileSync(browserFile, browserBenchmarkHtml(variants));
  console.log(JSON.stringify(report, null, 2));
}

main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
