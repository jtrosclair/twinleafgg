import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';
import { CardType, SpecialCondition, TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { ensureClientCards } from '../../client/cards';
import { ClientSimulator } from '../../client/simulator';
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Base64 } from '../../utils/base64';
import { GamePhase } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { CardList } from '../../game/store/state/card-list';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';

const printed: Array<[string,string,number,CardType]> = [
  ["Aipom MD2","51",60,CardType.COLORLESS],
  ["Chimchar MD","56",40,CardType.FIRE],
  ["Hippopotas MD","66",60,CardType.FIGHTING],
  ["Pikachu MD","70",60,CardType.LIGHTNING],
  ["Piplup MD","71",60,CardType.WATER],
  ["Spearow MD","74",50,CardType.COLORLESS],
  ["Starly MD","75",50,CardType.COLORLESS],
  ["Stunky MD","76",60,CardType.DARK],
  ["Turtwig MD","77",60,CardType.GRASS],
  ["Staravia MD","47",80,CardType.COLORLESS],
  ["Sudowoodo MD","48",80,CardType.FIGHTING],
  ["Monferno MD","41",70,CardType.FIRE],
  ["Plusle MD","28",60,CardType.LIGHTNING],
  ["Fearow UL","15",80,CardType.COLORLESS],
  ["Ursaring UL","27",100,CardType.COLORLESS],
  ["Dunsparce UL","29",60,CardType.COLORLESS],
  ["Grotle UL","31",90,CardType.GRASS],
  ["Plusle UL","36",60,CardType.LIGHTNING],
  ["Poliwhirl UL","37",80,CardType.WATER],
  ["Pupitar UL2","39",80,CardType.FIGHTING],
  ["Cherubi UL","47",50,CardType.GRASS],
  ["Larvitar UL2","51",60,CardType.FIGHTING],
  ["Magmar UL","52",70,CardType.FIRE],
  ["Mankey UL","53",50,CardType.FIGHTING],
  ["Natu UL","55",50,CardType.PSYCHIC],
  ["Onix UL2","57",90,CardType.FIGHTING],
  ["Riolu UL","60",60,CardType.FIGHTING],
  ["Squirtle UL","63",60,CardType.WATER],
  ["Teddiursa UL","65",60,CardType.COLORLESS],
  ["Beedrill UL","12",110,CardType.GRASS],
  ["Larvitar UL","50",50,CardType.FIGHTING],
  ["Stantler UL","64",70,CardType.COLORLESS],
];
class Bonus extends TrainerCard {
 public name='Bonus'; public fullName='Bonus TST'; public set='TST'; public trainerType=TrainerType.STADIUM;
 public reduceEffect(_s:StoreLike,state:State,e:Effect):State { if(e instanceof AttackEffect)e.damage+=20; return state; }
}
const w='Water Energy SVE',g='Grass Energy SVE',f='Fighting Energy SVE',r='Fire Energy SVE',l='Lightning Energy SVE',p='Psychic Energy SVE',d='Darkness Energy SVE';
function game(name:string, energy:string[], copied=false, ownBench:string[]=[], oppBench:string[]=[]) {
 getCardByName('Monferno MD');getCardByName('Fearow UL');
 const state=setupGame({turn:2,player1:{active:{card:copied?'Mew ex 30C':name,energy},bench:copied?[{card:name},...ownBench.map(card=>({card}))]:ownBench.map(card=>({card})),deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},bench:oppBench.map(card=>({card})),deck:padDeck(12)}});
 const target=state.player2.active.getPokemonCard()!;target.weakness=[];target.resistance=[];target.hp=1000;return state;
}
function attack(gm:ReturnType<typeof game>, name:string, copied=false) { if(copied){gm.overridePrompt('Choose attack',()=>({index:0,attack:name}));useAbility(gm.store,gm.state,0,'Memory Helix');}else useAttack(gm.store,gm.state,0,name); }
describe('Majestic Dawn and Unleashed 32-card batch',()=>{
 beforeEach(()=>spyOn(Math,'random').and.returnValue(0.1));
 for(const [name,number,hp,type] of printed) it('registers printed '+name,()=>{getCardByName('Monferno MD');getCardByName('Fearow UL');const c:any=getCardByName(name);expect(c.setNumber).toBe(number);expect(c.hp).toBe(hp);expect(c.cardType).toBe(type);});
 for(const copied of [false,true]) {
  const label=copied?'copied ':'direct ';
  for(const [name,move,energy,damage] of [
   ['Aipom MD2','Scratch',[w],10],['Chimchar MD','Flare',[r],20],['Piplup MD','Headbutt',[w,w],20],['Spearow MD','Wing Attack',[w],10],['Starly MD','Flap',[w,w],20],['Stunky MD','Slash',[w,w],20],['Turtwig MD','Razor Leaf',[g,w],30],
   ['Fearow UL','Wing Attack',[w,w],30],['Ursaring UL','Confront',[w],20],['Grotle UL','Razor Leaf',[g,w],30],['Poliwhirl UL','Light Punch',[w,w],30],['Pupitar UL2','Speed Attack',[f,w,w],50],['Cherubi UL','Tackle',[w],10],['Larvitar UL2','Knuckle Punch',[f,w],20],['Magmar UL','Magma Punch',[r,w],20],['Mankey UL','Punch',[w],10],['Natu UL','Peck',[w],10],['Squirtle UL','Shell Attack',[w,w,w],40]
  ] as Array<[string,string,string[],number]>)it(label+name+' printed damage',()=>{const s=game(name,energy,copied);attack(s,move,copied);expect(s.player2.active.damage).toBe(damage);});
  for(const [name,move,energy,base,bonus] of [
   ['Hippopotas MD','Grainy Sand',[f],10,10],['Pikachu MD','Quick Attack',[w],10,10],['Piplup MD','Water Splash',[w],10,10],['Staravia MD','Quick Attack',[w],10,30],['Monferno MD','Mid-air Strike',[w,w],30,30],['Ursaring UL','Cross Chop',[w,w,w],50,30]
  ] as Array<[string,string,string[],number,number]>)for(const heads of [false,true])it(label+name+' coin bonus '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const s=game(name,energy,copied);s.player1.stadium.cards.push(new Bonus());attack(s,move,copied);expect(s.player2.active.damage).toBe(base+20+(heads?bonus:0));});
  for(const [name,move,energy,base] of [['Aipom MD2','Last Resort',[w,w],30],['Chimchar MD','Lunge',[w,w],40],['Spearow MD','Claw',[w,w],30]] as Array<[string,string,string[],number]>)for(const heads of [false,true])it(label+name+' failed attack '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const s=game(name,energy,copied);s.player1.stadium.cards.push(new Bonus());attack(s,move,copied);expect(s.player2.active.damage).toBe(heads?base+20:0);});
  for(const [name,move,energy,count,unit] of [['Fearow UL','Repeating Drill',[w,w,w],5,20],['Riolu UL','Double Chop',[f,w],2,20],['Beedrill UL','Twineedle',[g],2,50]] as Array<[string,string,string[],number,number]>)for(let heads=0;heads<=count;heads++)it(label+name+' variable coin damage '+heads,()=>{let flips=0;(Math.random as jasmine.Spy).and.callFake(()=>flips++<heads?0.1:0.9);const s=game(name,energy,copied);s.player1.stadium.cards.push(new Bonus());attack(s,move,copied);expect(s.player2.active.damage).toBe(heads?heads*unit+20:0);});
  for(const [name,move,energy,condition,coin] of [['Stunky MD','Poison Gas',[d],SpecialCondition.POISONED,true],['Monferno MD','Fire Fang',[r],SpecialCondition.BURNED,false],['Grotle UL','Sleep Powder',[g,w,w],SpecialCondition.ASLEEP,true],['Poliwhirl UL','Hypnoblast',[w],SpecialCondition.ASLEEP,false],['Stantler UL','Mystifying Horns',[w,w,w],SpecialCondition.CONFUSED,false]] as Array<[string,string,string[],SpecialCondition,boolean]>)for(const heads of coin?[false,true]:[true])it(label+name+' condition '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const s=game(name,energy,copied);let applied=false;const reduce=s.store.reduceEffect.bind(s.store);spyOn(s.store,'reduceEffect').and.callFake((st:State,e:Effect)=>{const out=reduce(st,e);if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(condition)&&!e.preventDefault)applied=true;return out});attack(s,move,copied);expect(applied).toBe(heads);});
  for(const [name,move,energy,base,recoil] of [['Hippopotas MD','Double-edge',[w,w,w],40,10],['Pikachu MD','Volt Tackle',[l,w,w],50,10],['Sudowoodo MD','Wood Hammer',[f,f],50,30],['Teddiursa UL','Take Down',[w],20,10],['Larvitar UL','Reckless Charge',[w],20,10]] as Array<[string,string,string[],number,number]>)it(label+name+' recoil follows damage',()=>{const s=game(name,energy,copied),events:string[]=[],reduce=s.store.reduceEffect.bind(s.store);spyOn(s.store,'reduceEffect').and.callFake((st:State,e:Effect)=>{if(e instanceof DealDamageEffect)events.push(e.target===s.player1.active?'recoil':'damage');return reduce(st,e);});attack(s,move,copied);expect(s.player2.active.damage).toBe(base);expect(s.player1.active.damage).toBe(recoil);expect(events.indexOf('recoil')).toBeGreaterThan(events.indexOf('damage'));});
  for(const heads of [false,true])it(label+'Plusle UL flips after damage for recoil '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const s=game('Plusle UL',[l],copied);attack(s,'Thunder Jolt',copied);expect(s.player2.active.damage).toBe(20);expect(s.player1.active.damage).toBe(heads?0:10);});
  for(const amount of [0,10,20])it(label+'Sudowoodo Flail computes attack base '+amount,()=>{const s=game('Sudowoodo MD',[w],copied);s.player1.active.damage=amount;s.player1.stadium.cards.push(new Bonus());attack(s,'Flail',copied);expect(s.player2.active.damage).toBe(amount?amount+20:0);});
  for(const amount of [0,10,30,40])it(label+'Mankey Karate Chop computes attack base '+amount,()=>{const s=game('Mankey UL',[f,w],copied);s.player1.active.damage=amount;s.player1.stadium.cards.push(new Bonus());attack(s,'Karate Chop',copied);expect(s.player2.active.damage).toBe(amount<40?40-amount+20:0);});
  for(const count of [0,1,2])it(label+'Onix Swing Around counts heads '+count,()=>{let flips=0;(Math.random as jasmine.Spy).and.callFake(()=>flips++<count?0.1:0.9);const s=game('Onix UL2',[w,w,w],copied);s.player1.stadium.cards.push(new Bonus());attack(s,'Swing Around',copied);expect(s.player2.active.damage).toBe(40+20*count);});
  for(const size of [0,3,6,8])it(label+'Dunsparce draws up to six from hand '+size,()=>{const s=game('Dunsparce UL',[w],copied);for(let i=0;i<size;i++){const c=getCardByName('Grass Energy SVE');c.id=5000+i;s.player1.hand.cards.push(c);}attack(s,'Return',copied);expect(s.player1.hand.cards.length).toBe(Math.max(6,size));});
  it(label+'Plusle UL draws two cards',()=>{const s=game('Plusle UL',[w],copied);attack(s,'Collect',copied);expect(s.player1.hand.cards.length).toBe(2);});
  for(const [name,max] of [['Plusle MD',1],['Stantler UL',2]] as Array<[string,number]>)it(label+name+' searches Basics to Bench and shuffles',()=>{const s=game(name,[w],copied),targets=[] as any[];for(let i=0;i<max;i++){const c=getCardByName(i?'Squirtle BS':'Bulbasaur BS');c.id=9000+i;targets.push(c);s.player1.deck.cards.unshift(c);}let shuffled=false;s.overridePrompt('Choose cards',(prompt:any)=>targets.map(c=>prompt.cards.cards.indexOf(c)));s.overridePrompt('Shuffle deck',()=>{shuffled=true;return s.player1.deck.cards.map((_:unknown,i:number)=>i);});attack(s,'Call for Family',copied);expect(shuffled).toBe(true);for(const card of targets)expect(s.player1.bench.some(slot=>slot.cards.includes(card))).toBe(true);});
  for(const partner of [false,true])it(label+'Plusle MD Boost checks Minun on Bench '+partner,()=>{const s=game('Plusle MD',[l,w],copied,partner?['Minun FFI']:[]);attack(s,'– Boost',copied);expect(s.player2.active.damage).toBe(partner?40:20);});
  it(label+'Starly forces the opponent to switch',()=>{const s=game('Starly MD',[w],copied,[],['Charmander BS']),old=s.player2.active;attack(s,'Whirlwind',copied);expect(s.player2.active).not.toBe(old);expect(old.damage).toBe(10);});
  it(label+'Natu switches the original attacker',()=>{const s=game('Natu UL',[p],copied,['Charmander BS']),old=s.player1.active;attack(s,'Teleport',copied);expect(s.player1.active).not.toBe(old);expect(s.player1.bench).toContain(old);});
  it(label+'Larvitar discards the opposing top card then heals itself',()=>{const s=game('Larvitar UL',[w],copied),old=s.player2.deck.cards.length;const discarded=getCardByName('Bulbasaur BS'),drawn=getCardByName('Squirtle BS');discarded.id=9100;drawn.id=9101;s.player2.deck.cards.splice(0,2,discarded,drawn);s.player1.active.damage=30;attack(s,'Mountain Eater',copied);expect(s.player2.deck.cards.length).toBe(old-2);expect(s.player2.discard.cards).toEqual([discarded]);expect(s.player2.hand.cards).toContain(drawn);expect(s.player1.active.damage).toBe(10);});
  for(const heads of [false,true])it(label+'Beedrill applies Poison and optionally Paralysis '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const s=game('Beedrill UL',[g,w],copied),seen:SpecialCondition[]=[],reduce=s.store.reduceEffect.bind(s.store);spyOn(s.store,'reduceEffect').and.callFake((st:State,e:Effect)=>{const out=reduce(st,e);if(e instanceof AddSpecialConditionsEffect&&!e.preventDefault)seen.push(...e.specialConditions);return out});attack(s,'Paralyze Poison',copied);expect(seen).toContain(SpecialCondition.POISONED);expect(seen.includes(SpecialCondition.PARALYZED)).toBe(heads);});
 }
 it('round-trips all 32 registered cards in ClientSimulator snapshots',()=>{ensureClientCards();const state=new State();state.phase=GamePhase.PLAYER_TURN;state.turn=2;state.players=[new Player(),new Player()];const add=(list:CardList,name:string)=>{const card=CardManager.getInstance().getCardByName(name)!;expect(card).toBeDefined();card.id=state.cardNames.length;state.cardNames.push(card.fullName);list.cards.push(card);};state.players.forEach((player,i)=>{player.id=i+1;player.name=i?'Opponent':'Player';player.bench=Array.from({length:5},()=>new PokemonCardList());player.prizes=Array.from({length:6},()=>new CardList());player.prizes.forEach(x=>add(x,'Fire Energy SVE'));for(let j=0;j<9;j++)add(player.deck,'Fire Energy SVE');add(player.active,i?'Mew ex MEW':printed[0][0]);});printed.slice(1).forEach(([name])=>add(state.players[0].deck,name));const sim=new ClientSimulator();sim.loadSnapshot({stateData:new Base64().encode(new StateSerializer().serialize(state))});const restored=new ClientSimulator();restored.loadSnapshot({stateData:sim.getStateData()});for(const [name] of printed)expect(restored.state.cardNames).toContain(name);sim.cleanup();restored.cleanup();});
});
