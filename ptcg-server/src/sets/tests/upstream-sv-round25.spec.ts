import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';
import { CardType, SpecialCondition, Stage, TrainerType } from '../../game/store/card/card-types';
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

const printed = [["Articuno SV", "16", 100], ["Camerupt G SV", "19", 100], ["Lucario C SV", "31", 90], ["Medicham SV", "34", 90], ["Moltres SV", "36", 100], ["Zapdos SV", "48", 100], ["Altaria C SV", "49", 80], ["Arcanine SV", "50", 80], ["Bibarel SV", "51", 90], ["Cherrim SV", "55", 80], ["Drifblim SV", "57", 80], ["Floatzel SV", "58", 70], ["Hippopotas SV", "61", 70], ["Lopunny SV", "63", 80], ["Loudred SV", "64", 80], ["Roserade SV", "81", 80], ["Staravia SV", "85", 70], ["Togekiss C SV", "86", 70], ["Buneary SV", "94", 50], ["Chatot SV", "95", 60], ["Feebas SV", "104", 30], ["Goldeen SV", "107", 50], ["Mudkip SV", "116", 60], ["Pachirisu SV", "118", 60], ["Paras SV", "119", 50], ["Rhyhorn SV", "122", 70], ["Roselia SV", "123", 60], ["Skorupi SV", "128", 50], ["Whismur SV", "132", 60], ["Zubat SV", "133", 50]] as Array<[string,string,number]>;
const water='Water Energy SVE',grass='Grass Energy SVE',psychic='Psychic Energy SVE',lightning='Lightning Energy SVE',fighting='Fighting Energy SVE',fire='Fire Energy SVE';
class Bonus extends TrainerCard {public name='Bonus';public fullName='Bonus TST';public set='TST';public trainerType=TrainerType.STADIUM;public reduceEffect(_s:StoreLike,state:State,e:Effect):State{if(e instanceof AttackEffect)e.damage+=20;return state;}}
function game(name:string,energy:string[],copied=false){
 const g=setupGame({turn:2,player1:{active:{card:copied?'Mew ex 30C':name,energy},bench:copied?[{card:name}]:[],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},bench:[{card:'Squirtle BS'}],deck:padDeck(12)}});
 const target=g.player2.active.getPokemonCard()!;target.weakness=[];target.resistance=[];target.hp=1000;g.player2.bench[0].getPokemonCard()!.hp=1000;return g;
}
function attack(g:ReturnType<typeof game>,name:string,copied=false){if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:name}));useAbility(g.store,g.state,0,'Memory Helix');}else useAttack(g.store,g.state,0,name);}
describe('Supreme Victors round 25 batch',()=>{
 beforeEach(()=>spyOn(Math,'random').and.returnValue(0.1));
 for(const [name,num,hp] of printed)it('registers printed identity '+name,()=>{const card:any=getCardByName(name);expect(card.setNumber).toBe(num);expect(card.hp).toBe(hp);});
 for(const copied of [false,true]){ const label=copied?'copied ':'direct ';
  for(const [name,move,energy,damage] of [
   ['Drifblim SV','Ram',[water,water],20],['Drifblim SV','Gust',[water,water,water],40],
   ['Lucario C SV','Metal Claw',[water],20],['Roserade SV','Cut',[grass],20],
   ['Pachirisu SV','Tail Slap',[water],10],['Rhyhorn SV','Horn Drill',[fighting,fighting,water],50],
   ['Whismur SV','Rollout',[water,water],20]
  ] as Array<[string,string,string[],number]>)it(label+name+' deals printed damage for '+move,()=>{const g=game(name,energy,copied);attack(g,move,copied);expect(g.player2.active.damage).toBe(damage);});
  for(const [name,move,energy,base,bonus] of [
   ['Articuno SV','Sharp Beak',[water,water,water],30,10],['Lucario C SV','Mid-air Strike',[fighting,water,water],30,30],
   ['Zapdos SV','Lightning Wing',[lightning,lightning,water,water],50,20],['Floatzel SV','Jet Screw',[water,water,water],30,10],
   ['Pachirisu SV','Pachi',[lightning],10,10],['Paras SV','Stomp',[grass],10,10],['Rhyhorn SV','Stomp',[water,water],10,20]
  ] as Array<[string,string,string[],number,number]>)for(const heads of [false,true])it(label+name+' coin damage '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game(name,energy,copied);g.player1.stadium.cards.push(new Bonus());attack(g,move,copied);expect(g.player2.active.damage).toBe(base+20+(heads?bonus:0));});
  for(const [name,move,energy,count,unit] of [
   ['Bibarel SV','Tail Rap',[water,water,water],2,30],['Cherrim SV','Petal Dance',[grass],3,30],
   ['Hippopotas SV','Double Headbutt',[water,water],2,10],['Staravia SV','Double Peck',[water,water],2,20],
   ['Goldeen SV','Fury Attack',[water],3,10],['Zubat SV','Quick Turn',[water],2,10]
  ] as Array<[string,string,string[],number,number]>)for(let heads=0;heads<=count;heads++)it(label+name+' damage with '+heads+' heads',()=>{const g=game(name,energy,copied);g.player1.stadium.cards.push(new Bonus());let flips=0;(Math.random as jasmine.Spy).and.callFake(()=>flips++<heads?0.1:0.9);attack(g,move,copied);expect(g.player2.active.damage).toBe(heads?heads*unit+20:0);});
  for(const [name,move,energy,damage] of [['Moltres SV','Sky Attack',[fire,fire,water,water],80],['Feebas SV','Surprise Attack',[],20],['Skorupi SV','Tail Smash',[psychic,water,water],40]] as Array<[string,string,string[],number]>)for(const heads of [false,true])it(label+name+' coin gate '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game(name,energy,copied);g.player1.stadium.cards.push(new Bonus());attack(g,move,copied);expect(g.player2.active.damage).toBe(heads?damage+20:0);});
  for(const [name,move,energy,condition,coin] of [
   ['Articuno SV','Ice Beam',[water,water,water,water],SpecialCondition.PARALYZED,true],
   ['Camerupt G SV','Searing Flame',[fire,water],SpecialCondition.BURNED,false],
   ['Altaria C SV','Sing',[water,water],SpecialCondition.ASLEEP,false],
   ['Lopunny SV','Ice Beam',[water,water],SpecialCondition.PARALYZED,true],
   ['Roserade SV','Poison Seed',[grass,water,water],SpecialCondition.POISONED,false],
   ['Roselia SV','Spit Poison',[grass,water],SpecialCondition.POISONED,true],
   ['Skorupi SV','Poison Sting',[psychic,water],SpecialCondition.POISONED,true],
   ['Whismur SV','Tone-Deaf',[water],SpecialCondition.CONFUSED,true],
   ['Paras SV','Spore',[water],SpecialCondition.ASLEEP,false]
  ] as Array<[string,string,string[],SpecialCondition,boolean]>)for(const heads of coin?[false,true]:[true])it(label+name+' condition '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game(name,energy,copied);let applied=false;const reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const result=reduce(s,e);if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(condition)&&!e.preventDefault)applied=true;return result;});attack(g,move,copied);expect(applied).toBe(heads);});
  it(label+'Cherrim confuses its own Active after Petal Dance',()=>{const g=game('Cherrim SV',[grass],copied);let applied=false;const reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const result=reduce(s,e);if(e instanceof AddSpecialConditionsEffect&&e.target===g.player1.active&&e.specialConditions.includes(SpecialCondition.CONFUSED))applied=true;return result;});attack(g,'Petal Dance',copied);expect(applied).toBe(true);});
  it(label+'Altaria ignores defending Resistance',()=>{const g=game('Altaria C SV',[water,water],copied);g.player2.active.getPokemonCard()!.resistance=[{type:CardType.COLORLESS,value:-20}];attack(g,'Sonic Wing',copied);expect(g.player2.active.damage).toBe(30);});
  for(const damage of [0,10,30])it(label+'Goldeen Flail counts attacker damage '+damage,()=>{const g=game('Goldeen SV',[water],copied);g.player1.active.damage=damage;g.player1.stadium.cards.push(new Bonus());attack(g,'Flail',copied);expect(g.player2.active.damage).toBe(damage?damage+20:0);});
  it(label+'Medicham counts opposing hand before damage',()=>{const g=game('Medicham SV',[psychic,water,water],copied);g.player2.hand.cards.push(getCardByName(water),getCardByName(grass));attack(g,'Chakra Points',copied);expect(g.player2.active.damage).toBe(30);});
  it(label+'Medicham makes opponent draw after damage',()=>{const g=game('Medicham SV',[psychic,water],copied);attack(g,'Channeling',copied);expect(g.player2.hand.cards.length).toBe(3);expect(g.player2.deck.cards.length).toBe(9);});
  it(label+'Feebas draws for unevolved opponents',()=>{const g=game('Feebas SV',[water],copied);g.player2.bench[1].cards.push(getCardByName('Wartortle BS'));attack(g,'Count and Draw',copied);expect(g.player1.hand.cards.length).toBe(2);});
  it(label+'Feebas includes Restored and Basic LV.X but excludes evolved LV.X',()=>{
    const g=game('Feebas SV',[water],copied), basic=g.player2.active.getPokemonCard()!;
    const restored=getCardByName('Squirtle BS') as any;restored.id=9950;restored.stage=Stage.RESTORED;g.player2.bench[1].cards.push(restored);
    const basicLvlX=getCardByName('Squirtle BS') as any;basicLvlX.id=9951;basicLvlX.stage=Stage.LV_X;g.player2.active.cards.push(basicLvlX);
    const evolved=getCardByName('Wartortle BS') as any;evolved.id=9952;const evolvedLvlX=getCardByName('Squirtle BS') as any;evolvedLvlX.id=9953;evolvedLvlX.stage=Stage.LV_X;g.player2.bench[2].cards.push(evolved,evolvedLvlX);
    attack(g,'Count and Draw',copied);expect(g.player1.hand.cards.length).toBe(3);expect(basic.stage).toBe(Stage.BASIC);
  });
  for(const opposing of [0,1,2])it(label+'Mudkip compares attached Energy '+opposing,()=>{const g=game('Mudkip SV',[water],copied);for(let i=0;i<opposing;i++){const c=getCardByName(water);c.id=9200+i;g.player2.active.cards.push(c);}attack(g,'Mud Sport',copied);expect(g.player2.active.damage).toBe(opposing>1?20:10);});
  it(label+'Mudkip counts a double-providing Energy as two units',()=>{
    const g=game('Mudkip SV',[water],copied);const energy=getCardByName('Double Colorless Energy BS');energy.id=9970;g.player2.active.cards.push(energy);
    attack(g,'Mud Sport',copied);expect(g.player2.active.damage).toBe(20);
  });
  for(const [name,move] of [['Togekiss C SV','Reckless Charge'],['Chatot SV','Nosedive']])for(const heads of [false,true])it(label+name+' recoil semantics '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game(name,[water,water],copied),events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof DealDamageEffect)events.push(e.target===g.player1.active?'recoil':'damage');return reduce(s,e);});attack(g,move,copied);const recoil=name==='Togekiss C SV'||!heads;expect(g.player1.active.damage).toBe(recoil?10:0);if(recoil)expect(events.indexOf('recoil')).toBeGreaterThan(events.indexOf('damage'));});
  it(label+'Togekiss Collect draws one',()=>{const g=game('Togekiss C SV',[],copied);attack(g,'Collect',copied);expect(g.player1.hand.cards.length).toBe(1);});
  it(label+'Buneary Bounce switches its original attacker',()=>{const g=game('Buneary SV',[water],copied),old=g.player1.active;if(!copied){const c=getCardByName('Charmander BS');c.id=9910;g.player1.bench[0].cards.push(c);}attack(g,'Bounce',copied);expect(g.player1.active).not.toBe(old);});
  it(label+'Buneary Mini Drain heals its attacker',()=>{const g=game('Buneary SV',[water,water],copied);g.player1.active.damage=30;attack(g,'Mini Drain',copied);expect(g.player1.active.damage).toBe(20);});
  it(label+'Arcanine Overrun damages one opposing Bench',()=>{const g=game('Arcanine SV',[water,water],copied);g.overridePrompt('Choose pokemon',()=>[{player:PlayerType.TOP_PLAYER,slot:SlotType.BENCH,index:0}]);attack(g,'Overrun',copied);expect(g.player2.active.damage).toBe(20);expect(g.player2.bench[0].damage).toBe(10);});
  it(label+'Camerupt spreads damage based on two coin flips',()=>{const g=game('Camerupt G SV',[water,water,water,water],copied);attack(g,'Earth Power',copied);expect(g.player2.active.damage).toBe(60);expect(g.player2.bench[0].damage).toBe(20);});
  it(label+'Camerupt respects Bench attack protection',()=>{const g=game('Camerupt G SV',[water,water,water,water],copied);const c=getCardByName('Manaphy BRS');c.id=9101;g.player2.bench[1].cards.push(c);attack(g,'Earth Power',copied);expect(g.player2.active.damage).toBe(60);expect(g.player2.bench[0].damage).toBe(0);});
  it(label+'Loudred discards top card after damage',()=>{const g=game('Loudred SV',[water,water,water],copied);attack(g,'Stomp Off',copied);expect(g.player2.deck.cards.length).toBe(10);expect(g.player2.hand.cards.length).toBe(1);expect(g.player2.discard.cards.length).toBe(1);});
  it(label+'Chatot searches a Basic onto Bench',()=>{const g=game('Chatot SV',[water],copied);const c=getCardByName('Charmander BS');c.id=9011;g.player1.deck.cards.unshift(c);g.overridePrompt('Choose cards',(p:any)=>[p.cards.cards.indexOf(c)]);attack(g,'Call for Family',copied);expect(g.player1.bench.some(slot=>slot.cards.includes(c))).toBe(true);});
 }
 it('normalizes every external numbered print to its unique legacy identity',()=>{
   ensureClientCards();
   for(const [name, number] of printed){
     const card=CardManager.getInstance().getCardByName(name)!;
     expect(StateSerializer.normalizeCardName(card.name+' SV '+number)).toBe(name);
   }
 });
 it('round trips all new cards in a stable snapshot',()=>{ensureClientCards();const state=new State();state.phase=GamePhase.PLAYER_TURN;state.turn=2;state.players=[new Player(),new Player()];const add=(list:CardList,name:string)=>{const c=CardManager.getInstance().getCardByName(name)!;expect(c).toBeDefined();c.id=state.cardNames.length;state.cardNames.push(c.fullName);list.cards.push(c);};state.players.forEach((p,i)=>{p.id=i+1;p.name=i?'Opponent':'Player';p.bench=Array.from({length:5},()=>new PokemonCardList());p.prizes=Array.from({length:6},()=>new CardList());p.prizes.forEach(x=>add(x,'Fire Energy SVE'));for(let j=0;j<9;j++)add(p.deck,'Fire Energy SVE');add(p.active,i?'Mew ex MEW':printed[0][0]);});printed.slice(1).forEach(([name])=>add(state.players[0].deck,name));const sim=new ClientSimulator();sim.loadSnapshot({stateData:new Base64().encode(new StateSerializer().serialize(state))});const restored=new ClientSimulator();restored.loadSnapshot({stateData:sim.getStateData()});for(const [name] of printed)expect(restored.state.cardNames).toContain(name);sim.cleanup();restored.cleanup();});
});
