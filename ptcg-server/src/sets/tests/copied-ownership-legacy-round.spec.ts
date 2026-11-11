import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { State, GamePhase } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Store } from '../../game/store/store';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { cloneAttacks, openCopyAttackSession, clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { Mewex } from '../set-30th-celebration/mew-ex';
import { TapuLeleGX } from '../set-guardians-rising/tapu-lele-gx';
import { Swampert } from '../set-celestial-storm/swampert';
import { ShiningGenesect } from '../set-shining-legends/shining-genesect';
import { Eevee } from '../set-sun-and-moon/eevee';
import { Rapidash } from '../set-silver-tempest/rapidash';
import { TapuLeleGXHIF } from '../set-hidden-fates/other-prints';
import { setupGame, padDeck } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';
class Dummy extends PokemonCard { public name='Dummy'; public fullName='Dummy TEST'; public set='TEST'; public hp=300; }
class TestEnergy extends EnergyCard { public name='Test Energy'; public fullName='Test Energy TEST'; public set='TEST'; constructor(type:CardType){super();this.provides=[type];} }
function battle(source:PokemonCard,copied:boolean,index=0){
 const state=new State(),player=new Player(),opponent=new Player(),mew=new Mewex(); state.players=[player,opponent];player.id=1;opponent.id=2;state.turn=2;state.phase=GamePhase.ATTACK;state.activePlayer=0;
 player.active.cards=[copied?mew:source];opponent.active.cards=[new Dummy()];const store=new Store({onStateChange:()=>undefined});store.state=state;
 const attacks=copied?cloneAttacks(source.attacks):source.attacks;if(copied)openCopyAttackSession(state,player,mew,source,attacks,attacks[index]);
 return {state,player,opponent,store,source,mew,owner:copied?mew:source,attack:new AttackEffect(player,opponent,attacks[index])};
}
function resolve(b:ReturnType<typeof battle>,result:any){const p=b.state.prompts.filter(x=>x.result===undefined).pop();if(!p)throw new Error('missing prompt');(b.store as any).reducePrompt(b.state,new ResolvePromptAction(p.id,result));}
describe('legacy copied-attack ownership',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 for(const copied of [false,true]) for(const blocked of [false,true]) it('Tapu Lele Energy Drive counts Energy on both Active Pokémon, copied='+copied+', Ability disabled='+blocked,()=>{
  const b=battle(new TapuLeleGX(),copied);b.player.active.cards.push(new TestEnergy(CardType.WATER),new TestEnergy(CardType.FIRE));b.opponent.active.cards.push(new TestEnergy(CardType.GRASS));
  if(blocked){const reduce=b.store.reduceEffect.bind(b.store);spyOn(b.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof PowerEffect)throw new Error('blocked');return reduce(s,e)});}
  b.store.reduceEffect(b.state,b.attack);expect(b.attack.damage).toBe(60);
 });
 for(const copied of [false,true]) it('Tapu Cure-GX resolves selected healing asynchronously, copied='+copied,()=>{
  const b=battle(new TapuLeleGX(),copied,1),slot=new PokemonCardList();slot.cards=[new Dummy()];slot.damage=90;b.player.bench.push(slot);
  b.store.reduceEffect(b.state,b.attack);const prompt=b.state.prompts.find(p=>p instanceof ChoosePokemonPrompt && p.result===undefined);expect(prompt).toBeDefined();resolve(b,[slot]);expect(slot.damage).toBe(0);expect(b.player.usedGX).toBe(true);
 });
 for(const copied of [false,true]) for(const [name,source,type,damage] of [['Swampert',new Swampert(),CardType.WATER,120],['Shining Genesect',new ShiningGenesect(),CardType.GRASS,90]] as Array<[string,PokemonCard,CardType,number]>) it(name+' damage uses attacking Pokémon Energy, copied='+copied,()=>{
  const b=battle(source,copied);b.player.active.cards.push(new TestEnergy(type),new TestEnergy(type));b.store.reduceEffect(b.state,b.attack);expect(b.attack.damage).toBe(damage);
 });
 for(const copied of [false,true])for(const [name,source,marker] of [['Swampert',new Swampert(),'POWER_DRAW_MARKER'],['Shining Genesect',new ShiningGenesect(),'ENERGY_RELOAD_MARKER'],['Rapidash',new Rapidash(),'HEAT_BOOST_MARKER']] as Array<[string,PokemonCard,string]>) it(name+' Ability marker cleanup is not copied, copied='+copied,()=>{
  const b=battle(source,copied);b.player.marker.addMarker((source as any)[marker],b.owner);b.state.phase=GamePhase.FINISHED;b.store.reduceEffect(b.state,new EndTurnEffect(b.player));expect(b.player.marker.hasMarker((source as any)[marker],b.owner)).toBe(copied);
 });
 for(const copied of [false,true])for(const heads of [false,true]) it('Eevee Quick Draw coin response, copied='+copied+', heads='+heads,()=>{
  const b=battle(new Eevee(),copied);b.player.deck.cards.push(new Dummy());b.store.reduceEffect(b.state,b.attack);resolve(b,heads);expect(b.player.hand.cards.length).toBe(heads?1:0);
 });
 for(const copied of [false,true])it('Rapidash Fire Mane does not gain a copied Heat Boost Ability, copied='+copied,()=>{
  const b=battle(new Rapidash(),copied);b.player.marker.addMarker((b.source as Rapidash).HEAT_BOOST_MARKER,b.owner);b.store.reduceEffect(b.state,b.attack);expect(b.attack.damage).toBe(copied?60:90);
 });
});

