import { CardManager } from '../../game/cards/card-manager';
import { Round29ShinxAR74 } from '../set-arceus/shinx';
import { ensureClientCards } from '../../client/cards';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { SuperType } from '../../game/store/card/card-types';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { padDeck, setupGame, getCardByName } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';

function game(card:string,ourEnergy:string[],water:boolean,restore:boolean,copied=false,special="Holon's Magnemite DS",sameHand=false){
 ensureClientCards(); const manager=CardManager.getInstance(); if(!manager.isCardDefined('Shinx AR'))manager.defineSet([new Round29ShinxAR74()]); const templates=manager.getAllCards().slice();
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
describe('direct discard from live and serialized attachments',()=>{
 for(const restore of [false,true]) it('Swagger discards Holon, restored='+restore,()=>{
  const {g,state,holon}=game('Shinx AR',['Water Energy SVE','Water Energy SVE'],false,restore);
  spyOn(Math,'random').and.returnValue(0.1);
  g.overridePrompt('Choose cards',(p:any)=>[p.cards.cards.indexOf(holon)]);
  useAttack(g.store,state,0,'Swagger');
  expect(g.store.state.players[1].discard.cards).toContain(holon);
 });
});

describe('Pokemon as Energy identity restoration for six prints',()=>{
 for(const name of ["Holon's Magnemite DS","Holon's Voltorb DS","Holon's Magneton DS","Holon's Electrode DS","Holon's Castform HP","Charjabug UNB"]) {
  it(name+' restores attached form while preserving the same print in hand',()=>{
   const {state,holon}=game('Shinx AR',['Water Energy SVE','Water Energy SVE'],false,true,false,name,true);
   expect(state.players[1].active.cards).toContain(holon);
   expect(state.players[1].active.energies.cards).toContain(holon);
   expect(holon.superType).toBe(SuperType.ENERGY);
   const inHand=state.players[0].hand.cards.find(c=>c.fullName===name)!;
   expect(inHand).toBeDefined();expect(inHand).not.toBe(holon);
   expect(inHand.superType).toBe(SuperType.POKEMON);
  });
 }
});

describe('copy and post-discard identity',()=>{
 it('discard via copied Swagger restores printed Pokémon type',()=>{
  const {g,state,holon}=game('Shinx AR',['Water Energy SVE','Water Energy SVE'],false,true,true);
  spyOn(Math,'random').and.returnValue(0.1);
  g.overridePrompt('Choose attack',()=>({index:0,attack:'Swagger'}));
  g.overridePrompt('Choose cards',(p:any)=>[p.cards.cards.indexOf(holon)]);
  useAbility(g.store,state,0,'Memory Helix');
  expect(g.store.state.players[1].discard.cards).toContain(holon);
  expect(g.store.state.players[1].active.energies.cards).not.toContain(holon);
  expect(holon.superType).toBe(SuperType.POKEMON);
 });
});
