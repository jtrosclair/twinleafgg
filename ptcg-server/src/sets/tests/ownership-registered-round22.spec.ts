import { StateSerializer } from '../../game/serializer/state-serializer';
import { Store } from '../../game/store/store';
import { CardTag, CardType } from '../../game/store/card/card-types';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { PutDamageEffect, PutCountersEffect } from '../../game/store/effects/attack-effects';
import { GamePhase, State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';

type Entry = {name:string; attack:string; energy:string[]; damage:number};
const entries: Entry[] = [
 {name:'Giratina EX AOR',attack:'Chaos Wheel',energy:['Grass Energy SVE','Psychic Energy SVE','Fire Energy SVE','Fire Energy SVE'],damage:100},
 {name:'Wobbuffet SS',attack:'Flip Over',energy:['Psychic Energy SVE','Fire Energy SVE','Fire Energy SVE'],damage:50},
 {name:"Team Rocket's Articuno DRI",attack:'Dark Frost',energy:['Water Energy SVE','Fire Energy SVE','Fire Energy SVE'],damage:60},
 {name:'Scovillain ex SSP',attack:'Spicy Rage',energy:['Fire Energy SVE','Fire Energy SVE'],damage:10},
 {name:'Groudon ex HL',attack:'Rock Tumble',energy:['Fire Energy SVE','Fire Energy SVE'],damage:30},
 {name:'Kyogre ex HL',attack:'Water Arrow',energy:['Fire Energy SVE','Fire Energy SVE'],damage:20},
];
function game(e:Entry,copied:boolean,opponent='Squirtle BS') {
 const g=setupGame({turn:3,player1:{active:{card:copied?'Mew TM':e.name,energy:e.energy},bench:[{card:'Charmander BS'}],deck:padDeck(10)},player2:{active:{card:opponent},deck:padDeck(10)}});
 g.player1.active.getPokemonCard()!.hp=1000; const target=g.player2.active.getPokemonCard()!; target.hp=1000;target.weakness=[];target.resistance=[];
 g.overridePrompt('Choose pokemon',()=>[{player:PlayerType.TOP_PLAYER,slot:SlotType.ACTIVE,index:0}]);
 if(copied){g.player1.lostzone.cards.push(getCardByName(e.name));g.overridePrompt('Choose attack',()=>({index:0,attack:e.attack}));useAbility(g.store,g.state,0,'Lost Link');}
 else useAttack(g.store,g.state,0,e.attack);
 return g;
}
function incoming(g:ReturnType<typeof game>) {
 g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;
 return new AttackEffect(g.player2,g.player1,{name:'Hit',cost:[],damage:100,text:''});
}
describe('registered copied-attack ownership round 22',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 for(const e of entries) for(const copied of [false,true]) it(`${copied?'copies':'retains'} ${e.name} attack`,()=>{
  const g=game(e,copied);expect(g.player2.active.damage).toBe(e.damage);
 });
 for(const copied of [false,true]) it('retains Chaos Wheel Tool, Special Energy and Stadium locks; copied '+copied,()=>{
  const g=game(entries[0],copied);const m=g.player2.marker.markers.map(x=>x.name);
  expect(m).toContain(g.player2.ATTACK_EFFECT_TOOL_LOCK);expect(m).toContain(g.player2.ATTACK_EFFECT_SPECIAL_ENERGY_LOCK);expect(m).toContain(g.player2.ATTACK_EFFECT_STADIUM_LOCK);
 });
 for(const copied of [false,true]) it('retains Flip Over recoil; copied '+copied,()=>{
  const g=game(entries[1],copied);expect(g.player1.active.damage).toBe(10);
 });
 for(const copied of [false,true]) it('retains Spicy Rage bonus for damage counters; copied '+copied,()=>{
  const e=entries[3];const g=setupGame({turn:3,player1:{active:{card:copied?'Mew TM':e.name,energy:e.energy},bench:[{card:'Charmander BS'}],deck:padDeck(10)},player2:{active:{card:'Squirtle BS'},deck:padDeck(10)}});
  g.player1.active.getPokemonCard()!.hp=1000;g.player1.active.damage=20;g.player2.active.getPokemonCard()!.hp=1000;g.player2.active.getPokemonCard()!.weakness=[];
  if(copied){g.player1.lostzone.cards.push(getCardByName(e.name));g.overridePrompt('Choose attack',()=>({index:0,attack:e.attack}));useAbility(g.store,g.state,0,'Lost Link');}else useAttack(g.store,g.state,0,e.attack);
  expect(g.player2.active.damage).toBe(150);
 });
 for(const copied of [false,true]) it('does '+(copied?'not grant copied':'retain original')+' Renegade Pulse',()=>{
  const g=game(entries[0],copied);g.player2.active.getPokemonCard()!.tags.push(CardTag.MEGA);const hit=new PutDamageEffect(incoming(g),100);g.store.reduceEffect(g.state,hit);
  expect(hit.preventDefault).toBe(!copied);expect(g.player1.active.damage).toBe(copied?100:0);
 });
 for(const copied of [false,true]) it('does '+(copied?'not grant copied':'retain original')+' Safeguard',()=>{
  const g=game(entries[1],copied);g.player1.active.damage=0;g.player2.active.getPokemonCard()!.tags.push(CardTag.POKEMON_ex);const hit=new PutDamageEffect(incoming(g),100);g.store.reduceEffect(g.state,hit);
  expect(hit.preventDefault).toBe(!copied);expect(g.player1.active.damage).toBe(copied?100:0);
 });
 for(const copied of [false,true]) it('does '+(copied?'not grant copied':'retain original')+' Resistant Veil',()=>{
  const g=game(entries[2],copied);g.player1.active.getPokemonCard()!.tags.push(CardTag.TEAM_ROCKET);const hit=new PutCountersEffect(incoming(g),10);g.store.reduceEffect(g.state,hit);
  expect(hit.preventDefault).toBe(!copied);
 });
 for(const copied of [false,true]) it('does '+(copied?'not grant copied':'retain original')+' Double Type',()=>{
  const g=game(entries[3],copied);const check=new CheckPokemonTypeEffect(g.player1.active);g.store.reduceEffect(g.state,check);
  expect(check.cardTypes).toEqual(copied?[CardType.PSYCHIC]:[CardType.FIRE,CardType.GRASS]);
 });
 for(const [idx,attacker] of [[4,'Kyogre ex HL'],[5,'Groudon ex HL']] as [number,string][]) for(const copied of [false,true])
  it('does '+(copied?'not grant copied':'retain original')+' Mark of Antiquity for '+entries[idx].name,()=>{
   const g=game(entries[idx],copied);g.player2.active.cards[0]=getCardByName(attacker);const hit=incoming(g);
   if(copied) expect(()=>g.store.reduceEffect(g.state,hit)).not.toThrow();else expect(()=>g.store.reduceEffect(g.state,hit)).toThrow();
  });
 for(const copied of [false,true]) it('keeps Flip Over recoil on the original attacker if the active slot changes; copied '+copied,()=>{
  const e=entries[1];const g=setupGame({turn:3,player1:{active:{card:copied?'Mew TM':e.name,energy:e.energy},bench:[{card:'Charmander BS'}],deck:padDeck(10)},player2:{active:{card:'Squirtle BS'},deck:padDeck(10)}});
  const original=g.player1.active;original.getPokemonCard()!.hp=1000;g.player2.active.getPokemonCard()!.hp=1000;g.player2.active.getPokemonCard()!.weakness=[];
  const reduce=g.store.reduceEffect.bind(g.store); let switched=false;
  spyOn(g.store,'reduceEffect').and.callFake((state:State,effect:Effect)=>{
   const result=reduce(state,effect);
   if(!switched && effect instanceof PutDamageEffect && effect.target===g.player2.active && effect.damage===50){
    expect(original.damage).toBe(0); switched=true;g.player1.switchPokemon(g.player1.bench[0]);
   }
   return result;
  });
  if(copied){g.player1.lostzone.cards.push(getCardByName(e.name));g.overridePrompt('Choose attack',()=>({index:0,attack:e.attack}));useAbility(g.store,g.state,0,'Lost Link');}
  else useAttack(g.store,g.state,0,e.attack);
  expect(switched).toBe(true);expect(original.damage).toBe(10);expect(g.player1.active.damage).toBe(0);
 });
 for(const copied of [false,true]) it('retains Crushing Mantle Energy discard and bonus; copied '+copied,()=>{
  const e=entries[4];const energy=['Fighting Energy SVE','Fighting Energy SVE','Fire Energy SVE'];
  const g=setupGame({turn:3,player1:{active:{card:copied?'Mew TM':e.name,energy},hand:['Water Energy SVE'],bench:[{card:'Charmander BS'}],deck:padDeck(10)},player2:{active:{card:'Squirtle BS'},deck:padDeck(10)}});
  g.player1.active.getPokemonCard()!.hp=1000;g.player2.active.getPokemonCard()!.hp=1000;g.player2.active.getPokemonCard()!.weakness=[];
  if(copied){g.player1.lostzone.cards.push(getCardByName(e.name));g.overridePrompt('Choose attack',()=>({index:0,attack:'Crushing Mantle'}));useAbility(g.store,g.state,0,'Lost Link');}
  else useAttack(g.store,g.state,0,'Crushing Mantle');
  expect(g.player2.active.damage).toBe(60);expect(g.player1.hand.cards.length).toBe(0);expect(g.player1.discard.cards.some(c=>c.name==='Water Energy')).toBe(true);
 });
 for(const copied of [false,true]) it('retains Super Tidal Wave bonus and after-attack shuffle; copied '+copied,()=>{
  const e=entries[5];const energy=['Water Energy SVE','Water Energy SVE','Fire Energy SVE'];
  const g=setupGame({turn:3,player1:{active:{card:copied?'Mew TM':e.name,energy},hand:['Water Energy SVE','Fire Energy SVE'],bench:[{card:'Charmander BS'}],deck:padDeck(10)},player2:{active:{card:'Squirtle BS'},deck:padDeck(10)}});
  g.player1.active.getPokemonCard()!.hp=1000;g.player2.active.getPokemonCard()!.hp=1000;g.player2.active.getPokemonCard()!.weakness=[];
  const handIds=g.player1.hand.cards.map(c=>c.id);
  if(copied){g.player1.lostzone.cards.push(getCardByName(e.name));g.overridePrompt('Choose attack',()=>({index:0,attack:'Super Tidal Wave'}));useAbility(g.store,g.state,0,'Lost Link');}
  else useAttack(g.store,g.state,0,'Super Tidal Wave');
  expect(g.player2.active.damage).toBe(70);expect(g.player1.hand.cards.length).toBe(0);
  expect(g.player1.deck.cards.filter(c=>handIds.includes(c.id)).length).toBe(2);
 });
 for(const copied of [false,true]) it('retains the Giratina EX2 AOR alternate print and its ownership; copied '+copied,()=>{
  const e={...entries[0],name:'Giratina EX2 AOR'};const g=game(e,copied);expect(g.player2.active.damage).toBe(100);
  g.player2.active.getPokemonCard()!.tags.push(CardTag.MEGA);const hit=new PutDamageEffect(incoming(g),100);g.store.reduceEffect(g.state,hit);
  expect(hit.preventDefault).toBe(!copied);
 });
 it('does not restore copied Giratina Renegade Pulse while retaining Chaos Wheel locks',()=>{
  const g=game(entries[0],true);
  const lists=[g.player1.active,...g.player1.bench,g.player1.deck,g.player1.hand,g.player1.discard,g.player1.lostzone,...g.player1.prizes,
   g.player2.active,...g.player2.bench,g.player2.deck,g.player2.hand,g.player2.discard,g.player2.lostzone,...g.player2.prizes];
  const cards=[...new Set(lists.flatMap(list=>list.cards))];cards.forEach((card,index)=>{card.id=index;});
  g.state.cardNames=cards.map(card=>card.fullName);StateSerializer.setKnownCards(cards);
  const serializer=new StateSerializer();const state=serializer.deserialize(serializer.serialize(g.state));const store=new Store({onStateChange:()=>undefined});store.restoreState(state);
  const player=state.players[0],opponent=state.players[1];state.activePlayer=1;state.phase=GamePhase.ATTACK;
  opponent.active.getPokemonCard()!.tags.push(CardTag.MEGA);
  const hit=new PutDamageEffect(new AttackEffect(opponent,player,{name:'Hit',cost:[],damage:100,text:''}),100);store.reduceEffect(state,hit);
  expect(hit.preventDefault).toBe(false);expect(player.active.damage).toBe(100);
  const markers=opponent.marker.markers.map(m=>m.name);expect(markers).toContain(opponent.ATTACK_EFFECT_TOOL_LOCK);
  expect(markers).toContain(opponent.ATTACK_EFFECT_SPECIAL_ENERGY_LOCK);expect(markers).toContain(opponent.ATTACK_EFFECT_STADIUM_LOCK);
 });
});
