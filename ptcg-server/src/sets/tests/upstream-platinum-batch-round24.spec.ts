import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';
import { CardType, SpecialCondition, TrainerType, SuperType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { AddSpecialConditionsEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { State, GamePhase } from '../../game/store/state/state';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { ClientSimulator } from '../../client/simulator';
import { ensureClientCards } from '../../client/cards';
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Base64 } from '../../utils/base64';
import { Player } from '../../game/store/state/player';
import { CardList } from '../../game/store/state/card-list';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ChoosePokemonPromptType } from '../../game/store/prompts/choose-pokemon-prompt';

const identities = [
 ['Shaymin PL','14'],['Kricketune PL','32'],['Shaymin PL3','38'],['Torterra PL','39'],['Combusken PL','45'],
 ['Cranidos PL','46'],['Grotle PL','49'],['Prinplup PL','59'],['Seviper PL','61'],['Vigoroth PL','64'],
 ['Carnivine PL2','68'],['Chansey PL','69'],['Chimchar PL','70'],['Combee PL','71'],['Electrike PL','74'],
 ['Grimer PL','75'],['Kricketot PL','78'],['Lapras PL','79'],['Misdreavus PL','83'],['Nosepass PL','84'],
 ['Piplup PL','85'],['Poochyena PL','86'],['Remoraid PL','90'],['Riolu PL','91'],
 ['Squirtle PL','96'],['Swablu PL','97'],['Tauros PL','98'],['Turtwig PL','101'],['Wurmple PL','103'],['Life Herb PL','108']
] as const;
class Bonus extends TrainerCard { public name='Bonus';public fullName='Bonus TST';public set='TST';public trainerType=TrainerType.STADIUM;public reduceEffect(_s:StoreLike,state:State,e:Effect):State{if(e instanceof AttackEffect)e.damage+=20;return state;} }
function game(name:string,energy:string[],copied=false,ownBench:string[]=[],otherBench:string[]=[]) {
 getCardByName('Poke Turn PL');
 const g=setupGame({turn:2,player1:{active:{card:copied?'Mew ex 30C':name,energy},bench:copied?[{card:name},...ownBench.map(card=>({card}))]:ownBench.map(card=>({card})),deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},bench:otherBench.map(card=>({card})),deck:padDeck(12)}});
 g.player2.active.getPokemonCard()!.weakness=[];g.player2.active.getPokemonCard()!.resistance=[];return g;
}
function attack(g:ReturnType<typeof game>,move:string,copied=false) {if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:move}));useAbility(g.store,g.state,0,'Memory Helix');}else useAttack(g.store,g.state,0,move);}

