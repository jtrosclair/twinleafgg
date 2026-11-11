import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, SpecialCondition, TrainerType } from '../../game/store/card/card-types';
import { State, GamePhase } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Store } from '../../game/store/store';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckAttackCostEffect, CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { cloneAttacks, openCopyAttackSession, clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { Mewex } from '../set-30th-celebration/mew-ex';
import { Munkidori } from '../set-twilight-masquerade/munkidori';
import { Latiasex } from '../set-surging-sparks/latias-ex';
import { Fezandipitiex } from '../set-shrouded-fable/fezandipiti-ex';
import { BloodmoonUrsalunaex } from '../set-twilight-masquerade/bloodmoon-ursaluna-ex';
import { Pecharuntex } from '../set-shrouded-fable/pecharunt-ex';
import { MegaKangaskhanex } from '../set-mega-evolution/mega-kangaskhan-ex';
import { FanRotom } from '../set-stellar-crown/fan-rotom';
import { CornerstoneMaskOgerponex } from '../set-twilight-masquerade/cornerstone-mask-ogerpon-ex';
import { Pidgeotex } from '../set-obsidian-flames/pidgeot-ex';
import { Gholdengoex } from '../set-paradox-rift/gholdengo-ex';
import { ChienPao } from '../set-surging-sparks/chien-pao';
import { Jellicentex } from '../set-black-bolt-white-flare/jellicent-ex';
import { IronLeavesex } from '../set-temporal-forces/iron-leaves-ex';
import { Hariyama } from '../set-mega-evolution/hariyama';
import { Squawkabillyex } from '../set-paldea-evolved/squawkabilly-ex';
import { Blazikenex } from '../set-journey-together/blaziken-ex';
import { Kyurem } from '../set-shrouded-fable/kyurem';
import { MegaVenusaurEx } from '../set-mega-evolution/mega-venusaur-ex';
import { Seaking } from '../set-prismatic-evolution/seaking';
import { Alakazam } from '../set-mega-evolution/alakazam';
import { MunkidoriASC, FezandipitiexASC, FanRotomASC } from '../set-ascended-heroes/other-prints';
import { MunkidoriPRE, CornerstoneMaskOgerponexPRE, FanRotomPRE } from '../set-prismatic-evolution/alt-arts';
import { LatiasexFA, LatiasexSIR } from '../set-surging-sparks/full-art';
import { GholdengoexFA, GholdengoexSIR } from '../set-paradox-rift/full-art';
import { MegaKangaskhanexM1S } from '../set-mega-evolution/other-prints';

class Dummy extends PokemonCard {public name='Dummy';public fullName='Dummy TEST';public hp=500;public set='TEST';}
class Energy extends EnergyCard {public name='Energy';public fullName='Energy TEST';public set='TEST';public provides=[CardType.GRASS];}
class Stadium extends TrainerCard {public name='Festival Grounds';public fullName='Festival Grounds TEST';public set='TEST';public trainerType=TrainerType.STADIUM;}
function battle(card:PokemonCard,copied:boolean){
 const state=new State(),player=new Player(),opponent=new Player(),mew=new Mewex();player.id=1;opponent.id=2;state.players=[player,opponent];
 state.turn=2;state.activePlayer=0;state.phase=GamePhase.ATTACK;player.active.cards=[copied?mew:card];opponent.active.cards=[new Dummy()];
 const store=new Store({onStateChange:()=>undefined});store.state=state;const attacks=copied?cloneAttacks(card.attacks):card.attacks;
 if(copied)openCopyAttackSession(state,player,mew,card,attacks,attacks[0]);
 return {state,player,opponent,store,card,mew,attack:new AttackEffect(player,opponent,attacks[0]),copied};
}
type Battle=ReturnType<typeof battle>;
function disable(b:Battle){const reduce=b.store.reduceEffect.bind(b.store);spyOn(b.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof PowerEffect)throw new Error('Ability disabled');return reduce(s,e);});}
function resolve(b:Battle,result:any){const p=b.state.prompts.filter(x=>x.result===undefined).pop();if(!p)throw new Error('Expected prompt');(b.store as any).reducePrompt(b.state,new ResolvePromptAction(p.id,result));}
function addEnergy(b:Battle){const e=new Energy();b.player.active.cards.push(e);b.player.active.energies.cards.push(e);return e;}

