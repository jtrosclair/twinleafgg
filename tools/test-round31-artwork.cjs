#!/usr/bin/env node
'use strict';

// Run after ptcg-play/scripts/build-client-assets.cjs. Verify the actual
// generated image table and the same metadata application used by the UI.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const { ensureClientCards, applyClientCardMetadata } = require(path.join(root, 'ptcg-server/browser/client/cards'));
const fixtures = require(path.join(root, 'simulator-api/tests/fixtures/round31-printed-names.json'));
const imageMap = require(path.join(root, 'ptcg-server/data/limitlesstcg-images.json'));
const directory = path.join(root, 'ptcg-play/src/assets/simulator');

test('generated client metadata resolves every round-31 print to its exact print artwork', () => {
  const version = JSON.parse(fs.readFileSync(path.join(directory, 'cards.hash.json'), 'utf8'));
  const payload = JSON.parse(fs.readFileSync(path.join(directory, `cards.${version.hash}.json`), 'utf8'));
  const cards = ensureClientCards();
  assert.equal(cards.length, version.cardsTotal);
  applyClientCardMetadata(payload.cardsInfo, { hash: version.hash, catalogueHash: version.catalogueHash, cardsTotal: version.cardsTotal });
  for (const fixture of fixtures) {
    const card = cards.find(item => item.fullName === fixture.fullName);
    assert.ok(card, `${fixture.fullName}: card exists`);
    const expected = imageMap[`${fixture.set} ${fixture.number}`];
    assert.match(expected, /^https:\/\//, `${fixture.fullName}: mapped image`);
    assert.equal(card.cardImage, expected, `${fixture.fullName}: generated and applied artwork`);
  }
});
