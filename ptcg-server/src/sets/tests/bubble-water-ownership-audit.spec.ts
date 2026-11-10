import { getCardByName,padDeck,setupGame } from './test-helpers';
import { PlayerType,SlotType,PlayCardAction } from '../../game/store/actions/play-card-action';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { AddSpecialConditionsPowerEffect,CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { SpecialCondition } from '../../game/store/card/card-types';

describe('Bubble Water Energy — effective attached Pokémon type',()=>{
 for(const [name,water] of [['Squirtle BS',true],['Mew ex MEW',false]] as const){
  it(`on attachment ${water?'clears':'does not clear'} Special Conditions on ${name}`,()=>{
   const g=setupGame({turn:3,player1:{active:{card:name},hand:['Bubble Water Energy M4'],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
   g.player1.active.specialConditions=[SpecialCondition.POISONED,SpecialCondition.BURNED];
   g.store.dispatch(new PlayCardAction(g.player1.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}));
   expect(g.player1.active.specialConditions).toEqual(water?[]:[SpecialCondition.POISONED,SpecialCondition.BURNED]);
  });
  for(const kind of ['attack','ability'] as const) it(`${water?'prevents':'allows'} ${kind} conditions on ${name}`,()=>{
   const g=setupGame({turn:3,player1:{active:{card:name,energy:['Bubble Water Energy M4']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
   const src=g.player2.active.getPokemonCard()!, attack=new AttackEffect(g.player2,g.player1,src.attacks[0]);
   const effect=kind==='attack'?new AddSpecialConditionsEffect(attack,[SpecialCondition.POISONED]):new AddSpecialConditionsPowerEffect(g.player2,src,g.player1.active,[SpecialCondition.POISONED]);
   g.store.reduceEffect(g.state,effect);expect(effect.preventDefault).toBe(water);
  });
  it(`table checks ${water?'clear':'preserve'} existing conditions on ${name}`,()=>{
   const g=setupGame({turn:3,player1:{active:{card:name,energy:['Bubble Water Energy M4']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
   g.player1.active.specialConditions=[SpecialCondition.POISONED];g.store.reduceEffect(g.state,new CheckTableStateEffect([5,5]));
   expect(g.player1.active.specialConditions).toEqual(water?[]:[SpecialCondition.POISONED]);
  });
 }
 it('responds to effective Water type from Water Memory, and stops protecting after the Tool is removed',()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Silvally-GX CIN',energy:['Bubble Water Energy M4'],tools:['Water Memory TEU']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
  const src=g.player2.active.getPokemonCard()!,attack=new AttackEffect(g.player2,g.player1,src.attacks[0]);
  const protectedEffect=new AddSpecialConditionsEffect(attack,[SpecialCondition.POISONED]);g.store.reduceEffect(g.state,protectedEffect);expect(protectedEffect.preventDefault).toBe(true);
  g.player1.active.tools=[];const unprotectedEffect=new AddSpecialConditionsEffect(attack,[SpecialCondition.POISONED]);g.store.reduceEffect(g.state,unprotectedEffect);expect(unprotectedEffect.preventDefault).toBe(false);
 });
 it('does not clear or prevent conditions while Temple of Sinnoh blocks the Special Energy effect',()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Squirtle BS',energy:['Bubble Water Energy M4']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
  g.player1.stadium.cards.push(getCardByName('Temple of Sinnoh ASR'));g.player1.active.specialConditions=[SpecialCondition.POISONED];
  g.store.reduceEffect(g.state,new CheckTableStateEffect([5,5]));expect(g.player1.active.specialConditions).toEqual([SpecialCondition.POISONED]);
  const src=g.player2.active.getPokemonCard()!,attack=new AttackEffect(g.player2,g.player1,src.attacks[0]);const add=new AddSpecialConditionsEffect(attack,[SpecialCondition.BURNED]);g.store.reduceEffect(g.state,add);expect(add.preventDefault).toBe(false);
 });
});
