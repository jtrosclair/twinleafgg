import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';
import { CardType, SpecialCondition, Stage, TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { State, GamePhase } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { ClientSimulator } from '../../client/simulator';
import { ensureClientCards } from '../../client/cards';
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Base64 } from '../../utils/base64';
import { Player } from '../../game/store/state/player';
import { CardList } from '../../game/store/state/card-list';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';

const printed = [
 ['Bidoof SV','91',60,CardType.COLORLESS], ['Buizel SV','92',50,CardType.WATER],
 ['Chimchar SV','97',50,CardType.FIRE], ['Combee SV','99',40,CardType.GRASS],
 ['Corphish SV','100',50,CardType.WATER], ['Croagunk SV','101',60,CardType.PSYCHIC],
 ['Doduo SV','102',50,CardType.COLORLESS], ['Drifloon SV','103',40,CardType.PSYCHIC],
 ['Geodude SV','105',60,CardType.FIGHTING], ['Kricketot SV','109',50,CardType.GRASS],
 ['Magikarp SV','110',30,CardType.WATER], ['Magnemite SV','111',40,CardType.LIGHTNING],
 ['Mankey SV','112',50,CardType.FIGHTING], ['Meditite SV','113',60,CardType.PSYCHIC],
 ['Meowth SV','114',60,CardType.COLORLESS], ['Pikachu SV','120',50,CardType.LIGHTNING],
 ['Piplup SV','121',60,CardType.WATER], ['Sandshrew SV','124',50,CardType.FIGHTING],
 ['Seel SV','125',60,CardType.WATER], ['Shinx SV','126',60,CardType.LIGHTNING],
 ['Shroomish SV','127',60,CardType.GRASS], ['Starly SV','129',50,CardType.COLORLESS],
 ['Surskit SV','130',50,CardType.GRASS], ['Turtwig SV','131',60,CardType.GRASS]
] as const;
class Bonus extends TrainerCard {
 public name='Bonus'; public fullName='Bonus TST'; public set='TST'; public trainerType=TrainerType.STADIUM;
 public reduceEffect(_s:StoreLike,state:State,e:Effect):State { if(e instanceof AttackEffect)e.damage+=20; return state; }
}
function game(name:string, energy:string[], copied=false) {
 const g=setupGame({turn:2,player1:{active:{card:copied?'Mew ex 30C':name,energy},bench:copied?[{card:name}]:[],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}});
 g.player2.active.getPokemonCard()!.weakness=[];g.player2.active.getPokemonCard()!.resistance=[];return g;
}
function attack(g:ReturnType<typeof game>, name:string, copied=false) {
 if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:name}));useAbility(g.store,g.state,0,'Memory Helix');}else useAttack(g.store,g.state,0,name);
}

