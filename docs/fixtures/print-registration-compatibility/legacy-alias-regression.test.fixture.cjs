const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const esbuild = require('../../cloudflare/node_modules/esbuild');

const bundle = path.join(os.tmpdir(), `prizemap-legacy-alias-${process.pid}.mjs`);
esbuild.buildSync({ entryPoints: [path.join(__dirname, 'test-entry.ts')], bundle: true,
  platform: 'browser', format: 'esm', target: 'es2022', outfile: bundle, logLevel: 'silent' });
const engine = import(pathToFileURL(bundle).href);
test.after(() => { try { fs.unlinkSync(bundle); } catch {} });

test('set-code aliases can resolve a legacyFullName without selecting a new print', async () => {
  const e = await engine;
  e.ensureClientCards();
  const manager = e.CardManager.getInstance();
  const legacy = manager.getCardByName("Professor's Research BRS");
  assert.ok(legacy);
  Object.assign(legacy, { fullName: 'Different Name ZZ', name: 'Different Name', set: 'ZZ',
    setNumber: '17', legacyFullName: 'Probe PFL' });
  manager.defineSet([legacy]);
  const deckList = '1 Probe M2 999';
  const direct = new e.DeckImportParser().parseDeckList(deckList);
  assert.equal(direct.knownCards[0]?.fullName, 'Different Name ZZ');
  const response = await e.handle(new Request('https://test.local/v1/deck-import/parse', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ deckList })
  }));
  const result = await response.json();
  assert.equal(response.status, 200);
  assert.equal(result.knownCards[0]?.fullName, 'Different Name ZZ');
});
