'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=path.join(__dirname,'ptcg-server/.simisage-test');
const {setupGame,padDeck}=require(path.join(base,'sets/tests/test-helpers'));
const {useAttack}=require(path.join(base,'sets/tests/card-test-helpers'));
const g=setupGame({turn:5,player1:{active:{card:'Simisage PAR',energy:['Grass Energy SVE','Grass Energy SVE','Grass Energy SVE']},bench:[{card:'Mew ex MEW'}],deck:padDeck(16)},player2:{active:{card:'Aerodactyl VSTAR LOR 93',energy:['Fighting Energy SVE','Fighting Energy SVE','Fighting Energy SVE','Weakness Guard Energy UNM']},deck:padDeck(16)}});
const protectedCard=g.player1.active.getPokemonCard();const steps=[];
for(const [player,attack] of [[0,'Arm Thrust Needle'],[1,'Ancient Star'],[0,'Arm Thrust Needle'],[1,'Lost Dive']]){
 assert.notEqual(g.store.state.phase,7,'No action may be ignored after a premature game end');useAttack(g.store,g.store.state,player,attack);steps.push({player,attack,turn:g.store.state.turn,phase:g.store.state.phase,activePlayer:g.store.state.activePlayer,protectedActive:g.player1.active.getPokemonCard()===protectedCard,protectedDiscarded:g.player1.discard.cards.includes(protectedCard),opposingDamage:g.player2.active.damage});
}
const report={scope:'Real four-action diagnostic with untouched printed card stats and ordinary deck draws; no RNG override or source edits.',steps,expected:'Ancient Star grants an Ability. Lost Dive must deal no damage to the Simisage protected by the second Arm Thrust Needle.',actual:{protectedDiscarded:g.player1.discard.cards.includes(protectedCard),remainingActive:g.player1.active.getPokemonCard()?.fullName},reproducedBlocker:g.player1.discard.cards.includes(protectedCard)};
fs.writeFileSync(path.join(__dirname,'aerodactyl-live-red.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));assert.equal(report.actual.protectedDiscarded,false,'Protected Simisage must survive an attacker that gained an Ability from Ancient Star');