describe('Supreme Victors historical batch 22',()=>{
 beforeEach(()=>spyOn(Math,'random').and.returnValue(0.1));
 for(const [name,number,hp,type] of printed) it('registers printed identity '+name,()=>{const c:any=getCardByName(name);expect(c.setNumber).toBe(number);expect(c.hp).toBe(hp);expect(c.cardType).toBe(type);});
 for(const copied of [false,true]) {
  const label=copied?'copied ':'direct ';
  for(const [name,move,energy,damage] of [
   ['Buizel SV','Wave Splash',['Water Energy SVE','Water Energy SVE'],20], ['Croagunk SV','Corkscrew Punch',['Psychic Energy SVE','Water Energy SVE'],20],
   ['Kricketot SV','Beat',['Grass Energy SVE','Water Energy SVE'],20], ['Piplup SV','Surf',['Water Energy SVE','Water Energy SVE'],20],
   ['Sandshrew SV','Scratch',['Fighting Energy SVE'],20], ['Shinx SV','Bite',['Lightning Energy SVE','Water Energy SVE'],20],
   ['Starly SV','Peck',['Water Energy SVE','Water Energy SVE'],20]
  ] as Array<[string,string,string[],number]>) it(label+name+' deals printed damage',()=>{const g=game(name,energy,copied);attack(g,move,copied);expect(g.player2.active.damage).toBe(damage);});
  for(const [name,move,energy,base,bonus] of [
   ['Chimchar SV','Jump On',['Water Energy SVE','Water Energy SVE'],10,20], ['Corphish SV','Sharp Pincers',['Water Energy SVE'],10,10],
   ['Magnemite SV','Quick Attack',['Water Energy SVE','Water Energy SVE'],10,20], ['Surskit SV','Quick Attack',['Water Energy SVE'],10,10],
   ['Turtwig SV','Stomp',['Grass Energy SVE','Water Energy SVE','Water Energy SVE'],20,10]
  ] as Array<[string,string,string[],number,number]>) for(const heads of [false,true]) it(label+name+' coin bonus '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game(name,energy,copied);g.player1.stadium.cards.push(new Bonus());attack(g,move,copied);expect(g.player2.active.damage).toBe(base+20+(heads?bonus:0));});
  for(const [name,move,energy,base] of [
   ['Bidoof SV','Whimsy Tackle',['Water Energy SVE'],20], ['Geodude SV','Focus Fist',['Fighting Energy SVE','Water Energy SVE'],30]
  ] as Array<[string,string,string[],number]>) for(const heads of [false,true]) it(label+name+' failure coin '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game(name,energy,copied);g.player1.stadium.cards.push(new Bonus());attack(g,move,copied);expect(g.player2.active.damage).toBe(heads?base+20:0);});
  for(const [name,move,energy,count,unit] of [
   ['Magikarp SV','Flail Around',['Water Energy SVE'],3,10], ['Meowth SV','Double Kick',['Water Energy SVE','Water Energy SVE','Water Energy SVE'],2,20]
  ] as Array<[string,string,string[],number,number]>) for(let heads=0;heads<=count;heads++) it(label+name+' coin damage '+heads,()=>{const g=game(name,energy,copied);g.player1.stadium.cards.push(new Bonus());let flips=0;(Math.random as jasmine.Spy).and.callFake(()=>flips++<heads?0.1:0.9);attack(g,move,copied);expect(g.player2.active.damage).toBe(heads?heads*unit+20:0);});
  for(const [name,move,energy,condition] of [
   ['Pikachu SV','Thundershock',['Lightning Energy SVE','Water Energy SVE'],SpecialCondition.PARALYZED],
   ['Seel SV','Icy Wind',['Water Energy SVE','Water Energy SVE'],SpecialCondition.ASLEEP],
   ['Shroomish SV','Stun Spore',['Water Energy SVE'],SpecialCondition.PARALYZED]
  ] as Array<[string,string,string[],SpecialCondition]>) {
   for(const heads of [false,true]) it(label+name+' condition '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game(name,energy,copied),events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof DealDamageEffect)events.push('damage');if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(condition))events.push('condition');return reduce(s,e)});attack(g,move,copied);expect(events.includes('condition')).toBe(heads);if(heads)expect(events.indexOf('condition')).toBeGreaterThan(events.indexOf('damage'));});
   it(label+name+' respects attack-effect prevention',()=>{const g=game(name,energy,copied);g.player2.active.preventEffectsOfAttacksNextTurn=true;let applied=false;const reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const out=reduce(s,e);if(e instanceof AddSpecialConditionsEffect&&!e.preventDefault)applied=true;return out});attack(g,move,copied);expect(applied).toBe(false);});
  }
  for(const [name,move] of [['Doduo SV','Take Down'],['Drifloon SV','Reckless Charge']])it(label+name+' recoil follows damage on the original attacker',()=>{const g=game(name,['Water Energy SVE'],copied),events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof DealDamageEffect)events.push(e.target===g.player1.active?'recoil':'damage');return reduce(s,e)});attack(g,move,copied);expect(g.player2.active.damage).toBe(20);expect(g.player1.active.damage).toBe(10);expect(events.indexOf('recoil')).toBeGreaterThan(events.indexOf('damage'));});
  it(label+'Drifloon Collect draws one card',()=>{const g=game('Drifloon SV',['Psychic Energy SVE'],copied),before=g.player1.hand.cards.length;attack(g,'Collect',copied);expect(g.player1.hand.cards.length-before).toBe(1);});
  it(label+'Drifloon Collect handles an empty deck',()=>{const g=game('Drifloon SV',['Psychic Energy SVE'],copied),before=g.player1.hand.cards.length;g.player1.deck.cards.splice(0);attack(g,'Collect',copied);expect(g.player1.hand.cards.length-before).toBe(0);});
  for(const damage of [0,10,30])it(label+'Combee Nap heals attacker '+damage,()=>{const g=game('Combee SV',['Grass Energy SVE'],copied);g.player1.active.damage=damage;attack(g,'Nap',copied);expect(g.player1.active.damage).toBe(Math.max(0,damage-20));});
  for(const lvx of [false,true])it(label+'Mankey Extra Punch tests defending LV.X '+lvx,()=>{const g=game('Mankey SV',['Fighting Energy SVE'],copied);g.player2.active.getPokemonCard()!.stage=lvx?Stage.LV_X:Stage.BASIC;attack(g,'Extra Punch',copied);expect(g.player2.active.damage).toBe(lvx?60:10);});
  for(const damage of [0,10,20,30,40])it(label+'Meditite Karate Chop attacker damage '+damage,()=>{const g=game('Meditite SV',['Psychic Energy SVE','Water Energy SVE'],copied);g.player1.active.damage=damage;g.player1.stadium.cards.push(new Bonus());attack(g,'Karate Chop',copied);expect(g.player2.active.damage).toBe(damage<30?30-damage+20:0);});
 }
 it('round trips all registered cards through a ClientSimulator snapshot',()=>{ensureClientCards();const state=new State();state.phase=GamePhase.PLAYER_TURN;state.turn=2;state.players=[new Player(),new Player()];const add=(list:CardList,name:string)=>{const c=CardManager.getInstance().getCardByName(name)!;expect(c).toBeDefined();c.id=state.cardNames.length;state.cardNames.push(c.fullName);list.cards.push(c);};state.players.forEach((p,index)=>{p.id=index+1;p.name=index?'Opponent':'Player';p.bench=Array.from({length:5},()=>new PokemonCardList());p.prizes=Array.from({length:6},()=>new CardList());p.prizes.forEach(x=>add(x,'Fire Energy SVE'));for(let j=0;j<9;j++)add(p.deck,'Fire Energy SVE');add(p.active,index?'Mew ex MEW':printed[0][0]);});printed.slice(1).forEach(([name])=>add(state.players[0].deck,name));const sim=new ClientSimulator();sim.loadSnapshot({stateData:new Base64().encode(new StateSerializer().serialize(state))});const out=sim.getStateData();const restored=new ClientSimulator();restored.loadSnapshot({stateData:out});for(const [name] of printed)expect(restored.state.cardNames).toContain(name);sim.cleanup();restored.cleanup();});
});
