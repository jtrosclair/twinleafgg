import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';
import { CardType, SpecialCondition, TrainerType } from '../../game/store/card/card-types';
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

const names = ['Cherubi AR','Electrike AR2','Gastly AR2','Treecko AR2','Wingull AR2','Gulpin AR2','Charmeleon AR','Grovyle AR2','Bagon AR','Bronzor AR2','Rapidash AR2','Omanyte AR','Tangela AR2','Bronzor AR','Graveler AR','Wormadam Sandy Cloak AR'];
class Bonus extends TrainerCard {
 public name='Bonus'; public fullName='Bonus TST'; public set='TST'; public trainerType=TrainerType.STADIUM;
 public reduceEffect(_s:StoreLike,state:State,e:Effect):State { if(e instanceof AttackEffect)e.damage+=20; return state; }
}
class TrashCloak extends PokemonCard { public set='TEST'; public name='Wormadam Trash Cloak'; public fullName='Wormadam Trash Cloak TEST'; }
function game(name:string, energy:string[], copied=false) {
 const g=setupGame({turn:2,player1:{active:{card:copied?'Mew ex 30C':name,energy},bench:copied?[{card:name}]:[],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}});
 g.player2.active.getPokemonCard()!.weakness=[];g.player2.active.getPokemonCard()!.resistance=[];return g;
}
function attack(g:ReturnType<typeof game>, name:string, copied=false) {
 if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:name}));useAbility(g.store,g.state,0,'Memory Helix');}else useAttack(g.store,g.state,0,name);
}