interface Case { name:string; create:()=>PokemonCard; prepare?:(b:Battle)=>void; verify:(b:Battle,blocked:boolean)=>void; }
const cases:Case[]=[
 {name:'Munkidori Mind Bend',create:()=>new Munkidori(),verify:b=>expect(b.opponent.active.specialConditions).toContain(SpecialCondition.CONFUSED)},
 ...[
  ['Latias Eon Blade',()=>new Latiasex()],['Bloodmoon Blood Moon',()=>new BloodmoonUrsalunaex()],
  ['Iron Leaves Prism Edge',()=>new IronLeavesex()],['Blaziken Burning Assault',()=>new Blazikenex()]
 ].map(([name,create])=>({name:name as string,create:create as ()=>PokemonCard,verify:(b:Battle)=>expect(b.player.active.cannotAttackNextTurnPending).toBe(true)})),
 {name:'Fezandipiti Cruel Arrow',create:()=>new Fezandipitiex(),verify:b=>{resolve(b,[b.opponent.active]);expect(b.opponent.active.damage).toBe(100);}},
 {name:'Pecharunt Irritated Outburst',create:()=>new Pecharuntex(),prepare:b=>{b.opponent.prizesTaken=2;},verify:b=>expect(b.attack.damage).toBe(120)},
 {name:'Mega Kangaskhan Rapid-Fire Combo',create:()=>new MegaKangaskhanex(),verify:b=>{resolve(b,true);resolve(b,false);expect(b.attack.damage).toBe(250);}},
 {name:'Fan Rotom Assault Landing',create:()=>new FanRotom(),prepare:b=>{b.player.stadium.cards=[new Stadium()];},verify:b=>expect(b.attack.damage).toBe(70)},
 {name:'Cornerstone Demolish',create:()=>new CornerstoneMaskOgerponex(),verify:b=>expect(b.opponent.active.damage).toBe(140)},
 {name:'Pidgeot Blustery Wind',create:()=>new Pidgeotex(),prepare:b=>{b.player.stadium.cards=[new Stadium()];},verify:b=>{resolve(b,true);expect(b.player.stadium.cards.length).toBe(0);expect(b.player.discard.cards.length).toBe(1);}},
 {name:'Gholdengo Make It Rain',create:()=>new Gholdengoex(),prepare:b=>{b.player.hand.cards=[new Energy()];},verify:b=>{const e=b.player.hand.cards[0];resolve(b,[e]);expect(b.attack.damage).toBe(50);expect(b.player.discard.cards).toContain(e);}},
 {name:'Chien-Pao Icicle Loop',create:()=>new ChienPao(),prepare:b=>{addEnergy(b);addEnergy(b);},verify:b=>{const e=b.player.active.energies.cards[0];resolve(b,[{card:e,provides:[CardType.GRASS]}]);expect(b.player.hand.cards).toContain(e);}},
 {name:'Jellicent Power Press',create:()=>new Jellicentex(),prepare:b=>{for(let i=0;i<4;i++)addEnergy(b);},verify:b=>expect(b.attack.damage).toBe(160)},
 {name:'Hariyama Wild Press',create:()=>new Hariyama(),verify:b=>expect(b.player.active.damage).toBe(70)},
 {name:'Squawkabilly Motivate',create:()=>new Squawkabillyex(),prepare:b=>{const slot=new PokemonCardList();slot.cards=[new Dummy()];b.player.bench=[slot];b.player.discard.cards=[new Energy()];},verify:b=>{resolve(b,[]);expect(b.attack.damage).toBe(20);}},
 {name:'Kyurem Trifrost',create:()=>new Kyurem(),prepare:b=>{addEnergy(b);},verify:b=>{resolve(b,[b.opponent.active]);expect(b.opponent.active.damage).toBe(110);expect(b.player.discard.cards.some(c=>c instanceof Energy)).toBe(true);}},
 {name:'Mega Venusaur Jungle Dump',create:()=>new MegaVenusaurEx(),prepare:b=>{b.player.active.damage=50;},verify:b=>expect(b.player.active.damage).toBe(20)},
 {name:'Seaking Rapid Draw',create:()=>new Seaking(),prepare:b=>{b.player.deck.cards=[new Dummy(),new Dummy()];b.player.stadium.cards=[new Stadium()];},verify:(b,blocked)=>{expect(b.player.hand.cards.length).toBe(2);expect((b.attack.attack as any).barrage).toBe(!b.copied&&!blocked?true:undefined);}},
 {name:'Alakazam Hand Power',create:()=>new Alakazam(),prepare:b=>{b.player.hand.cards=[new Dummy(),new Dummy(),new Dummy()];},verify:b=>expect(b.opponent.active.damage).toBe(60)}
];