describe('Platinum historical grouped batch round 24',()=>{
 beforeEach(()=>{getCardByName('Poke Turn PL');spyOn(Math,'random').and.returnValue(0.1);});
 for(const [name,number] of identities)it('registers '+name+' at printed number',()=>expect(getCardByName(name).setNumber).toBe(number));
 for(const copied of [false,true]) {
  const label=copied?'copied ':'direct ';
  for(const [name,move,energy,base,bonus] of [
   ['Combusken PL','Firebreathing',['Fire Energy SVE','Water Energy SVE'],20,20],
   ['Cranidos PL','Rock Smash',['Fighting Energy SVE'],20,20],
   ['Riolu PL','Steady Punch',['Water Energy SVE','Water Energy SVE'],20,10]
  ] as Array<[string,string,string[],number,number]>)for(const heads of [false,true])it(label+name+' preserves additive coin damage '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game(name,energy,copied);g.player1.stadium.cards.push(new Bonus());attack(g,move,copied);expect(g.player2.active.damage).toBe(base+20+(heads?bonus:0));});
  for(let heads=0;heads<=2;heads++)it(label+'Remoraid multiplies coin heads '+heads,()=>{const g=game('Remoraid PL',['Water Energy SVE','Water Energy SVE'],copied);g.player1.stadium.cards.push(new Bonus());let flips=0;(Math.random as jasmine.Spy).and.callFake(()=>flips++<heads?0.1:0.9);attack(g,'Trickle',copied);expect(g.player2.active.damage).toBe(heads?heads*20+20:0);});
  for(const [name,move,energy,condition,coin] of [
   ['Prinplup PL','Bubblebeam',['Water Energy SVE','Water Energy SVE','Water Energy SVE'],SpecialCondition.PARALYZED,true],
   ['Carnivine PL2','Poison Breath',[],SpecialCondition.POISONED,true],
   ['Electrike PL','Thunder Fang',['Lightning Energy SVE','Water Energy SVE'],SpecialCondition.PARALYZED,true],
   ['Lapras PL','Ice Beam',['Water Energy SVE','Water Energy SVE','Water Energy SVE'],SpecialCondition.PARALYZED,true],
   ['Turtwig PL','Body Slam',['Grass Energy SVE','Water Energy SVE'],SpecialCondition.PARALYZED,true],
   ['Wurmple PL','Poison Sting',['Grass Energy SVE','Water Energy SVE'],SpecialCondition.POISONED,true],
   ['Grimer PL','Poison Gas',['Psychic Energy SVE'],SpecialCondition.POISONED,false],
   ['Kricketot PL','Lullaby',['Grass Energy SVE'],SpecialCondition.ASLEEP,false],
   ['Swablu PL','Sing',['Water Energy SVE'],SpecialCondition.ASLEEP,false],
   ['Torterra PL','Soothing Scent',['Grass Energy SVE','Grass Energy SVE','Water Energy SVE','Water Energy SVE'],SpecialCondition.ASLEEP,false]
  ] as Array<[string,string,string[],SpecialCondition,boolean]>)for(const heads of coin?[false,true]:[true])it(label+name+' condition '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game(name,energy,copied);let applied=false;const reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(condition))applied=true;return reduce(s,e);});attack(g,move,copied);expect(applied).toBe(heads);});
  for(const [name,move,energy,amount] of [['Grotle PL','Absorb',['Grass Energy SVE','Water Energy SVE'],10],['Seviper PL','Shed Skin',[],40],['Shaymin PL','Flower Aroma',['Grass Energy SVE'],20]] as Array<[string,string,string[],number]>)it(label+name+' heals its physical attacker',()=>{const g=game(name,energy,copied);g.player1.active.damage=50;attack(g,move,copied);expect(g.player1.active.damage).toBe(50-amount);});
  for(const [name,move] of [['Vigoroth PL','Reckless Charge'],['Tauros PL','Take Down']])for(const heads of [false,true])it(label+name+' recoil on tails '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game(name,['Water Energy SVE'],copied),events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof DealDamageEffect)events.push(e.target===g.player1.active?'recoil':'damage');return reduce(s,e);});attack(g,move,copied);expect(g.player1.active.damage).toBe(heads?0:10);if(!heads)expect(events.indexOf('recoil')).toBeGreaterThan(events.indexOf('damage'));});
  for(const name of ['Vigoroth PL','Tauros PL'])it(label+name+' does not recoil against replacement attacker',()=>{(Math.random as jasmine.Spy).and.returnValue(0.9);const g=game(name,['Water Energy SVE'],copied,['Charmander BS']);const source=g.player1.active,replacement=g.player1.bench[copied?1:0],reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const out=reduce(s,e);if(e instanceof DealDamageEffect&&e.target===g.player2.active){g.player1.active=replacement;g.player1.bench[copied?1:0]=source;source.cards=[];}return out;});attack(g,name==='Vigoroth PL'?'Reckless Charge':'Take Down',copied);expect(replacement.damage).toBe(0);});
  for(const heads of [false,true])it(label+'Poochyena Lunge coin '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game('Poochyena PL',['Darkness Energy SVE'],copied);g.player1.stadium.cards.push(new Bonus());attack(g,'Lunge',copied);expect(g.player2.active.damage).toBe(heads?40:0);});
  it(label+'Combee Collect draws a card',()=>{const g=game('Combee PL',[],copied);attack(g,'Collect',copied);expect(g.player1.hand.cards.length).toBe(1);});
  it(label+'Carnivine heals each own Benched Pokémon',()=>{const g=game('Carnivine PL2',['Grass Energy SVE','Water Energy SVE'],copied,['Charmander BS']);const ally=g.player1.bench[copied?1:0];ally.damage=30;attack(g,'Sweet Saliva',copied);expect(ally.damage).toBe(20);});
  for(const [name,move,energy] of [['Combee PL','Shoot Through',['Water Energy SVE','Water Energy SVE']],['Piplup PL','Muddy Water',['Water Energy SVE']]] as Array<[string,string,string[]]>)for(const protect of [false,true])it(label+name+' Bench damage respects prevention '+protect,()=>{const g=game(name,energy,copied,[],protect?['Piplup DP','Manaphy BRS']:['Piplup DP']);g.overridePrompt(ChoosePokemonPromptType,()=>[{player:PlayerType.TOP_PLAYER,slot:SlotType.BENCH,index:0}]);attack(g,move,copied);expect(g.player2.bench[0].damage).toBe(protect?0:10);});
  for(const name of ['Swablu PL','Seviper PL'])for(const yes of [false,true])it(label+name+' voluntary switch '+yes,()=>{const g=game(name,name==='Swablu PL'?['Water Energy SVE']:['Psychic Energy SVE'],copied,['Charmander BS']);const source=g.player1.active,bench=g.player1.bench[copied?1:0];g.overridePrompt('Confirm',()=>yes);g.overridePrompt(ChoosePokemonPromptType,()=>[{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:copied?1:0}]);attack(g,name==='Swablu PL'?'Run Around':'Bite and Escape',copied);expect(g.player1.active).toBe(yes?bench:source);});
  for(const [name,move] of [['Electrike PL','Roar'],['Nosepass PL','Pull']])it(label+name+' switches the correct opposing Pokémon',()=>{const g=game(name,['Water Energy SVE'],copied,[],['Charmander BS']);const before=g.player2.active,replacement=g.player2.bench[0];g.overridePrompt(ChoosePokemonPromptType,(prompt)=>{const roar=name==='Electrike PL';expect(prompt.playerId).toBe(roar?g.player2.id:g.player1.id);return [{player:roar?PlayerType.BOTTOM_PLAYER:PlayerType.TOP_PLAYER,slot:SlotType.BENCH,index:0}];});attack(g,move,copied);expect(g.player2.active).toBe(replacement);expect(g.player2.bench[0]).toBe(before);});
  for(const heads of [false,true])it(label+'Chansey Healing Trial heals the coin-selected original '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game('Chansey PL',['Water Energy SVE'],copied);g.player1.active.damage=40;g.player2.active.damage=40;attack(g,'Healing Trial',copied);expect(g.player1.active.damage).toBe(heads?10:40);expect(g.player2.active.damage).toBe(heads?40:10);});
  it(label+'Chansey does not heal a defender that switched to the Bench',()=>{(Math.random as jasmine.Spy).and.returnValue(0.9);const g=game('Chansey PL',['Water Energy SVE'],copied,[],['Charmander BS']);const target=g.player2.active,replacement=g.player2.bench[0],original=g.store.reduceEffect.bind(g.store);target.damage=40;let switched=false;spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(!switched && e instanceof CoinFlipEffect){switched=true;g.player2.active=replacement;g.player2.bench[0]=target;}return original(s,e);});attack(g,'Healing Trial',copied);expect(switched).toBe(true);expect(target.damage).toBe(40);expect(replacement.damage).toBe(0);});
  for(const count of [0,2])it(label+'Kricketune Revenge Melody counts both named discard cards '+count,()=>{const g=game('Kricketune PL',['Water Energy SVE','Water Energy SVE'],copied);if(count){const one=getCardByName('Kricketot PL'),two=getCardByName('Kricketune PL');one.id=8101;two.id=8102;g.player1.discard.cards.push(one,two);}g.player1.stadium.cards.push(new Bonus());attack(g,'Revenge Melody',copied);expect(g.player2.active.damage).toBe(count?60:0);});
  for(const asleep of [false,true])it(label+'Kricketune Bug Buzz removes Asleep after bonus damage '+asleep,()=>{const g=game('Kricketune PL',['Grass Energy SVE','Grass Energy SVE'],copied);if(asleep)g.player2.active.specialConditions=[SpecialCondition.ASLEEP];attack(g,'Bug Buzz',copied);expect(g.player2.active.damage).toBe(asleep?80:50);expect(g.player2.active.specialConditions).not.toContain(SpecialCondition.ASLEEP);});
  for(const heads of [false,true])it(label+'Seviper inflicts Poison and optional Paralysis '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game('Seviper PL',['Psychic Energy SVE','Water Energy SVE','Water Energy SVE'],copied);const seen:SpecialCondition[]=[];const reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof AddSpecialConditionsEffect)seen.push(...e.specialConditions);return reduce(s,e);});attack(g,'Paralyze Poison',copied);expect(seen).toContain(SpecialCondition.POISONED);expect(seen.includes(SpecialCondition.PARALYZED)).toBe(heads);});
  for(const yes of [false,true])it(label+'Cranidos may discard the Stadium '+yes,()=>{const g=game('Cranidos PL',['Fighting Energy SVE','Water Energy SVE'],copied);const stadium=new Bonus();stadium.id=8103;g.player1.stadium.cards.push(stadium);g.overridePrompt('Confirm',()=>yes);attack(g,'Knock Over',copied);expect(g.player2.active.damage).toBe(60);expect(g.player1.discard.cards.includes(stadium)).toBe(yes);expect(g.player1.stadium.cards.includes(stadium)).toBe(!yes);});
  for(const damage of [0,10])it(label+'Vigoroth Fight Back tests current attacker damage '+damage,()=>{const g=game('Vigoroth PL',['Water Energy SVE','Water Energy SVE','Water Energy SVE'],copied);g.player1.active.damage=damage;attack(g,'Fight Back',copied);expect(g.player2.active.damage).toBe(damage?70:50);});
  it(label+'Shaymin Energy Blow counts attached double Energy',()=>{const g=game('Shaymin PL3',['Double Colorless Energy BS'],copied);attack(g,'Energy Blow',copied);expect(g.player2.active.damage).toBe(30);});
  it(label+'Shaymin Aromatherapy heals the whole team',()=>{const g=game('Shaymin PL3',['Grass Energy SVE','Water Energy SVE','Water Energy SVE'],copied,['Charmander BS']);const ally=g.player1.bench[copied?1:0];g.player1.active.damage=30;ally.damage=30;attack(g,'Aromatherapy',copied);expect(g.player1.active.damage).toBe(10);expect(ally.damage).toBe(10);});
  for(const count of [0,1,2])it(label+'Lapras Grind counts attached Energy '+count,()=>{
    const g=game('Lapras PL',['Water Energy SVE'],copied);
    if(count===0){
      const active=g.player1.active;
      active.cards=active.cards.filter(card=>card.superType!==SuperType.ENERGY);
      active.energies.cards=active.energies.cards.filter(card=>card.superType!==SuperType.ENERGY);
      const check=new CheckProvidedEnergyEffect(g.player1,active);g.store.reduceEffect(g.state,check);
      expect(check.energyMap.length).toBe(0);
      const reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const next=reduce(s,e);if(e instanceof CheckAttackCostEffect && e.attack.name==='Grind')e.cost=[];return next;});
    }
    if(count===2){const extra=getCardByName('Water Energy SVE');extra.id=8001;g.player1.active.cards.push(extra);g.player1.active.energies.cards.push(extra);}
    g.player1.stadium.cards.push(new Bonus());attack(g,'Grind',copied);expect(g.player2.active.damage).toBe(count?count*10+20:0);
  });
  it(label+'Torterra Green Blast counts Grass Energy on the whole team',()=>{const g=game('Torterra PL',['Grass Energy SVE','Water Energy SVE','Water Energy SVE'],copied,['Charmander BS']);const ally=g.player1.bench[copied?1:0],extra=getCardByName('Grass Energy SVE');extra.id=8002;ally.cards.push(extra);attack(g,'Green Blast',copied);expect(g.player2.active.damage).toBe(60);});
  it(label+'Torterra counts Rainbow and blend Energy as Grass on the Bench',()=>{const g=game('Torterra PL',['Grass Energy SVE','Water Energy SVE','Water Energy SVE'],copied,['Charmander BS']);const ally=g.player1.bench[copied?1:0],rainbow=getCardByName('Rainbow Energy SUM'),unit=getCardByName('Unit Energy GrassFireWater UPR');rainbow.id=8201;unit.id=8202;ally.cards.push(rainbow,unit);attack(g,'Green Blast',copied);expect(g.player2.active.damage).toBe(70);});
  it(label+'Shaymin Damage Aid clears original defender conditions after damage',()=>{const g=game('Shaymin PL',['Grass Energy SVE','Water Energy SVE'],copied);g.player2.active.specialConditions=[SpecialCondition.POISONED];attack(g,'Damage Aid',copied);expect(g.player2.active.damage).toBe(80);expect(g.player2.active.specialConditions).not.toContain(SpecialCondition.POISONED);});
  for(const damaged of [false,true])it(label+'Chansey Pulled Punch preserves modifiers '+damaged,()=>{const g=game('Chansey PL',['Water Energy SVE','Water Energy SVE'],copied);if(damaged)g.player2.active.damage=10;g.player1.stadium.cards.push(new Bonus());attack(g,'Pulled Punch',copied);expect(g.player2.active.damage).toBe(damaged?40:60);});
 }
 it('round trips all newly registered Platinum cards through simulator snapshots',()=>{ensureClientCards();const state=new State();state.phase=GamePhase.PLAYER_TURN;state.turn=2;state.players=[new Player(),new Player()];const add=(list:CardList,name:string)=>{const c=CardManager.getInstance().getCardByName(name)!;expect(c).toBeDefined();c.id=state.cardNames.length;state.cardNames.push(c.fullName);list.cards.push(c);};state.players.forEach((p,index)=>{p.id=index+1;p.name=index?'Opponent':'Player';p.bench=Array.from({length:5},()=>new PokemonCardList());p.prizes=Array.from({length:6},()=>new CardList());p.prizes.forEach(x=>add(x,'Fire Energy SVE'));for(let j=0;j<9;j++)add(p.deck,'Fire Energy SVE');add(p.active,index?'Mew ex MEW':'Shaymin PL');});identities.slice(1).forEach(([name])=>add(state.players[0].deck,name));const sim=new ClientSimulator();sim.loadSnapshot({stateData:new Base64().encode(new StateSerializer().serialize(state))});const out=sim.getStateData();const restored=new ClientSimulator();restored.loadSnapshot({stateData:out});for(const [name] of identities)expect(restored.state.cardNames).toContain(name);sim.cleanup();restored.cleanup();});

});
