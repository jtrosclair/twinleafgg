import { CardTag, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect, DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { GamePhase } from '../../game/store/state/state';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';

type Entry = {name:string; attack:string; energy:string[]; damage:number};
const entries: Entry[] = [
 {name:'Forretress ex PAL', attack:'Guard Press',energy:['Grass Energy SVE','Grass Energy SVE'],damage:120},
 {name:'Milotic ex SSP', attack:'Hypno Splash',energy:['Water Energy SVE','Water Energy SVE','Water Energy SVE'],damage:160},
 {name:'Farigiraf ex TEF', attack:'Dirty Beam',energy:['Psychic Energy SVE','Psychic Energy SVE','Psychic Energy SVE'],damage:160},
 {name:'Toedscruel ex OBF', attack:'Colony Rush',energy:['Grass Energy SVE','Grass Energy SVE'],damage:80},
 {name:'Tangrowth TWM', attack:'Loom Over',energy:['Grass Energy SVE','Grass Energy SVE','Grass Energy SVE'],damage:150},
 {name:'Iron Crown ex TEF', attack:'Twin Shotels',energy:['Psychic Energy SVE','Psychic Energy SVE','Psychic Energy SVE'],damage:50},
];
function game(entry:Entry, active='Mew TM') {
 const g=setupGame({turn:3,player1:{active:{card:active,energy:entry.energy},bench:[{card:'Charmander BS'}],deck:padDeck(10)},player2:{active:{card:'Squirtle BS'},deck:padDeck(10)}});
 g.player1.active.getPokemonCard()!.hp=1000; const defender=g.player2.active.getPokemonCard()!;defender.hp=1000;defender.weakness=[];defender.resistance=[];
 return g;
}
function copied(entry:Entry) {const g=game(entry);g.player1.lostzone.cards.push(getCardByName(entry.name));g.overridePrompt('Choose attack',()=>({index:0,attack:entry.attack}));useAbility(g.store,g.state,0,'Lost Link');return g;}
function incomingBench(g:ReturnType<typeof game>,targetIndex:number) {
 g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;
 const e=new PutDamageEffect(new AttackEffect(g.player2,g.player1,{name:'Bench Hit',cost:[],damage:40,text:''}),40);
 e.target=g.player1.bench[targetIndex];g.store.reduceEffect(g.state,e);return e;
}
describe('registered attack and ability ownership round 19',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 for(const entry of entries) {
  it('copies '+entry.name+' attack',()=>{const g=copied(entry);expect(g.player2.active.damage).toBe(entry.damage);});
  it('preserves '+entry.name+' real attack',()=>{const g=game(entry,entry.name);useAttack(g.store,g.state,0,entry.attack);expect(g.player2.active.damage).toBe(entry.damage);});
 }
 it('does not grant Forretress Tera Bench protection to a copying Mew',()=>{
  const g=copied(entries[0]);const mew=g.player1.active;g.player1.switchPokemon(g.player1.bench[0]);const i=g.player1.bench.indexOf(mew);expect(i).toBeGreaterThanOrEqual(0);
  const e=incomingBench(g,i);expect(e.preventDefault).not.toBe(true);expect(mew.damage).toBe(40);
 });
 it('preserves the real Forretress Tera Bench protection',()=>{
  const g=game(entries[0]);g.player1.bench[0].cards=[getCardByName('Forretress ex PAL')];const e=incomingBench(g,0);expect(e.preventDefault).toBe(true);expect(g.player1.bench[0].damage).toBe(0);
 });
 for(const copiedAttack of [false,true]) it('Guard Press reduces incoming damage, copied '+copiedAttack,()=>{
   const g=copiedAttack?copied(entries[0]):game(entries[0],'Forretress ex PAL');if(!copiedAttack)useAttack(g.store,g.state,0,'Guard Press');
   g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;const e=new PutDamageEffect(new AttackEffect(g.player2,g.player1,{name:'Hit',cost:[],damage:100,text:''}),100);g.store.reduceEffect(g.state,e);expect(g.player1.active.damage).toBe(70);
 });

 it('preserves the real Milotic defense against Tera attackers',()=>{
  const g=game(entries[1],entries[1].name);g.player2.active.getPokemonCard()!.tags.push(CardTag.POKEMON_TERA);g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;
  const e=new PutDamageEffect(new AttackEffect(g.player2,g.player1,{name:'Hit',cost:[],damage:100,text:''}),100);g.store.reduceEffect(g.state,e);expect(e.preventDefault).toBe(true);expect(g.player1.active.damage).toBe(0);
 });
 it('preserves real Farigiraf defense against Basic ex damage',()=>{
  const g=game(entries[2],entries[2].name);g.player2.active.getPokemonCard()!.tags.push(CardTag.POKEMON_ex);g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;
  const e=new PutDamageEffect(new AttackEffect(g.player2,g.player1,{name:'Hit',cost:[],damage:100,text:''}),100);g.store.reduceEffect(g.state,e);expect(e.preventDefault).toBe(true);expect(g.player1.active.damage).toBe(0);
 });
 it('preserves real Tangrowth damage reduction',()=>{
  const g=game(entries[4],entries[4].name);g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;
  const e=new PutDamageEffect(new AttackEffect(g.player2,g.player1,{name:'Hit',cost:[],damage:100,text:''}),100);g.store.reduceEffect(g.state,e);expect(g.player1.active.damage).toBe(70);
 });
 it('preserves the real Iron Crown Future damage bonus',()=>{
  const g=game(entries[5]);g.player1.active.getPokemonCard()!.tags.push(CardTag.FUTURE);g.player1.bench[0].cards=[getCardByName(entries[5].name)];g.state.phase=GamePhase.ATTACK;
  const e=new DealDamageEffect(new AttackEffect(g.player1,g.player2,{name:'Hit',cost:[],damage:40,text:''}),40);g.store.reduceEffect(g.state,e);expect(e.damage).toBe(60);
 });
 for(const copy of [false,true]) it('expires Guard Press when the defender turn ends, copied '+copy,()=>{
  const g=copy?copied(entries[0]):game(entries[0],entries[0].name);if(!copy)useAttack(g.store,g.state,0,'Guard Press');
  g.state.phase=GamePhase.FINISHED;g.store.reduceEffect(g.state,new EndTurnEffect(g.player2));g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;
  const e=new PutDamageEffect(new AttackEffect(g.player2,g.player1,{name:'Hit',cost:[],damage:100,text:''}),100);g.store.reduceEffect(g.state,e);expect(g.player1.active.damage).toBe(100);
 });

 it('preserves real Toedscruel protection for Energy-attached Pokemon',()=>{
  const g=game(entries[3]);g.player1.bench[0].cards=[getCardByName(entries[3].name)];g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;
  const effect=new AddSpecialConditionsEffect(new AttackEffect(g.player2,g.player1,{name:'Status',cost:[],damage:0,text:''}),[SpecialCondition.ASLEEP]);g.store.reduceEffect(g.state,effect);expect(effect.preventDefault).toBe(true);expect(g.player1.active.specialConditions).not.toContain(SpecialCondition.ASLEEP);
 });
 it('does not give copied Toedscruel protection to the copying Pokemon',()=>{
  const g=copied(entries[3]);g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;
  const effect=new AddSpecialConditionsEffect(new AttackEffect(g.player2,g.player1,{name:'Status',cost:[],damage:0,text:''}),[SpecialCondition.ASLEEP]);g.store.reduceEffect(g.state,effect);expect(effect.preventDefault).not.toBe(true);expect(g.player1.active.specialConditions).toContain(SpecialCondition.ASLEEP);
 });
});
