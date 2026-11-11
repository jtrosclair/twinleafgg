import { ensureClientCards } from '../../client/cards';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { SuperType } from '../../game/store/card/card-types';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { padDeck, setupGame, getCardByName } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';

function game(card:string,ourEnergy:string[],water:boolean,restore:boolean,copied=false,special="Holon's Magnemite DS",sameHand=false){
 const templates=ensureClientCards().slice();
 const g=setupGame({turn:3,player1:{active:{card:copied?'Mew ex 30C':card,energy:ourEnergy},bench:copied?[{card}]:[],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW',energy:water?['Water Energy SVE']:[]},deck:padDeck(10)}});
 const target=g.player2.active.getPokemonCard()!;target.hp=1000;target.weakness=[];target.resistance=[];
 if(sameHand)g.player1.hand.cards.push(getCardByName(special));
 const holon=getCardByName(special);holon.superType=SuperType.ENERGY;g.player2.active.cards.push(holon);g.player2.active.energies.cards.push(holon);
 if(!restore)return {g,state:g.state,holon};
 const lists=g.state.players.flatMap(p=>[p.active,...p.bench,p.deck,p.hand,p.discard,p.lostzone,p.stadium,p.supporter,...p.prizes]);
 const cards=Array.from(new Set(lists.flatMap(l=>l.cards)));cards.forEach((c,i)=>c.id=i);g.state.cardNames=cards.map(c=>c.fullName);
 try{StateSerializer.setKnownCards(templates);const ser=new StateSerializer();const restored=ser.deserialize(ser.serialize(g.state));g.store.restoreState(restored);const recovered=restored.players[1].active.energies.cards.find(c=>c.fullName===holon.fullName)!;return {g,state:restored,holon:recovered};}
 finally{StateSerializer.setKnownCards(templates);}
}
describe('Pokemon-as-Energy survives a state roundtrip for round29 attacks',()=>{
 for(const restore of [false,true])it('Buizel counts a card attached as Energy, restored='+restore,()=>{
  const {g,state,holon}=game('Buizel DPP',['Water Energy SVE'],true,restore);expect(state.players[1].active.energies.cards).toContain(holon);useAttack(g.store,state,0,'Splash About');expect(g.store.state.players[1].active.damage).toBe(20);
 });

});

describe('restored attached Energy structure',()=>{
 it('retains both attachment memberships and reports symbols',()=>{
  const {g,state,holon}=game('Buizel DPP',['Water Energy SVE'],true,true);
  const target=state.players[1].active;
  expect(target.cards).toContain(holon);
  expect(target.energies.cards).toContain(holon);
  expect(holon.superType).toBe(SuperType.ENERGY);
  const check=new CheckProvidedEnergyEffect(state.players[1],target);
  g.store.reduceEffect(state,check);
  expect(check.energyMap.find(entry=>entry.card===holon)?.provides.length).toBe(1);
 });
});

describe('copied Buizel attack with restored Pokemon-as-Energy',()=>{
 for(const restore of [false,true])it('counts the defender Holon after copy, restored='+restore,()=>{
  const {g,state}=game('Buizel DPP',['Water Energy SVE'],true,restore,true);
  g.overridePrompt('Choose attack',()=>({index:0,attack:'Splash About'}));
  useAbility(g.store,state,0,'Memory Helix');
  expect(g.store.state.players[1].active.damage).toBe(20);
 });
});

