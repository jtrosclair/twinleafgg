import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';
import { CardType, SpecialCondition, TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { State, GamePhase } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { ClientSimulator } from '../../client/simulator';
import { ensureClientCards } from '../../client/cards';
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Base64 } from '../../utils/base64';
import { Player } from '../../game/store/state/player';
import { CardList } from '../../game/store/state/card-list';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';

const printed = [
 ['Dragonair LA','52',70,CardType.COLORLESS],['Gliscor LA2','55',90,CardType.FIGHTING], ['Metang LA2','65',80,CardType.METAL],
 ['Beldum LA2','84',50,CardType.METAL],['Chinchou LA','87',60,CardType.WATER],['Chinchou LA2','88',50,CardType.LIGHTNING],
 ['Cubone LA','90',60,CardType.FIGHTING],['Dratini LA','91',40,CardType.COLORLESS],['Drifloon LA','92',50,CardType.PSYCHIC],
 ['Gligar LA','94',60,CardType.FIGHTING],['Gligar LA2','95',50,CardType.FIGHTING],['Ledyba LA','104',50,CardType.GRASS],
 ['Meowth LA','106',50,CardType.COLORLESS],['Nosepass LA','109',70,CardType.FIGHTING],['Numel LA','110',60,CardType.FIRE],
 ['Oddish LA2','111',40,CardType.GRASS],['Poliwag LA','114',40,CardType.WATER],['Poliwhirl LA','115',80,CardType.WATER],
 ['Riolu LA','117',60,CardType.FIGHTING],['Weepinbell LA','127',80,CardType.GRASS],['Leafeon MD2','24',90,CardType.GRASS],
 ['Fearow MD','36',80,CardType.COLORLESS],['Kangaskhan MD','38',90,CardType.COLORLESS],['Lickitung MD','39',70,CardType.COLORLESS]
] as const;
class Bonus extends TrainerCard {
 public name='Bonus'; public fullName='Bonus TST'; public set='TST'; public trainerType=TrainerType.STADIUM;
 public reduceEffect(_s:StoreLike,state:State,e:Effect):State { if(e instanceof AttackEffect)e.damage+=20; return state; }
}
function register() { getCardByName('Oddish LA'); getCardByName('Eevee MD'); }
function game(name:string, energy:string[], copied=false, bench:string[] = []) {
 register();
 const g=setupGame({turn:2,player1:{active:{card:copied?'Mew ex 30C':name,energy},bench:copied?[{card:name},...bench.map(card=>({card}))]:bench.map(card=>({card})),deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}});
 g.player2.active.getPokemonCard()!.weakness=[];g.player2.active.getPokemonCard()!.resistance=[];return g;
}
function attack(g:ReturnType<typeof game>, name:string, copied=false) {
 if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:name}));useAbility(g.store,g.state,0,'Memory Helix');}else useAttack(g.store,g.state,0,name);
}

