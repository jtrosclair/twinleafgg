import { PowerType } from '../../game';
import { CheckPokemonIntrinsicPowersEffect, CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';

// These are deliberately RED requirements for the existing shared Ability query.
// They must not be skipped or rewritten into passing assertions about wrong behavior.
describe('Simisage PAR integration blockers: effective intrinsic Ability presence',()=>{
 for(const suppressor of ['Galarian Weezing SHF','Iron Thorns ex TWM'])it(suppressor+' removes the opponent Ability from the intrinsic query',()=>{
  const g=setupGame({turn:5,player1:{active:{card:suppressor},deck:padDeck(12)},player2:{active:{card:'Rotom VSTAR CRZ 46'},deck:padDeck(12)}});
  const c=g.player2.active.getPokemonCard()!;expect(()=>g.store.reduceEffect(g.state,new PowerEffect(g.player2,c.powers[0],c))).toThrow();
  const query=new CheckPokemonIntrinsicPowersEffect(g.player2,c);g.store.reduceEffect(g.state,query);expect(query.powers.some(p=>p.powerType===PowerType.ABILITY)).toBe(false);
 });
 it('actual Ancient Star attack grants its user an intrinsic Ability',()=>{
  const g=setupGame({turn:5,player1:{active:{card:'Aerodactyl VSTAR LOR 93',energy:['Fighting Energy SVE']},deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}});
  useAttack(g.store,g.state,0,'Ancient Star');expect(g.player1.usedVSTAR).toBe(true);const c=g.player1.active.getPokemonCard()!;
  const query=new CheckPokemonIntrinsicPowersEffect(g.player1,c);g.store.reduceEffect(g.state,query);expect(query.powers.some(p=>p.powerType===PowerType.ABILITY)).toBe(true);
 });
 it('ordinary usable-power UI queries must not pollute the intrinsic printed definition',()=>{
  const g=setupGame({turn:5,player1:{active:{card:'Mew V FST',tools:['Forest Seal Stone SIT']},deck:padDeck(12)},player2:{active:{card:'Simisage PAR'},deck:padDeck(12)}});
  const c=g.player1.active.getPokemonCard()!;expect(c.powers.length).toBe(0);g.store.reduceEffect(g.state,new CheckPokemonPowersEffect(g.player1,c));
  expect(c.powers.length).toBe(0);const intrinsic=new CheckPokemonIntrinsicPowersEffect(g.player1,c);g.store.reduceEffect(g.state,intrinsic);expect(intrinsic.powers.length).toBe(0);
 });

 it('a gained Ability remains removed independent of fan-out order',()=>{
  const g=setupGame({turn:5,player1:{active:{card:'Garbodor DRX',tools:['Big Charm SSH']},deck:padDeck(12)},player2:{active:{card:'Unown VSTAR SIT',energy:['Psychic Energy SVE','Grass Energy SVE','Grass Energy SVE']},deck:padDeck(12)}});
  g.state.activePlayer=1;useAttack(g.store,g.state,1,'Star Cipher');const c=g.player2.active.getPokemonCard()!;
  const query=new CheckPokemonIntrinsicPowersEffect(g.player2,c);g.store.reduceEffect(g.state,query);expect(query.powers.some(p=>p.powerType===PowerType.ABILITY)).toBe(false);
 });

});