describe('high-frequency explicit copied attack ownership',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 for(const c of cases) for(const copied of [false,true]) for(const blocked of [false,true]) it(c.name+', copied='+copied+', Ability disabled='+blocked,()=>{
   const b=battle(c.create(),copied);c.prepare?.(b);if(blocked)disable(b);b.store.reduceEffect(b.state,b.attack);c.verify(b,blocked);
 });
 for(const [base,create] of [
   ['Munkidori Mind Bend',()=>new MunkidoriASC()],['Munkidori Mind Bend',()=>new MunkidoriPRE()],
   ['Fezandipiti Cruel Arrow',()=>new FezandipitiexASC()],['Fan Rotom Assault Landing',()=>new FanRotomASC()],
   ['Fan Rotom Assault Landing',()=>new FanRotomPRE()],['Cornerstone Demolish',()=>new CornerstoneMaskOgerponexPRE()],
   ['Latias Eon Blade',()=>new LatiasexFA()],['Latias Eon Blade',()=>new LatiasexSIR()],
   ['Gholdengo Make It Rain',()=>new GholdengoexFA()],['Gholdengo Make It Rain',()=>new GholdengoexSIR()],
   ['Mega Kangaskhan Rapid-Fire Combo',()=>new MegaKangaskhanexM1S()]
 ] as Array<[string,()=>PokemonCard]>) for(const copied of [false,true]) it(base+' alternate print preserves attack and identity, copied='+copied,()=>{
   const source=create(),name=source.fullName,c=cases.find(x=>x.name===base)!,b=battle(source,copied);c.prepare?.(b);b.store.reduceEffect(b.state,b.attack);c.verify(b,false);expect(source.fullName).toBe(name);
 });
 for(const [name,create,field] of [
  ['Mega Kangaskhan',()=>new MegaKangaskhanex(),'usedRunErrand'],
  ['Fan Rotom',()=>new FanRotom(),'usedFanCall'],
  ['Pecharunt',()=>new Pecharuntex(),'chainsOfControlUsed'],
  ['Fezandipiti',()=>new Fezandipitiex(),'usedTableTurner']
 ] as Array<[string,()=>PokemonCard,string]>) it(name+' normal Ability cleanup is retained but not inherited by the copy',()=>{
   const direct=battle(create(),false),copied=battle(create(),true);(direct.player as any)[field]=true;(copied.player as any)[field]=true;
   direct.store.reduceEffect(direct.state,new EndTurnEffect(direct.player));copied.store.reduceEffect(copied.state,new EndTurnEffect(copied.player));
   expect((direct.player as any)[field]).toBe(false);expect((copied.player as any)[field]).toBe(true);
 });
 for(const [name,create] of [
  ['Latias',()=>new Latiasex()],['Bloodmoon Ursaluna',()=>new BloodmoonUrsalunaex()],
  ['Iron Leaves',()=>new IronLeavesex()],['Blaziken',()=>new Blazikenex()]
 ] as Array<[string,()=>PokemonCard]>) for(const copied of [false,true]) it(name+' attack restriction lasts through its next turn, copied='+copied,()=>{
   const b=battle(create(),copied);b.store.reduceEffect(b.state,b.attack);b.state.phase=GamePhase.FINISHED;
   b.store.reduceEffect(b.state,new EndTurnEffect(b.player));expect(b.player.active.cannotAttackNextTurn).toBe(true);
   b.state.phase=GamePhase.FINISHED;b.state.activePlayer=1;b.store.reduceEffect(b.state,new EndTurnEffect(b.opponent));expect(b.player.active.cannotAttackNextTurn).toBe(true);
   b.state.phase=GamePhase.PLAYER_TURN;b.state.activePlayer=0;let message='';try{b.store.reduceEffect(b.state,new UseAttackEffect(b.player,b.attack.attack));}catch(e){message=(e as any).message;}
   expect(message).toBe('BLOCKED_BY_EFFECT');b.state.phase=GamePhase.FINISHED;b.store.reduceEffect(b.state,new EndTurnEffect(b.player));expect(b.player.active.cannotAttackNextTurn).toBe(false);
 });
 it('Munkidori Ability cleanup runs only for the original Ability',()=>{
   const direct=battle(new Munkidori(),false),copy=battle(new Munkidori(),true),marker=(direct.card as Munkidori).ADRENA_BRAIN_MARKER;
   direct.player.marker.addMarker(marker,direct.card);copy.player.marker.addMarker(marker,copy.mew);
   direct.store.reduceEffect(direct.state,new EndTurnEffect(direct.player));copy.store.reduceEffect(copy.state,new EndTurnEffect(copy.player));
   expect(direct.player.marker.hasMarker(marker,direct.card)).toBe(false);expect(copy.player.marker.hasMarker(marker,copy.mew)).toBe(true);
 });
 it('Latias Sky Liner remains direct, respects suppression and is not granted to the copy',()=>{
   const direct=battle(new Latiasex(),false),copied=battle(new Latiasex(),true);direct.card.retreat=[CardType.COLORLESS];(copied.mew as PokemonCard).retreat=[CardType.COLORLESS];
   const a=new CheckRetreatCostEffect(direct.player),b=new CheckRetreatCostEffect(copied.player);direct.store.reduceEffect(direct.state,a);copied.store.reduceEffect(copied.state,b);
   expect(a.cost).toEqual([]);expect(b.cost).toEqual([CardType.COLORLESS]);
   disable(direct);const blocked=new CheckRetreatCostEffect(direct.player);direct.store.reduceEffect(direct.state,blocked);expect(blocked.cost).toEqual([CardType.COLORLESS]);
 });
 it('Bloodmoon Seasoned Skill is not applied to a copy',()=>{
   const b=battle(new BloodmoonUrsalunaex(),true),cost=new CheckAttackCostEffect(b.player,b.attack.attack);b.store.reduceEffect(b.state,cost);expect(cost.cost.length).toBe(5);
 });
 it('Munkidori Adrena Brain still moves damage directly and is not granted to the copy',()=>{
   const b=battle(new Munkidori(),false),energy=new Energy();energy.provides=[CardType.DARK];b.player.active.cards.push(energy);b.player.active.damage=20;
   b.store.reduceEffect(b.state,new PowerEffect(b.player,b.card.powers[0],b.card));
   resolve(b,[{from:{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0},to:{player:PlayerType.TOP_PLAYER,slot:SlotType.ACTIVE,index:0}}]);
   expect(b.player.active.damage).toBe(10);expect(b.opponent.active.damage).toBe(10);
   const copy=battle(new Munkidori(),true);copy.player.active.damage=20;copy.player.active.cards.push(energy);
   copy.store.reduceEffect(copy.state,new PowerEffect(copy.player,copy.card.powers[0],copy.mew));expect(copy.state.prompts.length).toBe(0);expect(copy.opponent.active.damage).toBe(0);
 });
 it('Fezandipiti Flip the Script still draws directly and is not granted to the copy',()=>{
   const b=battle(new Fezandipitiex(),false),source=b.card as Fezandipitiex;b.player.marker.addMarkerToState(source.OPPONENT_KNOCKOUT_MARKER);b.player.deck.cards=[new Dummy(),new Dummy(),new Dummy()];
   b.store.reduceEffect(b.state,new PowerEffect(b.player,b.card.powers[0],b.card));expect(b.player.hand.cards.length).toBe(3);
   const copy=battle(new Fezandipitiex(),true);copy.player.marker.addMarkerToState(source.OPPONENT_KNOCKOUT_MARKER);copy.player.deck.cards=[new Dummy(),new Dummy(),new Dummy()];
   copy.store.reduceEffect(copy.state,new PowerEffect(copy.player,copy.card.powers[0],copy.mew));expect(copy.player.hand.cards.length).toBe(0);
 });
});