describe('Legends Awakened and Majestic Dawn historical batch 23',()=>{
 beforeEach(()=>{register();spyOn(Math,'random').and.returnValue(0.1);});
 for(const [name,number,hp,type] of printed) it('registers printed identity '+name,()=>{const c:any=getCardByName(name);expect(c.setNumber).toBe(number);expect(c.hp).toBe(hp);expect(c.cardType).toBe(type);});
 it('uses the printed spelling Spiral Drain',()=>{const c:any=getCardByName('Leafeon MD2');expect(c.attacks[0].name).toBe('Spiral Drain');});
 for(const copied of [false,true]) {
  const label=copied?'copied ':'direct ';
  for(const [name,move,energy,base,bonus] of [
   ['Dragonair LA','Rising Lunge',['Water Energy SVE','Water Energy SVE','Water Energy SVE'],30,20],
   ['Gliscor LA2','Sharp Tail',['Water Energy SVE','Water Energy SVE'],30,40],
   ['Gligar LA','Jump On',['Fighting Energy SVE'],10,10],
   ['Leafeon MD2','Leaf Blade',['Grass Energy SVE','Water Energy SVE','Water Energy SVE'],50,20]
  ] as Array<[string,string,string[],number,number]>) for(const heads of [false,true]) it(label+name+' bonus '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game(name,energy,copied);g.player1.stadium.cards.push(new Bonus());attack(g,move,copied);expect(g.player2.active.damage).toBe(base+20+(heads?bonus:0));});
  for(const [name,move,energy,count,unit] of [
   ['Cubone LA','Bonemerang',['Fighting Energy SVE','Water Energy SVE'],2,20],['Dratini LA','Slam',['Water Energy SVE','Water Energy SVE'],2,20],
   ['Meowth LA','Fury Swipes',['Water Energy SVE','Water Energy SVE'],3,10],['Fearow MD','Fury Attack',['Water Energy SVE'],3,20],
   ['Kangaskhan MD','Comet Punch',['Water Energy SVE','Water Energy SVE','Water Energy SVE'],4,20],['Lickitung MD','Slam',['Water Energy SVE','Water Energy SVE'],2,20]
  ] as Array<[string,string,string[],number,number]>) for(let heads=0;heads<=count;heads++) it(label+name+' coin result '+heads,()=>{const g=game(name,energy,copied);g.player1.stadium.cards.push(new Bonus());let flips=0;(Math.random as jasmine.Spy).and.callFake(()=>flips++<heads?0.1:0.9);attack(g,move,copied);expect(g.player2.active.damage).toBe(heads?heads*unit+20:0);});
  for(let heads=0;heads<=2;heads++)it(label+'Metang Bullet Punch heads '+heads,()=>{const g=game('Metang LA2',['Metal Energy SVE','Water Energy SVE','Water Energy SVE'],copied);g.player1.stadium.cards.push(new Bonus());let flips=0;(Math.random as jasmine.Spy).and.callFake(()=>flips++<heads?0.1:0.9);attack(g,'Bullet Punch',copied);expect(g.player2.active.damage).toBe(60+heads*20);});
  for(const [name,move,energy,condition] of [
   ['Dragonair LA','Wrap',['Water Energy SVE','Water Energy SVE'],SpecialCondition.PARALYZED],
   ['Metang LA2','Psyshock',['Metal Energy SVE','Water Energy SVE'],SpecialCondition.PARALYZED],
   ['Chinchou LA','Supersonic',['Water Energy SVE'],SpecialCondition.CONFUSED],
   ['Drifloon LA','Mind Bend',['Psychic Energy SVE'],SpecialCondition.CONFUSED],
   ['Gligar LA2','Poison Sting',['Water Energy SVE'],SpecialCondition.POISONED],
   ['Ledyba LA','Supersonic',['Water Energy SVE'],SpecialCondition.CONFUSED],
   ['Numel LA','Singe',['Fire Energy SVE','Water Energy SVE','Water Energy SVE'],SpecialCondition.BURNED],
   ['Oddish LA2','Stun Spore',['Water Energy SVE'],SpecialCondition.PARALYZED],
   ['Poliwhirl LA','Bubblebeam',['Water Energy SVE','Water Energy SVE','Water Energy SVE'],SpecialCondition.PARALYZED]
  ] as Array<[string,string,string[],SpecialCondition]>) for(const heads of [false,true]) it(label+name+' condition '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game(name,energy,copied),events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof DealDamageEffect)events.push('damage');if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(condition))events.push('condition');return reduce(s,e)});attack(g,move,copied);expect(events.includes('condition')).toBe(heads);if(heads&&events.includes('damage'))expect(events.indexOf('condition')).toBeGreaterThan(events.indexOf('damage'));});
  it(label+'Gligar Poison Sting respects attack-effect prevention',()=>{const g=game('Gligar LA2',['Water Energy SVE'],copied);g.player2.active.preventEffectsOfAttacksNextTurn=true;let applied=false;const reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const out=reduce(s,e);if(e instanceof AddSpecialConditionsEffect&&!e.preventDefault)applied=true;return out;});attack(g,'Poison Sting',copied);expect(applied).toBe(false);});
  it(label+'Dragonair does not Paralyze a replacement defender',()=>{const g=game('Dragonair LA',['Water Energy SVE','Water Energy SVE'],copied);const target=g.player2.active;const replacement=g.player2.bench[0];const card=getCardByName('Squirtle BS');card.id=9001;replacement.cards.push(card);const reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const out=reduce(s,e);if(e instanceof DealDamageEffect&&e.target===target){g.player2.active=replacement;g.player2.bench[0]=target;}return out;});attack(g,'Wrap',copied);expect(replacement.specialConditions).not.toContain(SpecialCondition.PARALYZED);});
  for(const [name,move,energy] of [['Gliscor LA2','Poison Jab',['Fighting Energy SVE']],['Weepinbell LA','Poisonpowder',['Grass Energy SVE']]] as Array<[string,string,string[]]>)it(label+name+' inflicts Poison after damage',()=>{const g=game(name,energy,copied),events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof DealDamageEffect)events.push('damage');if(e instanceof AddSpecialConditionsEffect)events.push('condition');return reduce(s,e)});attack(g,move,copied);expect(events.indexOf('condition')).toBeGreaterThan(events.indexOf('damage'));});
  for(const heads of [false,true])it(label+'Gligar Light Poison single coin '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game('Gligar LA',[],copied);g.player1.stadium.cards.push(new Bonus());let poison=false,outgoing=0;const reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(SpecialCondition.POISONED))poison=true;const next=reduce(s,e);if(e instanceof DealDamageEffect&&e.target===g.player2.active)outgoing=e.damage;return next;});attack(g,'Light Poison',copied);expect(outgoing).toBe(heads?30:0);expect(poison).toBe(heads);expect(g.player2.active.damage).toBe(heads?40:0);});
  for(const heads of [false,true])it(label+'Poliwag Twiddle applies the coin-selected condition '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game('Poliwag LA',['Water Energy SVE'],copied);const seen:SpecialCondition[]=[];const reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof AddSpecialConditionsEffect)seen.push(...e.specialConditions);return reduce(s,e)});attack(g,'Twiddle',copied);expect(seen).toContain(heads?SpecialCondition.CONFUSED:SpecialCondition.ASLEEP);});
  it(label+'Ledyba recoil follows outgoing damage',()=>{const g=game('Ledyba LA',['Grass Energy SVE','Water Energy SVE'],copied),events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof DealDamageEffect)events.push(e.target===g.player1.active?'recoil':'damage');return reduce(s,e)});attack(g,'Double-edge',copied);expect(g.player2.active.damage).toBe(30);expect(g.player1.active.damage).toBe(10);expect(events.indexOf('recoil')).toBeGreaterThan(events.indexOf('damage'));});
  for(const [name,move,energy,heal] of [['Leafeon MD2','Spiral Drain',['Grass Energy SVE','Water Energy SVE'],10],['Oddish LA2','Blot',['Grass Energy SVE'],10]] as Array<[string,string,string[],number]>)it(label+name+' heals the attacker after damage',()=>{const g=game(name,energy,copied);g.player1.active.damage=30;attack(g,move,copied);expect(g.player1.active.damage).toBe(30-heal);});
  for(const [name,move,energy] of [['Beldum LA2','Allure',['Water Energy SVE']],['Lickitung MD','Lap Up',['Water Energy SVE']]] as Array<[string,string,string[]]>)it(label+name+' draws a card',()=>{const g=game(name,energy,copied);attack(g,move,copied);expect(g.player1.hand.cards.length).toBe(1);});
  for(const heads of [false,true])it(label+'Meowth Pay Day coin draw '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game('Meowth LA',['Water Energy SVE'],copied);attack(g,'Pay Day',copied);expect(g.player1.hand.cards.length).toBe(heads?1:0);expect(g.player2.active.damage).toBe(10);});
  for(const water of [false,true])it(label+'Chinchou Aqua Spark checks attached Water '+water,()=>{const g=game('Chinchou LA2',water?['Lightning Energy SVE','Water Energy SVE']:['Lightning Energy SVE','Fire Energy SVE'],copied);attack(g,'Aqua Spark',copied);expect(g.player2.active.damage).toBe(water?30:20);});
  for(const present of [false,true])it(label+'Nosepass checks own Benched Probopass '+present,()=>{const g=game('Nosepass LA',['Fighting Energy SVE','Water Energy SVE'],copied,present?['Probopass DRX']:[]);attack(g,'Nose Poke',copied);expect(g.player2.active.damage).toBe(present?40:20);});
  it(label+'Riolu Low Kick deals printed damage',()=>{const g=game('Riolu LA',['Fighting Energy SVE','Water Energy SVE'],copied);attack(g,'Low Kick',copied);expect(g.player2.active.damage).toBe(30);});
 }
 it('round trips all registered cards through a simulator snapshot',()=>{ensureClientCards();const state=new State();state.phase=GamePhase.PLAYER_TURN;state.turn=2;state.players=[new Player(),new Player()];const add=(list:CardList,name:string)=>{const c=CardManager.getInstance().getCardByName(name)!;expect(c).toBeDefined();c.id=state.cardNames.length;state.cardNames.push(c.fullName);list.cards.push(c);};state.players.forEach((p,index)=>{p.id=index+1;p.name=index?'Opponent':'Player';p.bench=Array.from({length:5},()=>new PokemonCardList());p.prizes=Array.from({length:6},()=>new CardList());p.prizes.forEach(x=>add(x,'Fire Energy SVE'));for(let j=0;j<9;j++)add(p.deck,'Fire Energy SVE');add(p.active,index?'Mew ex MEW':printed[0][0]);});printed.slice(1).forEach(([name])=>add(state.players[0].deck,name));const sim=new ClientSimulator();sim.loadSnapshot({stateData:new Base64().encode(new StateSerializer().serialize(state))});const out=sim.getStateData();const restored=new ClientSimulator();restored.loadSnapshot({stateData:out});for(const [name] of printed)expect(restored.state.cardNames).toContain(name);sim.cleanup();restored.cleanup();});
});
