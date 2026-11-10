import { Card } from '../../game/store/card/card';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { getCardByName, padDeck, setupGame } from './test-helpers';

class DiscardBlocker extends PokemonCard {
 public name='Discard blocker';public fullName='Discard blocker TEST';public set='TEST';public stage=Stage.BASIC;public hp=100;
 public reduceEffect(_store:StoreLike,state:State,effect:Effect):State {if(effect instanceof DiscardCardsEffect)effect.preventDefault=true;return state;}
}
function game() {return setupGame({turn:2,player1:{active:{card:'Charmander BS',energy:['Fire Energy SVE','Fire Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Charmander BS'},deck:padDeck(10)}});}
function attach(g:ReturnType<typeof game>,card:Card,opponent=false) {card.id=2000+(opponent?g.player2:g.player1).active.cards.length;const p=opponent?g.player2:g.player1;p.active.cards.push(card);p.active.energies.cards.push(card);}
function attack(g:ReturnType<typeof game>,opponent=false) {return new AttackEffect(opponent?g.player2:g.player1,opponent?g.player1:g.player2,{name:'Fixture attack',cost:[],damage:0,text:''});}

describe('attack Energy discards retain replacement and interception semantics',()=>{
 it('routes a selected Prism Star to Lost Zone and ordinary Energy to discard after normal effect fan-out',()=>{
  const g=game(),source=g.player1.active,energy=source.cards.find(c=>c.name==='Fire Energy')!,prism=getCardByName('Super Boost Energy ◇ UPR');attach(g,prism);
  const discard=new DiscardCardsEffect(attack(g),[energy,prism]);discard.target=source;const seen:DiscardCardsEffect[]=[];const reduce=g.store.reduceEffect.bind(g.store);
  spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof DiscardCardsEffect)seen.push(e);return reduce(s,e)});g.store.reduceEffect(g.state,discard);
  expect(seen).toEqual([discard]);expect(g.player1.discard.cards).toContain(energy);expect(g.player1.discard.cards).not.toContain(prism);expect(g.player1.lostzone.cards).toContain(prism);
  expect(source.cards).not.toContain(prism);expect(source.energies.cards).not.toContain(prism);expect(source.energies.cards).not.toContain(energy);
 });
 it('sends an opposing Pokémon’s discarded Prism Star to its owner’s Lost Zone',()=>{
  const g=game(),prism=getCardByName('Super Boost Energy ◇ UPR');attach(g,prism,true);const discard=new DiscardCardsEffect(attack(g),[prism]);discard.target=g.player2.active;g.store.reduceEffect(g.state,discard);
  expect(g.player2.lostzone.cards).toContain(prism);expect(g.player1.lostzone.cards).not.toContain(prism);expect(g.player2.discard.cards).not.toContain(prism);
 });
 it('honors DiscardCardsEffect prevention before either destination changes',()=>{
  const g=game(),source=g.player1.active,prism=getCardByName('Super Boost Energy ◇ UPR');attach(g,prism);const blocker=new DiscardBlocker();blocker.id=3000;g.player2.bench[0].cards=[blocker];
  const discard=new DiscardCardsEffect(attack(g),[prism]);discard.target=source;g.store.reduceEffect(g.state,discard);
  expect(discard.preventDefault).toBe(true);expect(source.cards).toContain(prism);expect(g.player1.lostzone.cards).not.toContain(prism);
 });
 it('real Carbink protects Basic Energy while an unprotected Prism card is routed',()=>{
  const g=game(),source=g.player1.active,energy=source.cards.find(c=>c.name==='Fire Energy')!,prism=getCardByName('Super Boost Energy ◇ UPR');attach(g,prism);
  const carbink=getCardByName('Carbink FCO');carbink.id=3001;g.player1.bench[0].cards=[carbink];const discard=new DiscardCardsEffect(attack(g,true),[energy,prism]);discard.target=source;g.store.reduceEffect(g.state,discard);
  expect(source.cards).toContain(energy);expect(g.player1.discard.cards).not.toContain(energy);expect(g.player1.lostzone.cards).toContain(prism);
 });
 it('Nitro Fire Energy returns to hand without remaining physically or virtually attached',()=>{
  const g=game(),source=g.player1.active,nitro=getCardByName('Nitro Fire Energy M4');attach(g,nitro);const discard=new DiscardCardsEffect(attack(g),[nitro]);discard.target=source;g.store.reduceEffect(g.state,discard);
  expect(g.player1.hand.cards.filter(c=>c===nitro).length).toBe(1);expect(source.cards).not.toContain(nitro);expect(source.energies.cards).not.toContain(nitro);expect(g.player1.discard.cards).not.toContain(nitro);
 });
 for(const physical of [false,true])it(`Nitro clears an existing ${physical?'physical-plus-mirror':'mirror-only'} ghost already in the hand without duplicating it`,()=>{
  const g=game(),source=g.player1.active,nitro=getCardByName('Nitro Fire Energy M4');nitro.id=3002;g.player1.hand.cards.push(nitro);source.energies.cards.push(nitro);if(physical)source.cards.push(nitro);
  const discard=new DiscardCardsEffect(attack(g),[nitro]);discard.target=source;g.store.reduceEffect(g.state,discard);
  expect(g.player1.hand.cards.filter(c=>c===nitro).length).toBe(1);expect(source.cards).not.toContain(nitro);expect(source.energies.cards).not.toContain(nitro);
 });
 it('preserves real Burning Energy discard triggers and end-turn reattachment',()=>{
  const g=game(),source=g.player1.active,burning=getCardByName('Burning Energy BKT');attach(g,burning);const a=attack(g);g.store.reduceEffect(g.state,a);
  const discard=new DiscardCardsEffect(a,[burning]);discard.target=source;g.store.reduceEffect(g.state,discard);expect(g.player1.discard.cards).toContain(burning);
  g.store.reduceEffect(g.state,new EndTurnEffect(g.player1));expect(source.cards).toContain(burning);expect(source.energies.cards).toContain(burning);expect(g.player1.discard.cards).not.toContain(burning);
 });
});
