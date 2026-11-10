const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { pathToFileURL } = require('node:url');
const ts = require('../../ptcg-server/node_modules/typescript');
const esbuild = require('../../cloudflare/node_modules/esbuild');
const root = path.resolve(__dirname, '../..');
const entry = path.join(os.tmpdir(), `prizemap-api-test-${process.pid}.mjs`);
esbuild.buildSync({ entryPoints: [path.join(__dirname, 'test-entry.ts')], bundle: true,
  platform: 'browser', format: 'esm', target: 'es2022', outfile: entry, logLevel: 'silent' });
const mod = import(pathToFileURL(entry).href);
test.after(() => { try { fs.unlinkSync(entry); } catch {} });

async function historical(engine) {
  const source = fs.readFileSync(path.join(__dirname, 'fixtures/historical-deck-import.ts'), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: {
    target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, experimentalDecorators: true
  } }).outputText;
  const module = { exports: {} };
  const fakeRequire = id => {
    if (id === '../../game') return { CardManager: engine.CardManager };
    if (id === './controller') return { Controller: class {}, Post: () => () => {} };
    if (id === '../../game/store/card/card-types') return { SuperType: engine.SuperType, TrainerType: engine.TrainerType };
    return require(id);
  };
  new Function('require','module','exports','__dirname',compiled)(fakeRequire,module,module.exports,__dirname);
  return new module.exports.DeckImport();
}
const post = (url, body) => new Request('https://api.example.test' + url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
const clean = value => JSON.parse(JSON.stringify(value));

test('deck parse and card lookup match the historical controller with real current card classes', async () => {
  const engine = await mod; engine.ensureClientCards();
  const old = await historical(engine);
  const imageData = JSON.parse(fs.readFileSync(path.join(root, 'simulator-api/large-card-images.json')));
  const images = new Map(Object.entries(imageData));
  old.imageCache = images;
  const port = new engine.DeckImportParser(images);
  // The old parser does not accept 30C; that deliberate compatibility fix is
  // covered separately. Keep the historical comparison exact for its inputs.
  const cards = engine.CardManager.getInstance().getAllCards().filter(c => c.set.toUpperCase() !== '30C');
  // Diverse real printings and repeated names preserve catalogue lookup ordering.
  const samples = [cards[0], cards.find(x => x.name === "N's Zoroark ex"), cards.find(x => x.superType === engine.SuperType.TRAINER), cards.find(x => x.usSetNumber)].filter(Boolean);
  const lines = samples.map((c, i) => `${i + 1} ${c.name} ${c.set} ${c.setNumber}`);
  lines.push('5 Basic {G} Energy SVE 1', '1 Absolutely Unknown SVE 1', 'bad nonsense', 'Pokémon: 1', 'Trainer: 3');
  const deck = lines.join('\n');
  assert.deepEqual(clean(port.parseDeckList(deck)), clean(old.parseDeckList(deck)));
  const unknown = port.parseDeckList('1 Absolutely Unknown SVE 1');
  assert.equal(unknown.unknownCards[0].cardImage, imageData['SVE 1'], 'unknown cards retain artwork when the legacy image map knows the print');
  const requested = [...samples.map(c => c.fullName), 'Missing ZZZ', samples[0].fullName];
  let historicalResponse;
  await old.onGetCards({ body: { cards: requested } }, { json: value => { historicalResponse = value; } });
  assert.deepEqual(clean(port.getCards(requested)), clean(historicalResponse));
  const actual = await (await engine.handle(post('/v1/deck-import/parse', { deckList: deck }))).json();
  assert.deepEqual(actual, clean(old.parseDeckList(deck)));
  const actualLookup = await (await engine.handle(post('/v1/deck-import/get-cards', { cards: requested }))).json();
  assert.deepEqual(actualLookup, clean(historicalResponse));
});

test('actual puzzle snapshots deserialize and preserve normalized transport', async () => {
  const engine = await mod;
  const fixtures = [
    JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/dengo-state.json'))),
    JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/phantom-maze-state.json')))
  ];
  for (const fixture of fixtures) {
    const result = await engine.handle(post('/v1/game/validate-state', { stateData: fixture.stateData }));
    assert.equal(result.status, 200, fixture.name);
    const data = await result.json();
    assert.equal(data.ok, true); assert.equal(data.valid, true);
    assert.equal(data.info.playerCount, 2); assert.equal(data.info.turn, 5);
    const normalized = JSON.parse(Buffer.from(data.serializedState, 'base64').toString('utf8'));
    assert.ok(Array.isArray(normalized)); assert.equal(normalized[1].cardNames.length > 0, true);
  }
  const original = Buffer.from(fixtures[0].stateData, 'base64').toString('utf8');
  const unknownState = JSON.parse(original);
  unknownState[1].cardNames[0] = 'Totally Fake Card XX 12';
  const unknown = await engine.handle(post('/v1/game/validate-state', { stateData: Buffer.from(JSON.stringify(unknownState)).toString('base64') }));
  assert.equal(unknown.status, 400); assert.equal((await unknown.json()).error, 'UNKNOWN_CARD');
  // Exercise the web client's full 8 MiB envelope with a multi-megabyte
  // player name that survives deserialization and is returned in info.state.
  const meaningful = JSON.parse(original);
  meaningful[0][0].name = 'x'.repeat(7 * 1024 * 1024);
  const meaningfulJson = JSON.stringify(meaningful);
  const padding = 8 * 1024 * 1024 - Buffer.byteLength(meaningfulJson, 'utf8');
  assert.ok(padding >= 0);
  const large = Buffer.from(meaningfulJson + ' '.repeat(padding)).toString('base64');
  const largeResponse = await engine.handle(post('/v1/game/validate-state', { stateData: large }));
  assert.equal(largeResponse.status, 200);
  const largeText = await largeResponse.text();
  assert.ok(Buffer.byteLength(largeText) < 32 * 1024 * 1024, 'this realistic expanded response fits Cloud Run HTTP/1 response cap');
  const largeResult = JSON.parse(largeText);
  assert.equal(largeResult.valid, true);
  assert.equal(largeResult.info.state.players[0].name, meaningful[0][0].name);
  assert.equal(JSON.parse(Buffer.from(largeResult.serializedState, 'base64').toString('utf8'))[0][0].name, meaningful[0][0].name);
});

test('validator preserves distinct known prints while normalizing external aliases', async () => {
  const engine = await mod;
  const fixture = JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/dengo-state.json')));
  const decoded = JSON.parse(Buffer.from(fixture.stateData, 'base64').toString('utf8'));
  decoded[1].cardNames[0] = 'Pikachu 30C 24';
  decoded[1].cardNames[1] = 'Pikachu 30C 23';
  decoded[1].cardNames[2] = 'Basic {G} Energy SVE 1';
  const result = await engine.handle(post('/v1/game/validate-state', { stateData: Buffer.from(JSON.stringify(decoded)).toString('base64') }));
  assert.equal(result.status, 200);
  const body = await result.json();
  const normalized = JSON.parse(Buffer.from(body.serializedState, 'base64').toString('utf8'));
  assert.deepEqual(normalized[1].cardNames.slice(0,3), ['Pikachu 30C 24', 'Pikachu 30C 23', 'Grass Energy SVE']);
  assert.notEqual(body.info.state.players.length, 0);
});

test('deck import accepts 30C and selects the requested Pikachu print', async () => {
  const engine = await mod;
  const result = await engine.handle(post('/v1/deck-import/parse', {
    deckList: '1 Pikachu 30C 23\n2 Pikachu 30C 24\n1 Pikachu 30C 999',
  }));
  assert.equal(result.status, 200);
  const body = await result.json();
  assert.equal(body.totalCards, 4);
  assert.deepEqual(body.parseErrors, []);
  assert.deepEqual(body.knownCards.slice(0, 2).map(card => [card.fullName, card.quantity]), [
    ['Pikachu 30C 23', 1], ['Pikachu 30C 24', 2],
  ]);
});

test('deck import preserves the legacy Heracross identity and finds the Lost Thunder print', async () => {
  const engine = await mod;
  const result = await engine.handle(post('/v1/deck-import/parse', {
    deckList: '1 Heracross BRS 12\n1 Heracross LOT 18',
  }));
  assert.equal(result.status, 200);
  const body = await result.json();
  assert.deepEqual(body.parseErrors, []);
  assert.deepEqual(body.unknownCards, []);
  assert.deepEqual(body.knownCards.map(card => card.fullName), ['Heracross BRS', 'Heracross LOT']);
});

test('deck import accepts digit-leading alphanumeric sets while rejecting numeric-only and overly long codes', async () => {
  const engine = await mod;
  const result = await engine.handle(post('/v1/deck-import/parse', { deckList: [
    '1 Absolutely Unknown 1A 1', '2 Absolutely Unknown 12AB 2', '3 Absolutely Unknown 1a2 3',
    '1 Grass Energy 1A 1', '1 Basic {G} Energy 1A 1',
    '1 Absolutely Unknown 123 1', '1 Absolutely Unknown 12ABC 1',
  ].join('\n') }));
  assert.equal(result.status, 200);
  const body = await result.json();
  assert.equal(body.totalCards, 8);
  assert.deepEqual(body.unknownCards.filter(card => card.name === 'Absolutely Unknown').map(card => card.setCode), ['1A', '12AB', '1A2']);
  assert.deepEqual(body.parseErrors, [
    'Could not parse line: "1 Absolutely Unknown 123 1"',
    'Could not parse line: "1 Absolutely Unknown 12ABC 1"',
  ]);
});

test('DLR deck imports and get-cards resolve every printed collector identity and image', async () => {
  const engine = await mod; engine.ensureClientCards();
  const names = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/dlr-printed-names.json')));
  assert.equal(names.length, 141);
  const cards = engine.CardManager.getInstance().getAllCards().filter(card => card.set === 'DLR');
  assert.equal(cards.length, 141);
  const byNumber = new Map(cards.map(card => [card.setNumber, card]));
  assert.equal(byNumber.size, 141);
  const identifiers = names.map((name, index) => `${name} DLR ${index + 1}`);
  const deckList = identifiers.map(identifier => `1 ${identifier}`).join('\n');
  const parseResponse = await engine.handle(post('/v1/deck-import/parse', { deckList }));
  assert.equal(parseResponse.status, 200);
  const parsed = await parseResponse.json();
  assert.equal(parsed.totalCards, 141); assert.deepEqual(parsed.parseErrors, []); assert.deepEqual(parsed.unknownCards, []);
  assert.equal(parsed.knownCards.length, 141);
  const lookupResponse = await engine.handle(post('/v1/deck-import/get-cards', { cards: identifiers }));
  assert.equal(lookupResponse.status, 200);
  const lookedUp = await lookupResponse.json();
  assert.equal(lookedUp.count, 141);
  // Existing clients send executable full names, so verify every canonical
  // identity still resolves as well as the new printed DLR form.
  const canonicalNames = cards.map(card => card.fullName);
  const canonicalResponse = await (await engine.handle(post('/v1/deck-import/get-cards', { cards: canonicalNames }))).json();
  assert.equal(canonicalResponse.count, 141);
  assert.deepEqual(canonicalResponse.cards.map(card => card.fullName), canonicalNames);
  names.forEach((name, index) => {
    const number = String(index + 1), canonical = byNumber.get(number);
    for (const [kind, result] of [['parse', parsed.knownCards[index]], ['get-cards', lookedUp.cards[index]]]) {
      assert.equal(result.setCode, 'DLR', `${kind} ${name} ${number} set`);
      assert.equal(result.setNumber, number, `${kind} ${name} ${number} number`);
      assert.equal(result.fullName, canonical.fullName, `${kind} ${name} ${number} identity`);
      assert.equal(result.cardData.fullName, canonical.fullName, `${kind} ${name} ${number} card data`);
      assert.match(result.cardImage, new RegExp(`/DLR_${number.padStart(3, '0')}_`), `${kind} ${name} ${number} artwork`);
    }
  });
});

test('DLR screenshot cards, alternate Rayquaza prints and printed Energy names remain distinct', async () => {
  const { handle } = await mod;
  const inputs = [
    'Mega Rayquaza ex DLR 84', 'Talonflame ex DLR 88', 'Legendary Pyroduct DLR 94', 'Legendary Pyroduct DLR 95',
    'Mega Rayquaza ex DLR 138', 'Mega Rayquaza ex DLR 141', 'Bubbly Water Energy DLR 132', 'Growing Grass Energy DLR 133',
    'Bubble Water Energy DLR 132', 'Grow [G] Energy DLR 133', 'Nitro Fire Energy DLR 134',
    'nidoran♀ dlr 055', 'Mega Rayquaza ex dlr 084',
  ];
  const expected = ['84','88','94','95','138','141','132','133','132','133','134','55','84'];
  const p = await (await handle(post('/v1/deck-import/parse', { deckList: inputs.map(x => '1 ' + x).join('\n') }))).json();
  assert.deepEqual(p.parseErrors, []); assert.deepEqual(p.unknownCards, []);
  assert.deepEqual(p.knownCards.map(card => card.setNumber), expected);
  assert.notEqual(p.knownCards[0].fullName, p.knownCards[4].fullName);
  assert.notEqual(p.knownCards[4].fullName, p.knownCards[5].fullName);
  assert.notEqual(p.knownCards[2].fullName, p.knownCards[3].fullName);
  const q = await (await handle(post('/v1/deck-import/get-cards', { cards: inputs }))).json();
  assert.equal(q.count, inputs.length); assert.deepEqual(q.cards.map(card => card.setNumber), expected);
  assert.deepEqual(q.cards.map(card => card.fullName), p.knownCards.map(card => card.fullName));
});

test('DLR mismatched names or nonexistent numbers are unknown rather than silently returning another print', async () => {
  const { handle } = await mod;
  const inputs = ['Mega Rayquaza ex DLR 999', 'Mega Rayquaza ex DLR 88', 'Legendary Pyroduct DLR 96',
    'Bubbly Water Energy DLR 133', 'Bogus DLR 84', 'Mega Rayquaza ex DLR 84a'];
  const p = await (await handle(post('/v1/deck-import/parse', { deckList: inputs.map(x => '1 ' + x).join('\n') }))).json();
  assert.equal(p.knownCards.length, 0); assert.equal(p.unknownCards.length, inputs.length); assert.deepEqual(p.parseErrors, []);
  const q = await (await handle(post('/v1/deck-import/get-cards', { cards: inputs }))).json();
  assert.equal(q.count, 0); assert.deepEqual(q.cards, []);
});

test('get-cards continues accepting canonical full names and preserves duplicate request order', async () => {
  const engine = await mod; engine.ensureClientCards();
  const cm = engine.CardManager.getInstance();
  const existing = cm.getAllCards().find(card => card.set === 'PAR' && card.name === 'Gholdengo ex');
  const ray = cm.getAllCards().find(card => card.set === 'DLR' && card.setNumber === '138');
  assert.ok(existing); assert.ok(ray);
  const input = [existing.fullName, ray.fullName, existing.fullName, 'No Such Pokemon DLR 84'];
  const result = await (await engine.handle(post('/v1/deck-import/get-cards', { cards: input }))).json();
  assert.equal(result.count, 3); assert.deepEqual(result.cards.map(card => card.fullName), input.slice(0, 3));
});

test('malformed inputs, invalid snapshots and unavailable or stateful routes return bounded errors', async () => {
  const { handle } = await mod;
  const cases = [
    [post('/v1/deck-import/parse', {}), 400],
    [post('/v1/deck-import/get-cards', { cards: ['ok', 2] }), 400],
    [post('/v1/deck-import/get-cards', { cards: Array(1001).fill('a') }), 413],
    [post('/v1/deck-import/parse', { deckList: 'a'.repeat(100001) }), 413],
    [post('/v1/deck-import/parse', { deckList: '1 x\n'.repeat(1001) }), 413],
    [post('/v1/game/validate-state', { stateData: '!' }), 400],
    [post('/v1/game/validate-state', { stateData: 'A===' }), 400],
    [post('/v1/game/validate-state', { stateData: Buffer.alloc(8*1024*1024+1, 32).toString('base64') }), 413],
    [post('/v1/game/validate-state', { stateData: Buffer.from('{invalid').toString('base64') }), 400],
    [post('/v1/game/validate-state', { stateData: Buffer.from(JSON.stringify([{}, {}])).toString('base64') }), 400],
    [post('/v1/deck-import/parse-and-save-unknown', { deckList: 'a' }), 404],
    [new Request('https://api.example.test/v1/game/validate-state'), 405],
    [new Request('https://api.example.test/v1/deck-import/parse', { method: 'POST', body: '{' }), 400],
    [new Request('https://api.example.test/v1/deck-import/parse', { method: 'POST', body: 'a'.repeat(2*1024*1024+1) }), 413],
  ];
  for (const [request,status] of cases) assert.equal((await handle(request)).status, status, request.url);
  assert.equal((await handle(new Request('https://api.example.test/v1/game/validate-state', { method:'OPTIONS' }))).status, 204);
});
