import { CardManager } from '../../game/cards/card-manager';
import { AttachEnergyPromptType } from '../../game/store/prompts/attach-energy-prompt';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { PlayerType, SlotType, PlayCardAction } from '../../game/store/actions/play-card-action';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';
import { Azurill } from '../set-delta-reign/azurill';
import { OldCemetery } from '../set-chilling-reign/old-cemetery';
import { IslandCave } from '../set-ex-hidden-legends/island-cave';
import { CalamitousSnowyMountain } from '../set-paldea-evolved/calamitous-snowy-mountain';
import { ThundurusEX } from '../set-plasma-freeze/thundurus-ex';
import { SpecialCondition } from '../../game/store/card/card-types';
const target={player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0};
beforeAll(()=>{const cm=CardManager.getInstance();for(const c of [new Azurill(),new OldCemetery(),new IslandCave(),new CalamitousSnowyMountain(),new ThundurusEX()])if(!cm.isCardDefined(c.fullName))cm.defineSet([c]);});
for(const stadium of ['Frozen City PLF','Old Cemetery CRE 147','Calamitous Snowy Mountain PAL']) {
 for(const copied of [false,true])it(`${stadium} does not react to ${copied?'copied ':''}Azurill Energy from deck`,()=>{
  const g=setupGame({turn:3,player1:{active:{card:copied?'Mew ex 30C':'Azurill M6'},bench:copied?[{card:'Charmander BS'},{card:'Azurill M6'}]:[{card:'Charmander BS'}],deck:['Fire Energy SVE',...padDeck(9)]},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});g.player1.stadium.cards.push(getCardByName(stadium));const energy=g.player1.deck.cards[0];
  g.overridePrompt(AttachEnergyPromptType,()=>[{index:0,to:target}]);g.overridePrompt('Shuffle deck',()=>g.player1.deck.cards.map((_,i)=>i));
  if(copied){g.overridePrompt('Choose attack',()=>({index:1,attack:'Bouncy-Bounce Charge'}));useAbility(g.store,g.state,0,'Memory Helix');}else useAttack(g.store,g.state,0,'Bouncy-Bounce Charge');
  expect(g.player1.bench[0].cards).toContain(energy);expect(g.player1.bench[0].damage).toBe(0);
 });
 it(`${stadium} still reacts to manual Energy from hand`,()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Mew ex MEW'},bench:[{card:'Charmander BS'}],hand:['Fire Energy SVE'],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});g.player1.stadium.cards.push(getCardByName(stadium));const energy=g.player1.hand.cards[0];g.store.dispatch(new PlayCardAction(g.player1.id,0,target));expect(g.player1.bench[0].cards).toContain(energy);expect(g.player1.bench[0].damage).toBe(20);
 });
 it(`${stadium} does not react to explicitly marked discard-source Energy`,()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Mew ex MEW'},bench:[{card:'Charmander BS'}],discard:['Fire Energy SVE'],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});g.player1.stadium.cards.push(getCardByName(stadium));const energy=g.player1.discard.cards[0] as EnergyCard;g.player1.discard.moveCardTo(energy,g.player1.bench[0]);g.store.reduceEffect(g.state,new AttachEnergyEffect(g.player1,energy,g.player1.bench[0],'discard'));expect(g.player1.bench[0].cards).toContain(energy);expect(g.player1.bench[0].damage).toBe(0);
 });
}
it('Old Cemetery continues to exempt Psychic Pokémon from manual attachment damage',()=>{
 const g=setupGame({turn:3,player1:{active:{card:'Mew ex MEW'},hand:['Fire Energy SVE'],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});g.player1.stadium.cards.push(getCardByName('Old Cemetery CRE 147'));g.store.dispatch(new PlayCardAction(g.player1.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}));expect(g.player1.active.damage).toBe(0);
});
for(const source of ['deck','discard'] as const) it(`Island Cave does not remove conditions for Energy from ${source}`,()=>{
 const g=setupGame({turn:3,player1:{active:{card:'Squirtle BS'},[source]:['Fire Energy SVE',...padDeck(9)]},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
 g.player1.stadium.cards.push(getCardByName('Island Cave HL'));g.player1.active.addSpecialCondition(SpecialCondition.POISONED);
 const zone=g.player1[source],energy=zone.cards[0] as EnergyCard;zone.moveCardTo(energy,g.player1.active);g.store.reduceEffect(g.state,new AttachEnergyEffect(g.player1,energy,g.player1.active,source));
 expect(g.player1.active.specialConditions).toContain(SpecialCondition.POISONED);
});
it('Island Cave still removes conditions when Energy is attached from hand',()=>{
 const g=setupGame({turn:3,player1:{active:{card:'Squirtle BS'},hand:['Fire Energy SVE'],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
 g.player1.stadium.cards.push(getCardByName('Island Cave HL'));g.player1.active.addSpecialCondition(SpecialCondition.POISONED);
 g.store.dispatch(new PlayCardAction(g.player1.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}));expect(g.player1.active.specialConditions).not.toContain(SpecialCondition.POISONED);
});
it('Frozen City exempts Team Plasma Pokémon from manual attachment damage',()=>{
 const g=setupGame({turn:3,player1:{active:{card:'Thundurus EX PLF'},hand:['Fire Energy SVE'],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
 g.player1.stadium.cards.push(getCardByName('Frozen City PLF'));g.store.dispatch(new PlayCardAction(g.player1.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}));expect(g.player1.active.damage).toBe(0);
});
for(const pokemon of ['Squirtle BS','Charmeleon BS']) it(`Calamitous Snowy Mountain exempts ${pokemon} from manual attachment damage`,()=>{
 const g=setupGame({turn:3,player1:{active:{card:pokemon},hand:['Fire Energy SVE'],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
 g.player1.stadium.cards.push(getCardByName('Calamitous Snowy Mountain PAL'));g.store.dispatch(new PlayCardAction(g.player1.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}));expect(g.player1.active.damage).toBe(0);
});
