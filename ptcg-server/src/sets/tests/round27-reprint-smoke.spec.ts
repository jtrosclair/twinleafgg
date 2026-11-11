import { ensureClientCards } from '../../client/cards';
import { CardType } from '../../game/store/card/card-types';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { CheckProvidedEnergyEffect, CheckPokemonAttacksEffect } from '../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { playTrainerCard, useAbility, useAttack } from './card-test-helpers';
function game(name:string,energy:string[],copied:boolean) {
 const g=setupGame({turn:3,player1:{active:{card:copied?'Mew ex 30C':name,energy,damage:30},bench:copied?[{card:name}]:[],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
 const target=g.player2.active.getPokemonCard()!;target.weakness=[];target.resistance=[];target.hp=1000;return g;
}
function attack(g:ReturnType<typeof game>,name:string,copied:boolean) {
 if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:name}));useAbility(g.store,g.state,0,'Memory Helix');}else useAttack(g.store,g.state,0,name);
}
describe('round27 independent reprint smoke',()=>{
 beforeAll(()=>ensureClientCards());
 for(const copied of [false,true]) {
  it('Cherrim P8 Magical Leaf heads damages and heals '+copied,()=>{
   const g=game('Cherrim P8',['Grass Energy SVE','Grass Energy SVE'],copied);spyOn(Math,'random').and.returnValue(0);attack(g,'Magical Leaf',copied);
   expect(g.player2.active.damage).toBe(40);expect(g.player1.active.damage).toBe(0);
  });
  it('Chimchar P8 Ember tails discards Fire Energy '+copied,()=>{
   const g=game('Chimchar P8',['Fire Energy SVE','Water Energy SVE'],copied),fire=g.player1.active.cards.find(c=>c.name==='Fire Energy')!;
   spyOn(Math,'random').and.returnValue(.99);attack(g,'Ember',copied);expect(g.player2.active.damage).toBe(30);expect(g.player1.discard.cards).toContain(fire);
  });
  it('Turtwig P8 Razor Leaf delivers 20 '+copied,()=>{
   const g=game('Turtwig P8',['Grass Energy SVE'],copied);attack(g,'Razor Leaf',copied);expect(g.player2.active.damage).toBe(20);
  });
 }
 it('Multi Technical Machine 01 P2 attaches, offers its attack, and discards at end turn',()=>{
  const name='Multi Technical Machine 01 P2',g=setupGame({turn:3,player1:{active:{card:'Mew ex MEW'},hand:[name],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}}),tm=g.player1.hand.cards[0];
  g.overridePrompt('Choose pokemon',()=>[{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}]);playTrainerCard(g.store,g.state,0,name);
  expect(g.player1.active.cards).toContain(tm);const q=new CheckPokemonAttacksEffect(g.player1);g.store.reduceEffect(g.state,q);expect(q.attacks.some(a=>a.name==='Paralyzing Gaze')).toBe(true);
  g.store.reduceEffect(g.state,new EndTurnEffect(g.player1));expect(g.player1.discard.cards).toContain(tm);
 });
 it('TV Reporter P2 draws three and discards one',()=>{
  const name='TV Reporter P2',g=setupGame({turn:3,player1:{active:{card:'Mew ex MEW'},hand:[name,'Fire Energy SVE'],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
  const reporter=g.player1.hand.cards[0];g.overridePrompt('Choose cards',()=>[0]);playTrainerCard(g.store,g.state,0,name);
  expect(g.player1.hand.cards.length).toBe(3);expect(g.player1.discard.cards).toContain(reporter);expect(g.player1.supporterTurn).toBe(1);
 });
 it('Heal Energy P4 heals an ordinary hand attachment',()=>{
  const name='Heal Energy P4',g=setupGame({turn:3,player1:{active:{card:'Charmander BS',damage:30},hand:[name],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
  g.store.dispatch(new PlayCardAction(g.player1.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}));expect(g.player1.active.damage).toBe(20);
 });
 it('Scramble Energy P4 provides three units while behind on prizes',()=>{
  const name='Scramble Energy P4',g=setupGame({turn:3,player1:{active:{card:'Charmeleon BS'},hand:[name],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},prizeCount:5,deck:padDeck(10)}});
  const base=getCardByName('Charmander BS');base.id=987654;g.player1.active.cards.unshift(base);const card=g.player1.hand.cards[0];
  g.store.dispatch(new PlayCardAction(g.player1.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}));const q=new CheckProvidedEnergyEffect(g.player1);g.store.reduceEffect(g.state,q);
  expect(q.energyMap.find(e=>e.card===card)!.provides).toEqual([CardType.ANY,CardType.ANY,CardType.ANY]);
 });
 for(const [name,delta] of [['Charmander δ P5',true],['Charmander BS',false]] as const) it('Delta Rainbow Energy P5 provides correct Energy to '+name,()=>{
  const energy='δ Rainbow Energy P5',g=setupGame({turn:3,player1:{active:{card:name},hand:[energy],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}}),card=g.player1.hand.cards[0];
  g.store.dispatch(new PlayCardAction(g.player1.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}));const q=new CheckProvidedEnergyEffect(g.player1);g.store.reduceEffect(g.state,q);
  expect(q.energyMap.find(e=>e.card===card)!.provides).toEqual([delta?CardType.ANY:CardType.COLORLESS]);
 });
});
