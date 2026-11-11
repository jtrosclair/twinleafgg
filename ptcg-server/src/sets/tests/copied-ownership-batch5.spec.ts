import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { State, GamePhase } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Store } from '../../game/store/store';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect, PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { AfterAttackEffect, EndTurnEffect, BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { CheckPokemonStatsEffect } from '../../game/store/effects/check-effects';
import { cloneAttacks, openCopyAttackSession, clearCopyAttackSessionsForTests, resolveCopyAttackSessions } from '../../game/store/prefabs/copy-attack-delegation';
import { Mewex } from '../set-30th-celebration/mew-ex';
import { Mewex as MewMEW } from '../set-pokemon-151/mew-ex';
import { Charmander } from '../set-base-set/charmander';
import { ChooseAttackPrompt } from '../../game/store/prompts/choose-attack-prompt';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { LilliesClefairyex } from '../set-journey-together/lillies-clefairy-ex';
import { Meowthex } from '../set-perfect-order/meowth-ex';
import { Drakloak } from '../set-twilight-masquerade/drakloak';
import { Lunatone } from '../set-mega-evolution/lunatone';
import { Hawlucha } from '../set-scarlet-and-violet/hawlucha';
import { Shaymin } from '../set-destined-rivals/shaymin';
import { Psyduck } from '../set-mega-evolution-promos/psyduck';
import { Noctowl } from '../set-stellar-crown/noctowl';
import { Dusclops } from '../set-shrouded-fable/dusclops';
import { Tatsugiri } from '../set-twilight-masquerade/tatsugiri';
import { Dudunsparce } from '../set-temporal-forces/dudunsparce';
import { Froslass } from '../set-twilight-masquerade/froslass';
import { Meganium } from '../set-mega-evolution/meganium';
import { Toxtricity } from '../set-phantasmal-flames/toxtricity';
import { Kadabra } from '../set-mega-evolution/kadabra';
import { Genesect } from '../set-shrouded-fable/genesect';
import { Charmander as CharmanderM2 } from '../set-phantasmal-flames/charmander';
import { Thwackey } from '../set-twilight-masquerade/thwackey';
import { Hoothoot } from '../set-prismatic-evolution/hoothoot';
import { Malamar } from '../set-forbidden-light/malamar';
import { Drilbur } from '../set-temporal-forces/drilbur';
import { Eeveeex } from '../set-prismatic-evolution/eevee-ex';
import { Abra } from '../set-twilight-masquerade/abra';
import { Xatu } from '../set-paradox-rift/xatu';
import { Archeops } from '../set-silver-tempest/archeops';
import { LilliesClefairyexFA } from '../set-journey-together/other-prints';
import { MeowthexFA } from '../set-perfect-order/other-prints';
import { DrakloakPRE, DusclopsPRE } from '../set-prismatic-evolution/alt-arts';
import { LunatoneASC, PsyduckASC } from '../set-ascended-heroes/other-prints';
import { HawluchaSV } from '../set-paldean-fates/shiny-vault';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { PowerType } from '../../game/store/card/pokemon-types';

class Dummy extends PokemonCard { public name='Dummy';public fullName='Dummy TEST';public hp=500;public set='TEST'; }
class Energy extends EnergyCard {public name='Energy';public fullName='Energy TEST';public set='TEST';public provides=[CardType.PSYCHIC];}
class Tool extends TrainerCard {public name='Tool';public fullName='Tool TEST';public set='TEST';public trainerType=TrainerType.TOOL;}
function battle(card:PokemonCard,copied:boolean,index=0){
 const state=new State(),player=new Player(),opponent=new Player(),mew=new Mewex();player.id=1;opponent.id=2;state.players=[player,opponent];state.turn=2;state.activePlayer=0;state.phase=GamePhase.ATTACK;
 player.active.cards=[copied?mew:card];opponent.active.cards=[new Dummy()];const store=new Store({onStateChange:()=>undefined});store.state=state;
 const attacks=copied?cloneAttacks(card.attacks):card.attacks;if(copied)openCopyAttackSession(state,player,mew,card,attacks,attacks[index]);
 return {state,player,opponent,store,card,mew,copycat:copied?mew:card,attack:new AttackEffect(player,opponent,attacks[index]),copied};
}
function addBench(player:Player,n=1){for(let i=0;i<n;i++){const slot=new PokemonCardList();slot.cards=[new Dummy()];player.bench.push(slot);}}
function disable(b:ReturnType<typeof battle>){const reduce=b.store.reduceEffect.bind(b.store);spyOn(b.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof PowerEffect)throw new Error('Ability disabled');return reduce(s,e);});}

