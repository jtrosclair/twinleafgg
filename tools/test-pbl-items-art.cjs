'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const { ensureClientCards,applyClientCardMetadata }=require(path.join(root,'ptcg-server/browser/client/cards'));
const rows=require(path.join(root,'simulator-api/tests/fixtures/pbl-items-printed-names.json'));
const images=require(path.join(root,'ptcg-server/data/limitlesstcg-images.json'));
const dir=path.join(root,'ptcg-play/src/assets/simulator');
test('PBL generated client metadata resolves exact full-art print',()=>{
 const version=JSON.parse(fs.readFileSync(path.join(dir,'cards.hash.json'),'utf8'));
 const payload=JSON.parse(fs.readFileSync(path.join(dir,`cards.${version.hash}.json`),'utf8'));
 const cards=ensureClientCards();assert.equal(cards.length,version.cardsTotal);applyClientCardMetadata(payload.cardsInfo,{hash:version.hash,catalogueHash:version.catalogueHash,cardsTotal:version.cardsTotal});
 for(const row of rows){const card=cards.find(c=>c.fullName===row.fullName);assert.ok(card);assert.equal(card.cardImage,images[`${row.set} ${row.number}`]);}
});
