import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createApiServer } from './dist/server.mjs';

const server = createApiServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
test.after(() => new Promise(resolve => server.close(resolve)));
const post = (path, value) => fetch(origin + path, {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(value),
});
const size = value => Buffer.byteLength(value, 'utf8');

test('real HTTP transport preserves legacy parse, lookup and validation responses', async () => {
  const parse = await post('/v1/deck-import/parse', { deckList: '1 Grass Energy SVE 1\n1 Unobtainable Fictional Card SVE 1' });
  assert.equal(parse.status, 200);
  const parsed = await parse.json();
  assert.equal(parsed.ok, true);
  assert.ok(parsed.knownCards.length > 0);
  assert.ok(parsed.unknownCards.length > 0);

  const requested = Array(60).fill(parsed.knownCards[0].cardData.fullName);
  const lookup = await post('/v1/deck-import/get-cards', { cards: requested });
  assert.equal(lookup.status, 200);
  const lookupText = await lookup.text();
  assert.equal(JSON.parse(lookupText).cards.length, 60);
  console.log(`Representative 60-card response: ${size(lookupText)} bytes`);

  for (const name of ['phantom-maze-state.json', 'dengo-state.json']) {
    const fixture = JSON.parse(fs.readFileSync(new URL(`../simulator-api/tests/fixtures/${name}`, import.meta.url)));
    const result = await post('/v1/game/validate-state', { stateData: fixture.stateData });
    assert.equal(result.status, 200, name);
    const text = await result.text();
    const decoded = JSON.parse(text);
    assert.equal(decoded.valid, true);
    assert.ok(decoded.serializedState);
    assert.equal(decoded.info.playerCount, 2);
    console.log(`${name}: request ${size(JSON.stringify({ stateData: fixture.stateData }))} bytes, response ${size(text)} bytes`);
  }
});

test('8 MiB decoded input and large serialized output pass through real HTTP', async () => {
  const fixture = JSON.parse(fs.readFileSync(new URL('../simulator-api/tests/fixtures/dengo-state.json', import.meta.url)));
  const state = JSON.parse(Buffer.from(fixture.stateData, 'base64').toString('utf8'));
  state[0][0].name = 'x'.repeat(7 * 1024 * 1024);
  const initial = Buffer.from(JSON.stringify(state));
  const padded = Buffer.concat([initial, Buffer.alloc(8 * 1024 * 1024 - initial.length, 32)]);
  const input = { stateData: padded.toString('base64') };
  const response = await post('/v1/game/validate-state', input);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('transfer-encoding'), 'chunked');
  const text = await response.text();
  const result = JSON.parse(text);
  assert.equal(result.valid, true);
  assert.equal(result.info.state.players[0].name.length, 7 * 1024 * 1024);
  assert.equal(JSON.parse(Buffer.from(result.serializedState, 'base64').toString('utf8'))[0][0].name.length, 7 * 1024 * 1024);
  console.log(`8 MiB decoded state: request ${size(JSON.stringify(input))} bytes, response ${size(text)} bytes`);
});

test('chunked oversized request is rejected and a later health request succeeds', async () => {
  let chunks = 0;
  const data = new ReadableStream({
    async pull(controller) {
      if (chunks++ >= 16) { controller.close(); return; }
      await new Promise(resolve => setTimeout(resolve, 3));
      controller.enqueue(Buffer.alloc(32 * 1024, 65));
    },
  });
  const response = await fetch(origin + '/v1/deck-import/parse', { method: 'POST', body: data, duplex: 'half' });
  assert.equal(response.status, 413);
  assert.equal((await fetch(origin + '/healthz')).status, 200);
});

test('configured bearer secret protects the API while health remains available', async () => {
  assert.throws(() => createApiServer({ sharedSecret: '', requireAuthentication: true }), /required/);
  assert.throws(() => createApiServer({ sharedSecret: 'bad secret', requireAuthentication: true }), /Invalid simulator API secret/);
  const secret = 'local-test-only-secret';
  const protectedServer = createApiServer({ sharedSecret: secret, requireAuthentication: true });
  await new Promise(resolve => protectedServer.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${protectedServer.address().port}`;
  try {
    assert.equal((await fetch(base + '/healthz')).status, 200);
    for (const authorization of ['', 'Bearer wrong']) {
      const response = await fetch(base + '/v1/deck-import/get-cards', {
        method: 'POST', headers: { 'content-type': 'application/json', authorization }, body: '{"cards":[]}',
      });
      assert.equal(response.status, 401);
      assert.equal((await response.text()).includes(secret), false);
    }
    const good = await fetch(base + '/v1/deck-import/get-cards', {
      method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${secret}` }, body: '{"cards":[]}',
    });
    assert.equal(good.status, 200);
    assert.deepEqual((await good.json()).cards, []);
  } finally {
    await new Promise(resolve => protectedServer.close(resolve));
  }
});