describe('Arceus historical batch 21',()=>{
 beforeEach(()=>spyOn(Math,'random').and.returnValue(0.1));
 for(const [name,number,hp,type] of [
  ['Cherubi AR','60',50,CardType.GRASS],['Electrike AR2','63',60,CardType.LIGHTNING],['Gastly AR2','64',50,CardType.PSYCHIC],['Treecko AR2','79',60,CardType.GRASS],['Wingull AR2','81',50,CardType.WATER],['Gulpin AR2','66',60,CardType.PSYCHIC],['Charmeleon AR','35',80,CardType.FIRE],['Grovyle AR2','39',80,CardType.GRASS],['Bagon AR','52',60,CardType.COLORLESS],['Bronzor AR2','54',60,CardType.METAL],['Rapidash AR2','47',90,CardType.FIRE],['Omanyte AR','70',80,CardType.WATER],['Tangela AR2','77',60,CardType.GRASS],['Bronzor AR','34',50,CardType.METAL],['Graveler AR','37',90,CardType.FIGHTING],['Wormadam Sandy Cloak AR','50',90,CardType.FIGHTING]
 ] as const) it('registers printed identity '+name,()=>{const c:any=getCardByName(name);expect(c.setNumber).toBe(number);expect(c.hp).toBe(hp);expect(c.cardType).toBe(type);});
 for(const copied of [false,true]) {
  const label=copied?'copied ':'direct ';
  for(const [name,move,energy,damage] of [
    ['Cherubi AR','Ram',['Water Energy SVE'],10],['Electrike AR2','Bite',['Water Energy SVE'],10],['Gastly AR2','Suffocating Gas',['Psychic Energy SVE','Water Energy SVE'],20],['Treecko AR2','Slash',['Grass Energy SVE','Water Energy SVE'],20],['Wingull AR2','Rain Splash',['Water Energy SVE'],20]
  ] as Array<[string,string,string[],number]>) it(label+name+' damage and printed attack',()=>{const g=game(name,energy,copied);attack(g,move,copied);expect(g.player2.active.damage).toBe(damage);});
  for(const [name,move,energy,count] of [
   ['Gulpin AR2','Collect',['Water Energy SVE'],1],['Tangela AR2','Collect',['Water Energy SVE'],1],['Omanyte AR','Collect',['Water Energy SVE'],3]
  ] as Array<[string,string,string[],number]>) {
   it(label+name+' draws '+count+' cards',()=>{const g=game(name,energy,copied),before=g.player1.hand.cards.length;attack(g,move,copied);expect(g.player1.hand.cards.length-before).toBe(count);});
   it(label+name+' draws only available cards from a short deck',()=>{const g=game(name,energy,copied),before=g.player1.hand.cards.length;g.player1.deck.cards.splice(1);attack(g,move,copied);expect(g.player1.hand.cards.length-before).toBe(1);expect(g.player1.deck.cards.length).toBe(0);});
  }
  for(const [name,move,energy,condition,coin] of [
   ['Bagon AR','Super Singe',['Fire Energy SVE','Water Energy SVE'],SpecialCondition.BURNED,true],['Bronzor AR2','Hypnosis',['Metal Energy SVE'],SpecialCondition.ASLEEP,true],['Rapidash AR2','Searing Flame',['Fire Energy SVE'],SpecialCondition.BURNED,false],['Omanyte AR','Tickle',['Water Energy SVE','Water Energy SVE'],SpecialCondition.PARALYZED,true],['Tangela AR2','Stun Spore',['Grass Energy SVE','Water Energy SVE','Water Energy SVE'],SpecialCondition.PARALYZED,true]
  ] as Array<[string,string,string[],SpecialCondition,boolean]>) {
   for(const heads of coin?[false,true]:[true]) it(label+name+' condition and damage ordering '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game(name,energy,copied),events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof DealDamageEffect)events.push('damage');if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(condition))events.push('condition');return reduce(s,e)});attack(g,move,copied);expect(events.includes('condition')).toBe(heads);if(heads)expect(events.indexOf('condition')).toBeGreaterThan(events.indexOf('damage'));});
   it(label+name+' respects defender attack-effect prevention',()=>{const g=game(name,energy,copied);g.player2.active.preventEffectsOfAttacksNextTurn=true;let applied=false;const reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const out=reduce(s,e);if(e instanceof AddSpecialConditionsEffect&&!e.preventDefault)applied=true;return out});attack(g,move,copied);expect(applied).toBe(false);});
  }
  for(const heads of [0,1,2])it(label+'Charmeleon Slam '+heads+' heads preserves damage bonuses',()=>{const g=game('Charmeleon AR',['Water Energy SVE','Water Energy SVE'],copied);g.player1.stadium.cards.push(new Bonus());let flips=0;(Math.random as jasmine.Spy).and.callFake(()=>flips++<heads?0.1:0.9);attack(g,'Slam',copied);expect(g.player2.active.damage).toBe(heads?heads*30+20:0);});
  for(const heads of [false,true])it(label+'Grovyle Quick Attack '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game('Grovyle AR2',['Water Energy SVE','Water Energy SVE'],copied);attack(g,'Quick Attack',copied);expect(g.player2.active.damage).toBe(heads?30:20);});
  for(const equal of [false,true])it(label+'Bronzor Extrasensory equal hands '+equal,()=>{const g=game('Bronzor AR',['Water Energy SVE','Water Energy SVE','Water Energy SVE'],copied);if(!equal)g.player2.hand.cards.push(getCardByName('Fire Energy SVE'));attack(g,'Extrasensory',copied);expect(g.player2.active.damage).toBe(equal?60:30);});
  it(label+'Graveler recoil affects original attacker after damage',()=>{const g=game('Graveler AR',['Fighting Energy SVE','Fighting Energy SVE','Water Energy SVE'],copied),events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof DealDamageEffect)events.push(e.target===g.player1.active?'recoil':'damage');return reduce(s,e)});attack(g,'Double-edge',copied);expect(g.player2.active.damage).toBe(70);expect(g.player1.active.damage).toBe(10);expect(events.indexOf('recoil')).toBeGreaterThan(events.indexOf('damage'));});
  for(const mode of ['none','own','opponent','hidden'])it(label+'Wormadam Cloak Headbutt examines current own Pokemon '+mode,()=>{const g=game('Wormadam Sandy Cloak AR',['Fighting Energy SVE','Water Energy SVE','Water Energy SVE'],copied);if(mode==='own'||mode==='hidden'){const slot=g.player1.bench[copied?1:0];slot.cards.push(new TrashCloak());if(mode==='hidden')slot.cards.push(getCardByName('Charmander BS'));}if(mode==='opponent')g.player2.bench[0].cards.push(new TrashCloak());attack(g,'Cloak Headbutt',copied);expect(g.player2.active.damage).toBe(mode==='own'?90:60);});
 }
 it('round trips all registered cards through a ClientSimulator snapshot',()=>{ensureClientCards();const state=new State();state.phase=GamePhase.PLAYER_TURN;state.turn=2;state.players=[new Player(),new Player()];const add=(list:CardList,name:string)=>{const c=CardManager.getInstance().getCardByName(name)!;expect(c).toBeDefined();c.id=state.cardNames.length;state.cardNames.push(c.fullName);list.cards.push(c);};state.players.forEach((p,index)=>{p.id=index+1;p.name=index?'Opponent':'Player';p.bench=Array.from({length:5},()=>new PokemonCardList());p.prizes=Array.from({length:6},()=>new CardList());p.prizes.forEach(x=>add(x,'Fire Energy SVE'));for(let j=0;j<9;j++)add(p.deck,'Fire Energy SVE');add(p.active,index?'Mew ex MEW':names[0]);});names.slice(1).forEach(name=>add(state.players[0].deck,name));const sim=new ClientSimulator();sim.loadSnapshot({stateData:new Base64().encode(new StateSerializer().serialize(state))});const out=sim.getStateData();const restored=new ClientSimulator();restored.loadSnapshot({stateData:out});for(const name of names)expect(restored.state.cardNames).toContain(name);sim.cleanup();restored.cleanup();});
});