describe('legacy ownership actual actions',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 for(const copied of [false,true])for(const [name,attack,energy,expected] of [
  ['Tapu Lele-GX GRI','Energy Drive',['Water Energy SVE','Psychic Energy SVE'],60],
  ['Swampert CES','Hydro Pump',['Water Energy SVE','Water Energy SVE','Psychic Energy SVE'],120],
  ['Shining Genesect SLG','Gaia Blaster',['Grass Energy SVE','Grass Energy SVE','Psychic Energy SVE'],90],
  ['Rapidash SIT','Fire Mane',['Fire Energy SVE','Psychic Energy SVE'],60]
 ] as Array<[string,string,string[],number]>)it(name+' actual attack copied='+copied,()=>{
   const g=setupGame({turn:4,player1:{active:{card:copied?'Mew ex 30C':name,energy},bench:copied?[{card:name},{card:'Charmander BS'}]:[{card:'Charmander BS'}],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW',energy:['Grass Energy SVE']},deck:padDeck(12)}});
   const defender=g.player2.active.getPokemonCard()!;defender.hp=1000;defender.weakness=[];defender.resistance=[];
   if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,attack);
   expect(g.player2.active.damage).toBe(expected);
 });
 for(const copied of [false,true])for(const heads of [false,true])it('Eevee actual Quick Draw copied='+copied+' heads='+heads,()=>{
  const g=setupGame({turn:4,player1:{active:{card:copied?'Mew ex 30C':'Eevee SUM',energy:['Fire Energy SVE']},bench:copied?[{card:'Eevee SUM'}]:[],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}});
  const before=g.player1.hand.cards.length;g.overridePrompt('Coin flip',()=>heads);if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:'Quick Draw'}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,'Quick Draw');expect(g.player1.hand.cards.length).toBe(before+(heads?1:0));
 });
 for(const copied of [false,true])it('Tapu Lele alternate print preserves Energy Drive copied='+copied,()=>{
  const b=battle(new TapuLeleGXHIF(),copied),name=b.source.fullName;b.player.active.cards.push(new TestEnergy(CardType.WATER));b.opponent.active.cards.push(new TestEnergy(CardType.GRASS));b.store.reduceEffect(b.state,b.attack);expect(b.attack.damage).toBe(40);expect(b.source.fullName).toBe(name);
 });
});

describe('physical source abilities remain independent',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 it('Rapidash Heat Boost from the actual Bench source still affects the copied attack once',()=>{
  const g=setupGame({turn:4,player1:{active:{card:'Mew ex 30C',energy:['Fire Energy SVE','Psychic Energy SVE']},bench:[{card:'Rapidash SIT'}],hand:['Fire Energy SVE'],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}});
  const source=g.player1.bench[0].getPokemonCard() as Rapidash;g.player2.active.getPokemonCard()!.hp=1000;g.player2.active.getPokemonCard()!.weakness=[];g.player2.active.getPokemonCard()!.resistance=[];
  g.overridePrompt('Choose cards',()=>[0]);useAbility(g.store,g.state,0,'Heat Boost');expect(g.player1.marker.hasMarker(source.HEAT_BOOST_MARKER,source)).toBe(true);
  g.overridePrompt('Choose attack',()=>({index:0,attack:'Fire Mane'}));useAbility(g.store,g.state,0,'Memory Helix');expect(g.player2.active.damage).toBe(90);
 });
});
