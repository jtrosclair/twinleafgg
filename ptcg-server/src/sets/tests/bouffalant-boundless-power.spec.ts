import { PokemonCard } from '../../game/store/card/pokemon-card';
import { State, GamePhase } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Store } from '../../game/store/store';
import { AttackEffect, PowerEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { Effect } from '../../game/store/effects/effect';
import { cloneAttacks, openCopyAttackSession, clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { Bouffalant } from '../set-stellar-crown/bouffalant';
import { Mewex } from '../set-30th-celebration/mew-ex';

class Dummy extends PokemonCard { public name='Dummy'; public fullName='Dummy TEST'; public hp=500; public set='TEST'; }
function battle(copied:boolean, suppress:boolean) {
 const state=new State(), player=new Player(), opponent=new Player(), card=new Bouffalant(), mew=new Mewex();
 player.id=1; opponent.id=2; state.players=[player,opponent]; state.turn=2; state.activePlayer=0; state.phase=GamePhase.ATTACK;
 player.active.cards=[copied?mew:card]; opponent.active.cards=[new Dummy()];
 const store=new Store({onStateChange:()=>undefined}); store.state=state;
 const attacks=copied?cloneAttacks(card.attacks):card.attacks;
 if(copied) openCopyAttackSession(state,player,mew,card,attacks,attacks[0]);
 if(suppress){const reduce=store.reduceEffect.bind(store);spyOn(store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof PowerEffect)throw new Error('Ability disabled');return reduce(s,e);});}
 return {state,player,opponent,card,mew,store,attack:new AttackEffect(player,opponent,attacks[0])};
}
describe('Bouffalant Boundless Power restriction',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 for(const copied of [false,true]) for(const suppressed of [false,true]) {
  it('marks the real attacker regardless of Curly Wall, copied='+copied+', suppressed='+suppressed,()=>{
   const b=battle(copied,suppressed);b.store.reduceEffect(b.state,b.attack);expect(b.player.active.cannotAttackNextTurnPending).toBe(true);
  });
  it('blocks the next turn and then expires, copied='+copied+', suppressed='+suppressed,()=>{
   const b=battle(copied,suppressed);b.store.reduceEffect(b.state,b.attack);b.state.phase=GamePhase.FINISHED;
   b.store.reduceEffect(b.state,new EndTurnEffect(b.player));expect(b.player.active.cannotAttackNextTurn).toBe(true);
   b.state.phase=GamePhase.FINISHED;b.state.activePlayer=1;b.store.reduceEffect(b.state,new EndTurnEffect(b.opponent));
   b.state.phase=GamePhase.PLAYER_TURN;b.state.activePlayer=0;let message='';try{b.store.reduceEffect(b.state,new UseAttackEffect(b.player,b.attack.attack));}catch(e){message=(e as Error).message;}
   expect(message).toBe('BLOCKED_BY_EFFECT');b.state.phase=GamePhase.FINISHED;b.store.reduceEffect(b.state,new EndTurnEffect(b.player));expect(b.player.active.cannotAttackNextTurn).toBe(false);
  });
 }
 for(const copied of [false,true])it('clears restriction when attacker switches, copied='+copied,()=>{
  const b=battle(copied,false), previous=b.player.active, bench=new PokemonCardList();bench.cards=[new Dummy()];b.player.bench=[bench];
  b.store.reduceEffect(b.state,b.attack);b.state.phase=GamePhase.FINISHED;b.store.reduceEffect(b.state,new EndTurnEffect(b.player));
  expect(previous.cannotAttackNextTurn).toBe(true);b.player.switchPokemon(bench);expect(previous.cannotAttackNextTurn).toBe(false);
 });
});

import { padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';
describe('Bouffalant real attack actions',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 for(const copied of [false,true]) it('resolves Boundless Power and applies next-turn restriction, copied='+copied,()=>{
  const g=setupGame({turn:3,player1:{active:{card:copied?'Mew ex 30C':'Bouffalant SCR',energy:['Fire Energy SVE','Fire Energy SVE','Fire Energy SVE']},bench:copied?[{card:'Bouffalant SCR'}]:[],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}});
  const target=g.player2.active.getPokemonCard()!;target.hp=1000;target.weakness=[];target.resistance=[];
  if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:'Boundless Power'}));useAbility(g.store,g.state,0,'Memory Helix');}
  else useAttack(g.store,g.state,0,'Boundless Power');
  expect(g.player2.active.damage).toBe(130);
  expect(g.player1.active.cannotAttackNextTurn||g.player1.active.cannotAttackNextTurnPending).toBe(true);
 });
});

import { BouffalantSVP } from '../set-scarlet-and-violet-promos/alt-arts';
describe('Bouffalant promotional print',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 for(const copied of [false,true]) it('retains Boundless Power restriction, copied='+copied,()=>{
  const state=new State(),player=new Player(),opponent=new Player(),card=new BouffalantSVP(),mew=new Mewex();
  player.id=1;opponent.id=2;state.players=[player,opponent];state.turn=2;state.activePlayer=0;state.phase=GamePhase.ATTACK;
  player.active.cards=[copied?mew:card];opponent.active.cards=[new Dummy()];
  const store=new Store({onStateChange:()=>undefined});store.state=state;const attacks=copied?cloneAttacks(card.attacks):card.attacks;
  if(copied)openCopyAttackSession(state,player,mew,card,attacks,attacks[0]);
  store.reduceEffect(state,new AttackEffect(player,opponent,attacks[0]));expect(player.active.cannotAttackNextTurnPending).toBe(true);expect(card.fullName).toBe('Bouffalant SVP');
 });
});

import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CardType } from '../../game/store/card/card-types';
describe('Bouffalant Curly Wall is not copied as an attack effect',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 it('retains the direct ability with two physical Bouffalant',()=>{
  const b=battle(false,false),bench=new PokemonCardList();bench.cards=[new Bouffalant()];b.player.bench=[bench];
  const incoming=new AttackEffect(b.opponent,b.player,{name:'Incoming',cost:[],damage:100,text:''});
  b.store.reduceEffect(b.state,new PutDamageEffect(incoming,100));expect(b.player.active.damage).toBe(40);
 });
 it('does not add a second Bouffalant or grant Curly Wall to the copycat',()=>{
  const b=battle(true,false),bench=new PokemonCardList();bench.cards=[b.card];b.player.bench=[bench];b.mew.cardType=CardType.COLORLESS;
  b.store.reduceEffect(b.state,b.attack);
  const incoming=new AttackEffect(b.opponent,b.player,{name:'Incoming',cost:[],damage:100,text:''});
  b.store.reduceEffect(b.state,new PutDamageEffect(incoming,100));expect(b.player.active.damage).toBe(100);
 });
});

describe('Boundless Power follows the actual attack source',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 for(const copied of [false,true])it('does not mark a replacement active when the attacker is on the Bench, copied='+copied,()=>{
  const b=battle(copied,false),source=b.player.active,replacement=new PokemonCardList();replacement.cards=[new Dummy()];
  b.player.active=replacement;b.player.bench=[source];b.attack.source=source;
  b.store.reduceEffect(b.state,b.attack);expect(source.cannotAttackNextTurnPending).toBe(true);expect(replacement.cannotAttackNextTurnPending).toBe(false);
 });
});
