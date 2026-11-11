// Research fixture: copy temporarily to ptcg-server/src/sets/tests as a .spec.ts.
// This deliberately exposes an existing failure; do not ship as a passing spec.
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { State } from '../../game/store/state/state';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';

describe('Sceptile CES Power of Nature - actual attack action research',()=>{
 function game(energy:string[]) {
   return setupGame({turn:2,
     player1:{active:{card:'Buzzwole CEC',energy:['Grass Energy SVE','Grass Energy SVE']},deck:padDeck(10)},
     player2:{active:{card:'Sceptile CES',energy},deck:padDeck(10)}});
 }
 it('does not protect Sceptile when it has no Grass Energy',()=>{
   const g=game([]);useAttack(g.store,g.state,0,'Touchdown');expect(g.player2.active.damage).toBe(60);
 });
 it('does protect Sceptile when it has Grass Energy',()=>{
   const g=game(['Grass Energy SVE']);useAttack(g.store,g.state,0,'Touchdown');expect(g.player2.active.damage).toBe(0);
 });
 it('does not protect Sceptile when its Ability is disabled',()=>{
   const g=game(['Grass Energy SVE']),card=g.player2.active.getPokemonCard()!,reduce=g.store.reduceEffect.bind(g.store);
   spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof PowerEffect&&e.card===card)throw new Error('Ability blocked');return reduce(s,e);});
   useAttack(g.store,g.state,0,'Touchdown');expect(g.player2.active.damage).toBe(60);
 });
 it('does not protect the opposing player from its owner’s Ultra Beast',()=>{
   const g=setupGame({turn:2,
     player1:{active:{card:'Buzzwole CEC',energy:['Grass Energy SVE','Grass Energy SVE']},bench:[{card:'Sceptile CES'}],deck:padDeck(10)},
     player2:{active:{card:'Mew ex MEW',energy:['Grass Energy SVE']},deck:padDeck(10)}});
   expect(getCardByName('Sceptile CES')).toBeDefined();useAttack(g.store,g.state,0,'Touchdown');expect(g.player2.active.damage).toBe(60);
 });
});
