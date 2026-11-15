const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { refresh, japanesePrints, validateMap } = require('./refresh-card-images.cjs');
const origin = 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com';
const en = origin + '/tpci/PBL/PBL_039_R_EN.png';
const jp = origin + '/tpc/M5/M5_37_R_JP.png';
const html = '<div class="card-page-main"><img data-src="' + en + '">' +
  '<a href="/cards/jp/M5/37">Dhelmise</a><a href="/cards/jp/M5/88">Other art</a>';
const incoming = () => ({ ...Object.fromEntries(Array.from({ length: 10000 }, (_, i) => ['SET ' + i, en])), 'M5 37': jp });

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'card-image-sync-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const dir = path.join(root, 'ptcg-server/data'); fs.mkdirSync(dir, { recursive: true });
  const index = path.join(dir, 'limitlesstcg-images.json');
  const japanese = path.join(dir, 'japanese-card-images.json');
  fs.writeFileSync(index, JSON.stringify({ 'LEGACY 9': jp }));
  return { root, index, japanese };
}

test('refresh merges the new index, retains legacy aliases and saves exact Japanese print links', async t => {
  const f = fixture(t); const requests = [];
  const fetcher = async url => {
    requests.push(url);
    return { ok: true, json: async () => incoming(), text: async () => html };
  };
  const result = await refresh({ workspace: f.root, fetcher, log() {} });
  assert.equal(result.setsRefreshed, 1);
  assert.equal(JSON.parse(fs.readFileSync(f.index))['LEGACY 9'], jp);
  assert.equal(JSON.parse(fs.readFileSync(f.japanese))['/tpci/PBL/PBL_039_R_EN.png'], '/tpc/M5/M5_37_R_JP.png');
  requests.length = 0;
  await refresh({ workspace: f.root, fetcher, log() {} });
  assert.equal(requests.length, 1, 'An unchanged sync only downloads the central index, not every set page');
});

test('incomplete indexes and failed print-list requests leave the committed files untouched', async t => {
  const f = fixture(t); const original = fs.readFileSync(f.index, 'utf8');
  await assert.rejects(refresh({ workspace: f.root, fetcher: async () => ({ ok: true, json: async () => ({}) }), log() {} }), /incomplete/);
  await assert.rejects(refresh({ workspace: f.root, fetcher: async url => url.includes('large.json')
    ? { ok: true, json: async () => incoming() } : { ok: false, status: 503 }, log() {} }), /503/);
  assert.equal(fs.readFileSync(f.index, 'utf8'), original);
  assert.equal(fs.existsSync(f.japanese), false);
});

test('Japanese counterparts use indexed images and never guess English collector numbers or bogus NAN links', () => {
  assert.equal(japanesePrints(html, { 'M5 37': jp })['/tpci/PBL/PBL_039_R_EN.png'], '/tpc/M5/M5_37_R_JP.png');
  assert.equal(japanesePrints(html.replace('M5/37', 'M5/NAN37'), { 'M5 NAN37': jp })['/tpci/PBL/PBL_039_R_EN.png'], '');
  assert.equal(japanesePrints(html, {})['/tpci/PBL/PBL_039_R_EN.png'], '');
  assert.throws(() => japanesePrints('<html>Cloudflare error</html>', {}), /no recognized/);
});

test('only the supported static CDN hosts are accepted', () => {
  assert.throws(() => validateMap({ ...incoming(), bad: 'https://example.com/image.png' }), /Invalid/);
  assert.throws(() => validateMap({ ...incoming(), bad: origin + '/tpci/PBL/file.png?redirect=evil' }), /Invalid/);
});
