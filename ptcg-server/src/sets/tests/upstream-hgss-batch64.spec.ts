import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';
import { CardType, SpecialCondition, TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { State, GamePhase } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ClientSimulator } from '../../client/simulator';
import { ensureClientCards } from '../../client/cards';
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Base64 } from '../../utils/base64';
import { Player } from '../../game/store/state/player';
import { CardList } from '../../game/store/state/card-list';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';

const printed = [
 ['Arcanine HS','1',110,CardType.FIRE], ['Azumarill HS','2',90,CardType.WATER],
 ['Butterfree HS','16',120,CardType.GRASS], ['Caterpie HS','57',30,CardType.GRASS],
 ['Donphan HS2','40',100,CardType.FIGHTING], ["Farfetch'd HS",'19',60,CardType.COLORLESS],
 ['Miltank HS','47',90,CardType.COLORLESS], ['Furret HS','21',80,CardType.COLORLESS],
 ['Girafarig HS','64',70,CardType.COLORLESS], ['Growlithe HS','65',70,CardType.FIRE],
 ['Gyarados HS2','123',130,CardType.WATER], ['Heracross HS','43',80,CardType.GRASS],
 ['Hoothoot HS','66',50,CardType.COLORLESS], ['Jigglypuff HS','68',60,CardType.COLORLESS],
 ['Ledyba HS','71',50,CardType.GRASS], ['Magikarp HS','72',30,CardType.WATER],
 ['Marill HS','74',60,CardType.WATER], ['Meganium HS2','26',130,CardType.GRASS],
 ['Meowth HS','75',60,CardType.COLORLESS], ['Paras HS','76',50,CardType.GRASS],
 ['Parasect HS','48',90,CardType.GRASS], ['Pikachu HS','78',60,CardType.LIGHTNING],
 ['Quagsire HS','9',100,CardType.WATER], ['Qwilfish HS','50',70,CardType.WATER],
 ['Sandslash HS','29',80,CardType.FIGHTING], ['Sentret HS','80',50,CardType.COLORLESS],
 ['Skiploom HS','51',60,CardType.GRASS], ['Slowpoke HS','81',60,CardType.WATER],
 ['Snubbull HS','82',50,CardType.COLORLESS], ['Staryu HS','84',50,CardType.WATER],
 ['Weezing HS','34',90,CardType.PSYCHIC], ['Wobbuffet HS','13',90,CardType.PSYCHIC]
] as const;
class Bonus extends TrainerCard {
 public name='Bonus'; public fullName='Bonus TST'; public set='TST'; public trainerType=TrainerType.STADIUM;
 public reduceEffect(_s:StoreLike,state:State,e:Effect):State { if(e instanceof AttackEffect)e.damage+=20; return state; }
}
function game(name:string, energy:string[], copied=false) {
 getCardByName('Arcanine HS');
 const g=setupGame({turn:2,player1:{active:{card:copied?'Mew ex 30C':name,energy},bench:copied?[{card:name}]:[],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},bench:[{card:'Squirtle BS'}],deck:padDeck(12)}});
 g.player2.active.getPokemonCard()!.weakness=[];g.player2.active.getPokemonCard()!.resistance=[];
 g.player2.active.getPokemonCard()!.hp=1000;g.player2.bench[0].getPokemonCard()!.hp=1000;return g;
}
function attack(g:ReturnType<typeof game>, name:string, copied=false) {
 if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:name}));useAbility(g.store,g.state,0,'Memory Helix');}else useAttack(g.store,g.state,0,name);
}
const water='Water Energy SVE', grass='Grass Energy SVE', psychic='Psychic Energy SVE', lightning='Lightning Energy SVE', fighting='Fighting Energy SVE', fire='Fire Energy SVE';
describe('HeartGold SoulSilver 32-card batch',()=>{
 beforeEach(()=>spyOn(Math,'random').and.returnValue(0.1));
 for(const [name,number,hp,type] of printed) it('registers printed identity '+name,()=>{getCardByName('Arcanine HS');const c:any=getCardByName(name);expect(c.setNumber).toBe(number);expect(c.hp).toBe(hp);expect(c.cardType).toBe(type);});
 for(const copied of [false,true]) {
  const label=copied?'copied ':'direct ';
  for(const [name,move,energy,damage] of [
   ['Arcanine HS','Sharp Fang',[fire,water],50], ['Caterpie HS','Tackle',[water],20],
   ['Growlithe HS','Bite',[water],10], ['Magikarp HS','Splash',[water],10],
   ['Staryu HS','Spinning Attack',[water],20]
  ] as Array<[string,string,string[],number]>) it(label+name+' deals printed damage',()=>{const g=game(name,energy,copied);attack(g,move,copied);expect(g.player2.active.damage).toBe(damage);});
  for(const [name,move,energy,base,bonus] of [
   ['Marill HS','Water Splash',[water],10,10], ['Pikachu HS','Quick Attack',[lightning,water],20,10],
   ['Skiploom HS','Knock Away',[grass],20,10], ['Furret HS','Quick Blow',[water,water],20,20]
  ] as Array<[string,string,string[],number,number]>) for(const heads of [false,true]) it(label+name+' coin bonus '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game(name,energy,copied);g.player1.stadium.cards.push(new Bonus());attack(g,move,copied);expect(g.player2.active.damage).toBe(base+20+(heads?bonus:0));});
  for(const heads of [false,true]) it(label+'Slowpoke tails attack fails '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game('Slowpoke HS',[water],copied);g.player1.stadium.cards.push(new Bonus());attack(g,'Whimsy Tackle',copied);expect(g.player2.active.damage).toBe(heads?40:0);});
  for(const [name,move,energy,count,unit] of [
   ['Ledyba HS','Comet Punch',[water,water],4,10], ['Sandslash HS','Fury Swipes',[fighting,water,water],3,30],
   ['Donphan HS2','Double Spin',[fighting,fighting,water,water],2,70]
  ] as Array<[string,string,string[],number,number]>) for(let heads=0;heads<=count;heads++) it(label+name+' coin damage '+heads,()=>{const g=game(name,energy,copied);g.player1.stadium.cards.push(new Bonus());let flips=0;(Math.random as jasmine.Spy).and.callFake(()=>flips++<heads?0.1:0.9);attack(g,move,copied);expect(g.player2.active.damage).toBe(heads?heads*unit+20:0);});
  for(const [name,move,energy,condition,coin] of [
   ['Azumarill HS','Bubblebeam',[water,water,water],SpecialCondition.PARALYZED,true],
   ['Miltank HS','Body Slam',[water,water,water],SpecialCondition.PARALYZED,true],
   ['Hoothoot HS','Hypnosis',[water],SpecialCondition.ASLEEP,false],
   ['Jigglypuff HS','Hypnoblast',[water,water],SpecialCondition.ASLEEP,false],
   ['Meganium HS2','Sleep Powder',[grass],SpecialCondition.ASLEEP,false],
   ['Parasect HS','Sleep Drain',[grass],SpecialCondition.ASLEEP,false],
   ['Sandslash HS','Poison Sting',[fighting,water],SpecialCondition.POISONED,false],
   ['Weezing HS','Super Poison Breath',[psychic],SpecialCondition.POISONED,false]
  ] as Array<[string,string,string[],SpecialCondition,boolean]>) for(const heads of coin?[false,true]:[true]) it(label+name+' condition '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game(name,energy,copied);let applied=false;const reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const result=reduce(s,e);if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(condition)&&!e.preventDefault)applied=true;return result});attack(g,move,copied);expect(applied).toBe(heads);});
  for(const heads of [false,true])it(label+'Qwilfish chooses one condition '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game('Qwilfish HS',[water,water],copied),applied:SpecialCondition[]=[];const reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const result=reduce(s,e);if(e instanceof AddSpecialConditionsEffect&&!e.preventDefault)applied.push(...e.specialConditions);return result});attack(g,'Offensive Needle',copied);expect(applied).toContain(heads?SpecialCondition.POISONED:SpecialCondition.PARALYZED);});
  for(const name of ['Paras HS','Gyarados HS2'])it(label+name+' recoil follows outgoing damage',()=>{(Math.random as jasmine.Spy).and.returnValue(0.9);const move=name==='Paras HS'?'Double-edge Claw':'Thrash',g=game(name,name==='Paras HS'?[grass,water]:[water],copied),events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof DealDamageEffect)events.push(e.target===g.player1.active?'recoil':'damage');return reduce(s,e)});attack(g,move,copied);expect(g.player1.active.damage).toBe(name==='Paras HS'?10:20);expect(events.indexOf('recoil')).toBeGreaterThan(events.indexOf('damage'));});
  for(const [name,move,energy,amount] of [['Meganium HS2','Giant Bloom',[grass,water,water],20],['Parasect HS','Sleep Drain',[grass],40]] as Array<[string,string,string[],number]>)it(label+name+' heals original attacker',()=>{const g=game(name,energy,copied);g.player1.active.damage=60;attack(g,move,copied);expect(g.player1.active.damage).toBe(60-amount);});
  it(label+'Weezing recoil applies after outgoing damage to the original attacker',()=>{const g=game('Weezing HS',[water,water],copied);g.player1.active.getPokemonCard()!.hp=1000;attack(g,'Super Explosion',copied);expect(g.player2.active.damage).toBe(90);expect(g.player1.active.damage).toBe(90);});
  it(label+'Weezing ignores self Weakness but applies self Resistance',()=>{const g=game('Weezing HS',[water,water],copied);const attacker=g.player1.active.getPokemonCard()!;attacker.hp=1000;attacker.weakness=[{type:CardType.PSYCHIC}];attacker.resistance=[{type:CardType.PSYCHIC,value:-20}];attack(g,'Super Explosion',copied);expect(g.player2.active.damage).toBe(90);expect(g.player1.active.damage).toBe(70);});
  it(label+'Wobbuffet uses original attacker damage counters',()=>{const g=game('Wobbuffet HS',[psychic,water],copied);g.player1.active.damage=30;attack(g,'Double Return',copied);expect(g.player2.active.damage).toBe(60);});
  it(label+'Meowth draws after its attack',()=>{const g=game('Meowth HS',[water],copied),before=g.player1.hand.cards.length;attack(g,'Pay Day',copied);expect(g.player1.hand.cards.length-before).toBe(1);});
  it(label+'Heracross draws for effective Grass Pokémon',()=>{const g=game('Heracross HS',[grass,water],copied),before=g.player1.hand.cards.length;attack(g,'Green Draw',copied);expect(g.player1.hand.cards.length-before).toBe(1);});
  it(label+'Heracross counts Grass Pokémon when Green Draw resolves',()=>{const g=game('Heracross HS',[grass,water],copied),before=g.player1.hand.cards.length, reduce=g.store.reduceEffect.bind(g.store);let changed=false;spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const result=reduce(s,e);if(!changed&&e instanceof AttackEffect&&e.attack.name==='Green Draw'){changed=true;const newcomer=getCardByName('Bulbasaur BS');newcomer.id=900005;const empty=g.player1.bench.find(slot=>!slot.getPokemonCard())!;empty.cards.push(newcomer);}return result});attack(g,'Green Draw',copied);expect(changed).toBe(true);expect(g.player1.hand.cards.length-before).toBe(2);});
  for(const [name,move,count] of [["Farfetch'd HS",'Collect',2]] as Array<[string,string,number]>)it(label+name+' draws printed count',()=>{const g=game(name,[water],copied),before=g.player1.hand.cards.length;attack(g,move,copied);expect(g.player1.hand.cards.length-before).toBe(count);});
  for(const [name,move] of [["Farfetch'd HS",'Spin Turn']])it(label+name+' switches the original attacker after damage',()=>{const g=game(name,[water],copied),old=g.player1.active; if(!copied){const bench=getCardByName('Charmander BS');bench.id=900003;g.player1.bench[0].cards.push(bench);} attack(g,move,copied);expect(g.player2.active.damage).toBe(20);expect(g.player1.active).not.toBe(old);});
  for(const [name,move,filter] of [['Furret HS','Find a Friend','pokemon'],['Girafarig HS','Show Off','energy']])it(label+name+' searches, reveals and shuffles',()=>{const g=game(name,[water],copied),target=getCardByName(filter==='pokemon'?'Charmander BS':'Grass Energy SVE');target.id=900002;g.player1.deck.cards.unshift(target);let shown=false,shuffled=false;g.overridePrompt('Choose cards',(p:any)=>[p.cards.cards.indexOf(target)]);g.overridePrompt('Show cards',()=>{shown=true;expect(g.player1.hand.cards).not.toContain(target);return true});g.overridePrompt('Shuffle deck',()=>{shuffled=true;return g.player1.deck.cards.map((_:unknown,i:number)=>i)});attack(g,move,copied);expect(shown).toBe(true);expect(shuffled).toBe(true);expect(g.player1.hand.cards).toContain(target);});
  it(label+'Miltank searches for the named Moomoo Milk',()=>{const g=game('Miltank HS',[water],copied),target=getCardByName('Moomoo Milk LOT');target.id=900004;g.player1.deck.cards.unshift(target);let shown=false;g.overridePrompt('Choose cards',(p:any)=>[p.cards.cards.indexOf(target)]);g.overridePrompt('Show cards',()=>{shown=true;return true});attack(g,'Moomoo Squeeze',copied);expect(shown).toBe(true);expect(g.player1.hand.cards).toContain(target);});
  it(label+'Snubbull forces the opponent to switch',()=>{const g=game('Snubbull HS',[water],copied),old=g.player2.active;attack(g,'Roar',copied);expect(g.player2.active).not.toBe(old);});
  it(label+'Quagsire damages active and one Bench target',()=>{const g=game('Quagsire HS',[water,water,water],copied);g.overridePrompt('Choose pokemon',()=>[{player:PlayerType.TOP_PLAYER,slot:SlotType.BENCH,index:0}]);attack(g,'Muddy Water',copied);expect(g.player2.active.damage).toBe(40);expect(g.player2.bench[0].damage).toBe(20);});
  it(label+'Sentret looks at the opponent hand only',()=>{const g=game('Sentret HS',[water],copied);const target=getCardByName('Grass Energy SVE');target.id=900001;g.player2.hand.cards.push(target);let shown=false;g.overridePrompt('Show cards',(p:any)=>{shown=true;expect(p.playerId).toBe(g.player1.id);expect(p.cards).toContain(target);return true});attack(g,'Scout',copied);expect(shown).toBe(true);expect(g.player2.hand.cards).toContain(target);});
  it(label+'Butterfree heals all own Pokémon',()=>{const g=game('Butterfree HS',[grass],copied);if(!copied){const bench=getCardByName('Charmander BS');bench.id=900003;g.player1.bench[0].cards.push(bench);}g.player1.active.damage=50;g.player1.bench[0].damage=50;attack(g,'Cure Powder',copied);expect(g.player1.active.damage).toBe(20);expect(g.player1.bench[0].damage).toBe(20);});
 }
 it('round trips registered cards through ClientSimulator snapshots',()=>{ensureClientCards();const state=new State();state.phase=GamePhase.PLAYER_TURN;state.turn=2;state.players=[new Player(),new Player()];const add=(list:CardList,name:string)=>{const c=CardManager.getInstance().getCardByName(name)!;expect(c).toBeDefined();c.id=state.cardNames.length;state.cardNames.push(c.fullName);list.cards.push(c);};state.players.forEach((p,i)=>{p.id=i+1;p.name=i?'Opponent':'Player';p.bench=Array.from({length:5},()=>new PokemonCardList());p.prizes=Array.from({length:6},()=>new CardList());p.prizes.forEach(x=>add(x,'Fire Energy SVE'));for(let j=0;j<9;j++)add(p.deck,'Fire Energy SVE');add(p.active,i?'Mew ex MEW':printed[0][0]);});printed.slice(1).forEach(([name])=>add(state.players[0].deck,name));const sim=new ClientSimulator();sim.loadSnapshot({stateData:new Base64().encode(new StateSerializer().serialize(state))});const out=sim.getStateData();const restored=new ClientSimulator();restored.loadSnapshot({stateData:out});for(const [name] of printed)expect(restored.state.cardNames).toContain(name);sim.cleanup();restored.cleanup();});
});
