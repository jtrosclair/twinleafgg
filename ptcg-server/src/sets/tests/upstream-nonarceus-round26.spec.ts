import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { CardList } from '../../game/store/state/card-list';
import { Player } from '../../game/store/state/player';
import { GamePhase } from '../../game/store/state/state';
import { Base64 } from '../../utils/base64';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { CardManager } from '../../game/cards/card-manager';
import { ClientSimulator } from '../../client/simulator';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';
import { ensureClientCards } from '../../client/cards';
import { CardType, CardTag, SpecialCondition, TrainerType } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { RetreatStartEffect } from '../../game/store/effects/game-effects';
import { ATTACK_RETREAT_LOCK_UNTIL_TARGET_END_TURN as LOCK } from '../../game/store/prefabs/retreat-lock-until-target-end-turn';

const printed: Array<[string,string,number,CardType,any[],any[],number]> = [
  ["Inkay LOR 77", "77", 60, CardType.PSYCHIC, [{ type: CardType.DARK }], [{ type: CardType.FIGHTING, value: -30 }], 1],
  ["Tandemaus PAL", "166", 30, CardType.COLORLESS, [{ type: CardType.FIGHTING }], [], 1],
  ["Floragato SVI", "14", 90, CardType.GRASS, [{ type: CardType.FIRE }], [], 1],
  ["Sprigatito SVI", "13", 70, CardType.GRASS, [{ type: CardType.FIRE }], [], 1],
  ["Tandemaus SSP", "157", 40, CardType.COLORLESS, [{ type: CardType.FIGHTING }], [], 1],
  ["Houndour LA", "103", 50, CardType.DARK, [{ type: CardType.WATER, value: +10 }], [{ type: CardType.PSYCHIC, value: -20 }], 1],
  ["Poochyena LA", "116", 50, CardType.DARK, [{ type: CardType.FIGHTING, value: +10 }], [{ type: CardType.PSYCHIC, value: -20 }], 1],
  ["Nincada LA", "108", 40, CardType.GRASS, [{ type: CardType.FIRE, value: +10 }], [], 1],
  ["Drapion E4 RR", "17", 100, CardType.DARK, [{ type: CardType.FIGHTING }], [{ type: CardType.PSYCHIC, value: -20 }], 3],
  ["Spheal RR", "82", 60, CardType.WATER, [{ type: CardType.METAL, value: +10 }], [], 2],
  ["Hippopotas RR", "64", 70, CardType.FIGHTING, [{ type: CardType.WATER, value: +10 }], [{ type: CardType.LIGHTNING, value: -20 }], 2],
  ["Surfing Pikachu RR", "114", 50, CardType.LIGHTNING, [{ type: CardType.FIGHTING }], [], 1],
  ["Bastiodon GL RR", "2", 90, CardType.METAL, [{ type: CardType.FIRE }], [{ type: CardType.PSYCHIC, value: -20 }], 3],
  ["Houndoom E4 RR", "65", 80, CardType.DARK, [{ type: CardType.FIGHTING }], [{ type: CardType.PSYCHIC, value: -20 }], 1],
  ["Grovyle SF", "39", 80, CardType.GRASS, [{ type: CardType.FIRE, value: +20 }], [{ type: CardType.WATER, value: -20 }], 1],
  ["Duskull SF3", "60", 50, CardType.PSYCHIC, [{ type: CardType.DARK, value: +10 }], [{ type: CardType.COLORLESS, value: -20 }], 1],
  ["Cherubi SF", "56", 50, CardType.GRASS, [{ type: CardType.FIRE, value: +10 }], [{ type: CardType.WATER, value: -20 }], 1],
  ["Shelgon SF", "50", 90, CardType.COLORLESS, [{ type: CardType.COLORLESS, value: +20 }], [{ type: CardType.FIGHTING, value: -20 }], 2],
  ["Stunky SF", "76", 60, CardType.DARK, [{ type: CardType.FIGHTING, value: +10 }], [{ type: CardType.PSYCHIC, value: -20 }], 1],
  ["Crobat UL2", "14", 110, CardType.PSYCHIC, [{ type: CardType.LIGHTNING }], [{ type: CardType.FIGHTING, value: -20 }], 0],
  ["Stufful MEG", "111", 70, CardType.COLORLESS, [{ type: CardType.FIGHTING }], [], 2],
  ["Tinkatink MEG", "96", 70, CardType.METAL, [{ type: CardType.FIRE }], [{ type: CardType.GRASS, value: -30 }], 1],
  ["Misdreavus LA", "107", 60, CardType.PSYCHIC, [{ type: CardType.DARK, value: +10 }], [{ type: CardType.COLORLESS, value: -20 }], 1],
  ["Spoink LA", "121", 50, CardType.PSYCHIC, [{ type: CardType.PSYCHIC, value: +10 }], [], 1],
  ["Treecko SF", "79", 50, CardType.GRASS, [{ type: CardType.FIRE, value: +10 }], [{ type: CardType.WATER, value: -20 }], 1],
  ["Voltorb SF2", "81", 60, CardType.LIGHTNING, [{ type: CardType.FIGHTING, value: +10 }], [{ type: CardType.METAL, value: -20 }], 1],
  ["Swinub SF", "77", 50, CardType.FIGHTING, [{ type: CardType.GRASS, value: +10 }], [{ type: CardType.LIGHTNING, value: -20 }], 1],
  ["Bidoof SF", "54", 60, CardType.COLORLESS, [{ type: CardType.FIGHTING, value: +10 }], [], 2],
  ["Skorupi SF", "73", 60, CardType.GRASS, [{ type: CardType.PSYCHIC, value: +10 }], [], 2],
  ["Koffing RR", "68", 60, CardType.PSYCHIC, [{ type: CardType.PSYCHIC, value: +10 }], [], 2],
  ["Gliscor E4 RR", "62", 80, CardType.FIGHTING, [{ type: CardType.WATER }], [{ type: CardType.FIGHTING, value: -20 }], 1],
  ["Eevee RR", "59", 50, CardType.COLORLESS, [{ type: CardType.FIGHTING, value: +10 }], [], 1]
];
const water='Water Energy SVE', fire='Fire Energy SVE', grass='Grass Energy SVE', psychic='Psychic Energy SVE', fight='Fighting Energy SVE', lightning='Lightning Energy SVE', dark='Darkness Energy SVE', metal='Metal Energy SVE';
class Bonus extends TrainerCard {
 public name='Bonus'; public fullName='Bonus TST'; public set='TST'; public trainerType=TrainerType.STADIUM;
 public reduceEffect(_s:StoreLike,state:State,e:Effect):State { if(e instanceof AttackEffect)e.damage+=20; return state; }
}
function game(name:string, energy:string[], copied=false, ownBench:string[]=[], oppBench:string[]=[]) {
 const g=setupGame({turn:2, player1:{active:{card:copied?'Mew ex 30C':name,energy},bench:copied?[{card:name},...ownBench.map(card=>({card}))]:ownBench.map(card=>({card})),deck:padDeck(15)},player2:{active:{card:'Mew ex MEW'},bench:oppBench.map(card=>({card})),deck:padDeck(15)}});
 const target=g.player2.active.getPokemonCard()!;target.weakness=[];target.resistance=[];target.hp=1000;return g;
}
function attack(g:ReturnType<typeof game>, name:string, copied=false) { if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:name}));useAbility(g.store,g.state,0,'Memory Helix');}else useAttack(g.store,g.state,0,name); }
describe('non-Arceus round 26',()=>{
 beforeAll(()=>ensureClientCards());
 beforeEach(()=>spyOn(Math,'random').and.returnValue(0.1));
 for(const [name,number,hp,type,weakness,resistance,retreat] of printed) it('registers printed characteristics for '+name,()=>{
  const c=getCardByName(name) as PokemonCard; expect(c.setNumber).toBe(number);expect(c.hp).toBe(hp);expect(c.cardType).toBe(type);expect(c.weakness).toEqual(weakness);expect(c.resistance).toEqual(resistance);expect(c.retreat.length).toBe(retreat);
 });
 for(const name of ['Drapion E4 RR','Bastiodon GL RR','Houndoom E4 RR','Gliscor E4 RR'])it('keeps printed Pokémon SP tag '+name,()=>expect(getCardByName(name).tags).toContain(CardTag.POKEMON_SP));
 for(const copied of [false,true]) {
  const label=copied?'copied ':'direct ';
  for(const [name,move,energy,amount] of [
   ['Tandemaus PAL','Gentle Slap',[water,water,water],30],['Floragato SVI','Slash',[water],20],['Floragato SVI','Leaf Step',[grass,water],60],['Sprigatito SVI','Scratch',[water],10],['Sprigatito SVI','Leafage',[grass,water],20],['Houndour LA','Bite',[dark],10],['Nincada LA','Scratch',[water],10],['Drapion E4 RR','Mega Impact',[psychic,water,water,water],70],['Spheal RR','Ice Ball',[water,water],20],['Surfing Pikachu RR','Surf',[water,water],30],['Duskull SF3','Tackle',[water],10],['Shelgon SF','Rollout',[water,water,water],50],['Stufful MEG','Light Punch',[water],10],['Stufful MEG','Flop',[water,water],20],['Tinkatink MEG','Beat',[metal],20],['Gliscor E4 RR','Irongrip',[water],10]
  ] as Array<[string,string,string[],number]>)it(label+name+' '+move+' printed damage',()=>{const g=game(name,energy,copied);attack(g,move,copied);expect(g.player2.active.damage).toBe(amount)});
  for(const [name,move,energy,base,bonus] of [['Tandemaus SSP','Play Rough',[water],10,10],['Poochyena LA','Ambush',[water,water],10,20]] as Array<[string,string,string[],number,number]>)for(const heads of [false,true])it(label+name+' coin bonus '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game(name,energy,copied);g.player1.stadium.cards.push(new Bonus());attack(g,move,copied);expect(g.player2.active.damage).toBe(base+20+(heads?bonus:0));});
  for(const [name,move,energy,base] of [['Inkay LOR 77','Fickle Attack',[psychic],30],['Duskull SF3','Surprise Attack',[psychic,water],30]] as Array<[string,string,string[],number]>)for(const heads of [false,true])it(label+name+' attack misses on tails '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game(name,energy,copied);g.player1.stadium.cards.push(new Bonus());attack(g,move,copied);expect(g.player2.active.damage).toBe(heads?base+20:0);});
  for(const [name,move,energy,count,unit] of [['Grovyle SF','Slam',[grass,water,water],2,60],['Cherubi SF','Bullet Seed',[grass],4,10],['Stunky SF','Double Scratch',[water,water],2,20],['Crobat UL2','Hurricane Wing',[psychic,water,water],4,30]] as Array<[string,string,string[],number,number]>)for(let heads=0;heads<=count;heads++)it(label+name+' coin multiplier '+heads,()=>{let i=0;(Math.random as jasmine.Spy).and.callFake(()=>i++<heads?0.1:0.9);const g=game(name,energy,copied);g.player1.stadium.cards.push(new Bonus());attack(g,move,copied);expect(g.player2.active.damage).toBe(heads?heads*unit+20:0)});
  for(const heads of [false,true])it(label+'Hippopotas Endeavor adds 20 per head '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game('Hippopotas RR',[fight,water,water],copied);g.player1.stadium.cards.push(new Bonus());attack(g,'Endeavor',copied);expect(g.player2.active.damage).toBe(heads?90:50)});
  for(const [name,move,energy,condition,coin] of [['Drapion E4 RR','Body Slam',[water,water],SpecialCondition.PARALYZED,true],['Spheal RR','Powder Snow',[water],SpecialCondition.ASLEEP,false],['Houndoom E4 RR','Fire Fang',[fire,water,water],SpecialCondition.BURNED,false],['Grovyle SF','Tail Shake',[grass],SpecialCondition.ASLEEP,false],['Shelgon SF','Body Slam',[water,water],SpecialCondition.PARALYZED,true],['Crobat UL2','Supersonic',[psychic],SpecialCondition.CONFUSED,false],['Spoink LA','Psybeam',[psychic],SpecialCondition.CONFUSED,false],['Treecko SF','Poison Breath',[grass],SpecialCondition.POISONED,true],['Bidoof SF','Yawn',[water],SpecialCondition.ASLEEP,false]] as Array<[string,string,string[],SpecialCondition,boolean]>)for(const heads of coin?[false,true]:[true])it(label+name+' condition '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game(name,energy,copied);let applied=false;const reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const out=reduce(s,e);if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(condition)&&!e.preventDefault)applied=true;return out});attack(g,move,copied);expect(applied).toBe(heads);});
  for(const [name,move,energy] of [['Poochyena LA','Corner',[dark]],['Nincada LA','Big Bite',[grass]],['Houndoom E4 RR','Corner',[water,water]],['Skorupi SF','Stalk',[water]]] as Array<[string,string,string[]]>)it(label+name+' locks the original defender against retreat',()=>{const g=game(name,energy,copied,[],['Squirtle BS']);attack(g,move,copied);expect(g.player2.active.marker.hasMarker(LOCK)).toBe(true);expect(()=>g.store.reduceEffect(g.state,new RetreatStartEffect(g.player2))).toThrow();});
  for(const [name,move,energy,heal] of [['Bastiodon GL RR','Smack Attack',[metal,water,water,water],10],['Cherubi SF','Nap',[],20]] as Array<[string,string,string[],number]>)it(label+name+' heals only the original attacker',()=>{const g=game(name,energy,copied);g.player1.active.damage=40;attack(g,move,copied);expect(g.player1.active.damage).toBe(40-heal)});
  for(const [name,move,energy] of [['Houndour LA','Roar',[water]],['Hippopotas RR','Push Down',[water]],['Bastiodon GL RR','Bounce Back',[metal,water,water]]] as Array<[string,string,string[]]>)it(label+name+' lets opponent choose a Bench replacement',()=>{const g=game(name,energy,copied,[],['Charmander BS']),original=g.player2.active;attack(g,move,copied);expect(g.player2.active).not.toBe(original);});
  it(label+'Tandemaus draws two cards',()=>{const g=game('Tandemaus PAL',[water],copied);attack(g,'Collect',copied);expect(g.player1.hand.cards.length).toBe(2)});
  for(const [name,move,energy,targets] of [
   ['Misdreavus LA','Show Off',[],['Psychic Energy SVE']],
   ['Treecko SF','Call for Friends',[water],['Squirtle BS']],
   ['Voltorb SF2','Outlet',[water],['Lightning Energy SVE']],
   ['Eevee RR','Signs of Evolution',[],['Vaporeon JU','Jolteon JU']]
  ] as Array<[string,string,string[],string[]]>) it(label+name+' searches and shuffles only qualifying cards',()=>{
   const g=game(name,energy,copied);const cards=targets.map((n,i)=>{const c=getCardByName(n);c.id=12000+i;g.player1.deck.cards.unshift(c);return c});let shuffled=false;
   g.overridePrompt('Choose cards',(p:any)=>cards.map(c=>p.cards.cards.indexOf(c)));g.overridePrompt('Shuffle deck',()=>{shuffled=true;return g.player1.deck.cards.map((_:unknown,i:number)=>i)});
   attack(g,move,copied);for(const c of cards)expect(g.player1.hand.cards).toContain(c);expect(shuffled).toBe(true);
  });
  for(const yes of [false,true])it(label+'Spoink may choose to switch '+yes,()=>{const g=game('Spoink LA',[water,water],copied,['Charmander BS']),original=g.player1.active;g.overridePrompt('Confirm',()=>yes);attack(g,'Bounce',copied);expect(g.player1.active===original).toBe(!yes)});
  for(const one of [false,true])it(label+'Misdreavus Payback checks remaining prizes '+one,()=>{const g=game('Misdreavus LA',[psychic],copied);if(one)g.player2.prizes.splice(1);attack(g,'Payback',copied);expect(g.player2.active.damage).toBe(one?30:10)});
  it(label+'Eevee switches the original attacker',()=>{const g=game('Eevee RR',[water],copied,['Charmander BS']),original=g.player1.active;attack(g,'Bounce',copied);expect(g.player1.active).not.toBe(original)});
  it(label+'Stunky switches the original attacker',()=>{const g=game('Stunky SF',[dark],copied,['Charmander BS']),original=g.player1.active;attack(g,'Gnaw and Run',copied);expect(g.player1.active).not.toBe(original)});
  for(const heads of [false,true])it(label+'Bidoof flips to damage opponent or itself '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game('Bidoof SF',[water],copied);g.player1.stadium.cards.push(new Bonus());attack(g,'Self-abandonment',copied);expect(g.player2.active.damage).toBe(heads?50:0);expect(g.player1.active.damage).toBe(heads?0:10)});
  for(const [name,move,energy] of [['Voltorb SF2','Bouncing Ball',[lightning]],['Swinub SF','Take Down',[fight]]] as Array<[string,string,string[]]>)for(const heads of [false,true])it(label+name+' flips recoil after attacking '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game(name,energy,copied);attack(g,move,copied);expect(g.player2.active.damage).toBe(20);expect(g.player1.active.damage).toBe(heads?0:10)});
  for(const [name,move,energy,headsCondition,tailsCondition] of [['Swinub SF','Freezing Breath',[water],SpecialCondition.PARALYZED,SpecialCondition.ASLEEP],['Skorupi SF','Dangerous Claw',[grass,water],SpecialCondition.PARALYZED,SpecialCondition.POISONED]] as Array<[string,string,string[],SpecialCondition,SpecialCondition]>)for(const heads of [false,true])it(label+name+' coin determines status '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game(name,energy,copied),seen:SpecialCondition[]=[],reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const out=reduce(s,e);if(e instanceof AddSpecialConditionsEffect&&!e.preventDefault)seen.push(...e.specialConditions);return out});attack(g,move,copied);expect(seen).toContain(heads?headsCondition:tailsCondition);expect(seen).not.toContain(heads?tailsCondition:headsCondition)});
  for(const heads of [false,true])it(label+'Koffing Gas applies both conditions only on heads '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game('Koffing RR',[water],copied),seen:SpecialCondition[]=[],reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const out=reduce(s,e);if(e instanceof AddSpecialConditionsEffect&&!e.preventDefault)seen.push(...e.specialConditions);return out});attack(g,'Offensive Gas',copied);expect(seen.includes(SpecialCondition.CONFUSED)).toBe(heads);expect(seen.includes(SpecialCondition.POISONED)).toBe(heads)});
  it(label+'Koffing recoil occurs after damage and ignores Weakness',()=>{const g=game('Koffing RR',[psychic],copied),events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);g.player1.active.getPokemonCard()!.weakness=[{type:CardType.PSYCHIC}];spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof DealDamageEffect)events.push(e.target===g.player1.active?'self':'opponent');return reduce(s,e)});attack(g,'Gas Bomb',copied);expect(g.player2.active.damage).toBe(30);expect(g.player1.active.damage).toBe(30);expect(events.indexOf('self')).toBeGreaterThan(events.indexOf('opponent'))});
  for(const heads of [false,true])it(label+'Gliscor applies the heads bonus or tails poison '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game('Gliscor E4 RR',[fight,water],copied),seen:SpecialCondition[]=[],reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const out=reduce(s,e);if(e instanceof AddSpecialConditionsEffect&&!e.preventDefault)seen.push(...e.specialConditions);return out});attack(g,'Loaded Needle',copied);expect(g.player2.active.damage).toBe(heads?40:20);expect(seen.includes(SpecialCondition.POISONED)).toBe(!heads)});
 }
 it('round-trips all 32 registered cards in ClientSimulator snapshots',()=>{ensureClientCards();const state=new State();state.phase=GamePhase.PLAYER_TURN;state.turn=2;state.players=[new Player(),new Player()];const add=(list:CardList,name:string)=>{const card=CardManager.getInstance().getCardByName(name)!;expect(card).toBeDefined();card.id=state.cardNames.length;state.cardNames.push(card.fullName);list.cards.push(card);};state.players.forEach((player,i)=>{player.id=i+1;player.name=i?'Opponent':'Player';player.bench=Array.from({length:5},()=>new PokemonCardList());player.prizes=Array.from({length:6},()=>new CardList());player.prizes.forEach(x=>add(x,'Fire Energy SVE'));for(let j=0;j<9;j++)add(player.deck,'Fire Energy SVE');add(player.active,i?'Mew ex MEW':printed[0][0]);});printed.slice(1).forEach(([name])=>add(state.players[0].deck,name));const sim=new ClientSimulator();sim.loadSnapshot({stateData:new Base64().encode(new StateSerializer().serialize(state))});const restored=new ClientSimulator();restored.loadSnapshot({stateData:sim.getStateData()});for(const [name] of printed)expect(restored.state.cardNames).toContain(name);sim.cleanup();restored.cleanup();});
});