describe('puzzle-prioritized copied attack ownership batch 5',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 for(const copied of [false,true])for(const blocked of [false,true])it('Clefairy Full Moon Rondo counts both benches, copied='+copied+', Ability disabled='+blocked,()=>{
  const b=battle(new LilliesClefairyex(),copied);addBench(b.player,2);addBench(b.opponent,3);if(blocked)disable(b);b.store.reduceEffect(b.state,b.attack);expect(b.attack.damage).toBe(120);
 });
 for(const copied of [false,true])it('Meowth Tuck Tail returns the attacker, energy and tool after damage, copied='+copied,()=>{
  const b=battle(new Meowthex(),copied),energy=new Energy(),tool=new Tool();b.player.active.cards.push(energy,tool);b.player.active.tools.push(tool);
  b.store.reduceEffect(b.state,b.attack);expect(b.player.active.cards).toContain(b.copycat);expect(b.player.hand.cards.length).toBe(0);
  b.store.reduceEffect(b.state,new AfterAttackEffect(b.player,b.opponent,b.attack.attack));
  expect(b.player.hand.cards).toContain(b.copycat);expect(b.player.hand.cards).toContain(energy);expect(b.player.hand.cards).toContain(tool);
  expect(b.player.active.cards.length).toBe(0);
 });
 for(const copied of [false,true])it('Meowth attack ownership does not clear copied Last-Ditch ability state, copied='+copied,()=>{
  const b=battle(new Meowthex(),copied);b.player.marker.addMarkerToState((b.card as Meowthex).TRUMP_CARD_MARKER);b.state.phase=GamePhase.FINISHED;
  b.store.reduceEffect(b.state,new EndTurnEffect(b.player));expect(b.player.marker.hasMarker((b.card as Meowthex).TRUMP_CARD_MARKER)).toBe(copied);
 });
 for(const copied of [false,true])it('Drakloak copied attack does not clear source ability usage, copied='+copied,()=>{
  const b=battle(new Drakloak(),copied);const marker=(b.card as Drakloak).TELLING_SPIRIT_MARKER;b.player.marker.addMarker(marker,b.copycat);b.state.phase=GamePhase.FINISHED;
  b.store.reduceEffect(b.state,new EndTurnEffect(b.player));expect(b.player.marker.hasMarker(marker,b.copycat)).toBe(copied);
 });
 for(const copied of [false,true])it('Lunatone copied attack does not reset Lunar Cycle, copied='+copied,()=>{
  const b=battle(new Lunatone(),copied);b.player.usedLunarCycle=true;b.state.phase=GamePhase.FINISHED;
  b.store.reduceEffect(b.state,new EndTurnEffect(b.player));expect(b.player.usedLunarCycle).toBe(copied);
 });
 for(const [name,create] of [['Drakloak',()=>new Drakloak()],['Lunatone',()=>new Lunatone()],['Hawlucha',()=>new Hawlucha()],['Shaymin',()=>new Shaymin()],['Psyduck',()=>new Psyduck()],['Noctowl',()=>new Noctowl()],['Dusclops',()=>new Dusclops()],['Tatsugiri',()=>new Tatsugiri()],['Dudunsparce',()=>new Dudunsparce()],['Froslass',()=>new Froslass()],['Meganium',()=>new Meganium()],['Toxtricity',()=>new Toxtricity()],['Kadabra',()=>new Kadabra()],['Genesect',()=>new Genesect()],['Charmander M2',()=>new CharmanderM2()],['Thwackey',()=>new Thwackey()],['Hoothoot',()=>new Hoothoot()],['Malamar',()=>new Malamar()],['Drilbur',()=>new Drilbur()],['Eevee ex',()=>new Eeveeex()],['Abra',()=>new Abra()],['Xatu',()=>new Xatu()],['Archeops',()=>new Archeops()]] as Array<[string,()=>PokemonCard]>)
 for(const copied of [false,true])for(const blocked of [false,true])it(name+' plain damage keeps its Ability separate, copied='+copied+', Ability disabled='+blocked,()=>{
  const b=battle(create(),copied);if(blocked)disable(b);b.store.reduceEffect(b.state,b.attack);expect(b.attack.damage).toBe(b.attack.attack.damage);
 });
 for(const [name,create,marker] of [['Tatsugiri',()=>new Tatsugiri(),'CROWD_PULLER_MARKER'],['Toxtricity',()=>new Toxtricity(),'BAD_BOOST_MARKER']] as Array<[string,()=>PokemonCard,string]>)
 for(const copied of [false,true])it(name+' attack does not clear copied Ability state, copied='+copied,()=>{
  const b=battle(create(),copied),mark=(b.card as any)[marker];b.player.marker.addMarker(mark,b.copycat);b.state.phase=GamePhase.FINISHED;
  b.store.reduceEffect(b.state,new EndTurnEffect(b.player));expect(b.player.marker.hasMarker(mark,b.copycat)).toBe(copied);
 });
 for(const copied of [false,true])for(const blocked of [false,true])it('Froslass checkup Ability is not inherited by copycat, copied='+copied+', disabled='+blocked,()=>{
  const b=battle(new Froslass(),copied),victim=new Dummy();victim.powers=[{name:'Ability',powerType:PowerType.ABILITY,text:''}];const slot=new PokemonCardList();slot.cards=[victim];b.opponent.bench.push(slot);
  b.state.phase=GamePhase.BETWEEN_TURNS;let placements=0;const reduce=b.store.reduceEffect.bind(b.store);
  spyOn(b.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(blocked&&e instanceof PowerEffect)throw new Error('blocked');if(e instanceof PlaceDamageCountersEffect)placements++;return reduce(s,e);});
  const phase=new BetweenTurnsEffect(b.player);if(copied)resolveCopyAttackSessions(b.store,b.state,phase);else b.card.reduceEffect(b.store,b.state,phase);
  expect(placements).toBe(!copied&&!blocked?1:0);
 });
 for(const copied of [false,true])it('Genome Hacking can copy Scratch through the active defender, copied='+copied,()=>{
  const b=battle(new MewMEW(),copied);if(copied){const src=new PokemonCardList();src.cards=[b.card];b.player.bench.push(src);}b.opponent.active.cards=[new Charmander()];b.store.reduceEffect(b.state,b.attack);
  const prompt=b.state.prompts.find(p=>p instanceof ChooseAttackPrompt&&p.result===undefined) as ChooseAttackPrompt;expect(prompt).toBeDefined();
  const selected=prompt.decode({index:0,attack:'Scratch'},b.state);expect(prompt.validate(selected)).toBe(true);
  (b.store as any).reducePrompt(b.state,new ResolvePromptAction(prompt.id,selected));expect(b.opponent.active.damage).toBe(10);
 });
 for(const copied of [false,true])it('Genome Hacking does not clear copied Restart ability state, copied='+copied,()=>{
  const b=battle(new MewMEW(),copied),marker=(b.card as MewMEW).RESTART_MARKER;b.player.marker.addMarker(marker,b.copycat);b.state.phase=GamePhase.FINISHED;
  b.store.reduceEffect(b.state,new EndTurnEffect(b.player));expect(b.player.marker.hasMarker(marker,b.copycat)).toBe(copied);
 });
 for(const [name,create,marker] of [['Drakloak',()=>new Drakloak(),'TELLING_SPIRIT_MARKER'],['Tatsugiri',()=>new Tatsugiri(),'CROWD_PULLER_MARKER'],['Toxtricity',()=>new Toxtricity(),'BAD_BOOST_MARKER'],['Mew MEW',()=>new MewMEW(),'RESTART_MARKER']] as Array<[string,()=>PokemonCard,string]>)
 it(name+' copied attack leaves the copied Pokemon Ability marker intact with real source on the other Bench',()=>{
  const b=battle(create(),true),src=new PokemonCardList(),mark=(b.card as any)[marker];src.cards=[b.card];b.opponent.bench.push(src);
  b.player.marker.addMarker(mark,b.copycat);b.state.phase=GamePhase.FINISHED;b.store.reduceEffect(b.state,new EndTurnEffect(b.player));
  expect(b.player.marker.hasMarker(mark,b.copycat)).toBe(true);
 });
 it('Lunatone copied attack does not reset Lunar Cycle with real source on the other Bench',()=>{
  const b=battle(new Lunatone(),true),src=new PokemonCardList();src.cards=[b.card];b.opponent.bench.push(src);b.player.usedLunarCycle=true;b.state.phase=GamePhase.FINISHED;
  b.store.reduceEffect(b.state,new EndTurnEffect(b.player));expect(b.player.usedLunarCycle).toBe(true);
 });
 it('Meowth original global Last-Ditch cleanup still runs with a copied source in play',()=>{
  const b=battle(new Meowthex(),true),src=new PokemonCardList();src.cards=[b.card];b.opponent.bench.push(src);const marker=(b.card as Meowthex).TRUMP_CARD_MARKER;
  b.player.marker.addMarkerToState(marker);b.state.phase=GamePhase.FINISHED;b.store.reduceEffect(b.state,new EndTurnEffect(b.player));expect(b.player.marker.hasMarker(marker)).toBe(false);
 });
 for(const copied of [false,true])it('Eevee ex bench protection is not copied, copied='+copied,()=>{
  const b=battle(new Eeveeex(),copied),target=b.player.active;b.player.bench.push(target);b.player.active=new PokemonCardList();b.player.active.cards=[new Dummy()];b.state.activePlayer=1;
  const attack=new AttackEffect(b.opponent,b.player,{name:'Bench hit',cost:[],damage:30,text:''});const hit=new PutDamageEffect(attack,30);hit.target=target;b.store.reduceEffect(b.state,hit);
  expect(hit.preventDefault).toBe(!copied);expect(target.damage).toBe(copied?30:0);
 });
 for(const [name,create] of [['Drakloak PRE',()=>new DrakloakPRE()],['Dusclops PRE',()=>new DusclopsPRE()],['Lunatone ASC',()=>new LunatoneASC()],['Psyduck ASC',()=>new PsyduckASC()],['Hawlucha SV',()=>new HawluchaSV()]] as Array<[string,()=>PokemonCard]>)
 for(const copied of [false,true])it(name+' inherited attack ownership preserves damage and identity, copied='+copied,()=>{
  const card=create(),id=card.fullName,b=battle(card,copied);b.store.reduceEffect(b.state,b.attack);expect(b.attack.damage).toBe(b.attack.attack.damage);expect(card.fullName).toBe(id);
 });
 for(const copied of [false,true])it('Clefairy alternate print preserves copied Full Moon Rondo, copied='+copied,()=>{
  const card=new LilliesClefairyexFA(),id=card.fullName,b=battle(card,copied);addBench(b.player,2);b.store.reduceEffect(b.state,b.attack);expect(b.attack.damage).toBe(60);expect(card.fullName).toBe(id);
 });
 for(const copied of [false,true])it('Meowth alternate print preserves the after-attack return, copied='+copied,()=>{
  const card=new MeowthexFA(),id=card.fullName,b=battle(card,copied);b.store.reduceEffect(b.state,b.attack);b.store.reduceEffect(b.state,new AfterAttackEffect(b.player,b.opponent,b.attack.attack));expect(b.player.hand.cards).toContain(b.copycat);expect(card.fullName).toBe(id);
 });
 it('Fairy Zone still changes the opposing Dragon weakness when Clefairy is present',()=>{
  const b=battle(new LilliesClefairyex(),false),target=b.opponent.active;target.getPokemonCard()!.cardType=CardType.DRAGON;
  const stats=new CheckPokemonStatsEffect(target);b.store.reduceEffect(b.state,stats);expect(stats.weakness).toEqual([{type:CardType.PSYCHIC}]);
 });
});
