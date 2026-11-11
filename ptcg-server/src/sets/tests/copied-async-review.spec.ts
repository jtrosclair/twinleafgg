import { PokemonCard } from '../../game/store/card/pokemon-card';
import { State, GamePhase } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Store } from '../../game/store/store';
import { AttackEffect, MoveCardsEffect } from '../../game/store/effects/game-effects';
import { EnergyCard } from '../../game/store/card/energy-card';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { CoinFlipEffect, CoinFlipSequenceEffect } from '../../game/store/effects/play-card-effects';
import { Effect } from '../../game/store/effects/effect';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { cloneAttacks, openCopyAttackSession, clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { Cosmog } from '../set-celebrations/cosmog';
import { Dugtrio } from '../set-chilling-reign/dugtrio';
import { Sudowoodo } from '../set-breakpoint/sudowoodo';
import { Dusclops } from '../set-boundaries-crossed/dusclops';
import { Mewex } from '../set-30th-celebration/mew-ex';
class FixtureEnergy extends EnergyCard {public name='Fixture Energy';public fullName='Fixture Energy TEST';public set='TEST';}
class MoveObserver extends TrainerCard {
 public name='Move Observer';public fullName='Move Observer TEST';public set='TEST';public trainerType=TrainerType.STADIUM;
 public expected:unknown;public sawCorrect=false;
 public reduceEffect(_store:any,state:State,effect:Effect):State {
  if(effect instanceof MoveCardsEffect) this.sawCorrect=effect.sourceEffect===this.expected;
  return state;
 }
}
class ReplacingObserver extends PokemonCard {
 public name:string;public fullName='Replacing Observer TEST';public set='TEST';
 constructor(name:string){super();this.name=name;}
 public reduceEffect(_store:any,state:State,effect:Effect):State {
  if(effect instanceof CoinFlipEffect && effect.callback){const previous=effect.callback;effect.callback=result=>{
   ((state as any).observers ||= []).push(this.name);previous(result);
  };}
  return state;
 }
}
let sharedSequence: CoinFlipSequenceEffect;
class SharedSequenceSource extends PokemonCard {
 public name='Sequence Source';public fullName='Sequence Source TEST';public set='TEST';
 public attacks=[{name:'Sequence',cost:[],damage:0,text:''}];
 public reduceEffect(store:any,state:State,effect:Effect):State {
  if(effect instanceof AttackEffect && effect.attack===this.attacks[0]) return store.reduceEffect(state,sharedSequence);
  return state;
 }
}
function battle(source:PokemonCard) {
 const state=new State(),player=new Player(),opponent=new Player(),mew=new Mewex();
 state.players=[player,opponent];player.id=1;opponent.id=2;state.turn=2;state.activePlayer=0;state.phase=GamePhase.ATTACK;
 player.active.cards=[mew];const bench=new PokemonCardList();bench.cards=[source];player.bench=[bench];opponent.active.cards=[new Cosmog()];
 const store=new Store({onStateChange:()=>undefined});store.state=state;
 const attacks=cloneAttacks(source.attacks);openCopyAttackSession(state,player,mew,source,attacks,attacks[0]);
 return {state,player,opponent,mew,store,attack:new AttackEffect(player,opponent,attacks[0])};
}
function resolve(b:ReturnType<typeof battle>,result:any) {
 const p=b.state.prompts.filter(x=>x.result===undefined).pop();if(!p)throw new Error('missing prompt');
 (b.store as any).reducePrompt(b.state,new ResolvePromptAction(p.id,result));
}
describe('copied callback edge review',()=>{
 beforeEach(()=>{clearCopyAttackSessionsForTests();spyOn(Math,'random').and.returnValue(0);});
 it('restores real copycat context after a synchronous coin callback',()=>{
  const source=new Cosmog(),b=battle(source),original=b.mew.attacks;
  const reduce=b.store.reduceEffect.bind(b.store);
  spyOn(b.store,'reduceEffect').and.callFake((state:State,effect:Effect)=>{
    if(effect instanceof CoinFlipEffect){effect.result=true;effect.callback!(true);return state;}
    return reduce(state,effect);
  });
  b.store.reduceEffect(b.state,b.attack);
  expect(b.player.active.marker.hasMarker(source.STAR_PROTECTION_MARKER,b.mew)).toBe(true);
  expect(b.mew.attacks).toBe(original);expect((b.mew as any).STAR_PROTECTION_MARKER).toBeUndefined();
 });
 it('isolates a reused multi-coin effect across interleaved copy sessions',()=>{
  const a=battle(new SharedSequenceSource()),b=battle(new SharedSequenceSource()),seen:string[]=[];
  const callback=()=>{seen.push(`${a.mew.attacks[0]===a.attack.attack}/${b.mew.attacks[0]===b.attack.attack}`);};
  sharedSequence=new CoinFlipSequenceEffect(a.player,2,callback);
  a.store.reduceEffect(a.state,a.attack);b.store.reduceEffect(b.state,b.attack);expect(sharedSequence.callback).toBe(callback);
  resolve(a,null);resolve(b,null);resolve(b,null);resolve(a,null);
  expect(seen).toEqual(['false/true','true/false']);expect(sharedSequence.callback).toBe(callback);
 });
 it('composes callback reassignments from two observers exactly once each',()=>{
  const source=new Cosmog(),b=battle(source);
  for(const name of ['Observer A','Observer B']){const slot=new PokemonCardList();slot.cards=[new ReplacingObserver(name)];b.player.bench.push(slot);}
  b.store.reduceEffect(b.state,b.attack);resolve(b,null);
  expect(((b.state as any).observers as string[]).sort()).toEqual(['Observer A','Observer B']);
  expect(b.player.active.marker.hasMarker(source.STAR_PROTECTION_MARKER,b.mew)).toBe(true);
 });
 it('keeps Dusclops generator sourceEffect identity through two nested real prompts',()=>{
  const b=battle(new Dusclops()),energy=new FixtureEnergy(),observer=new MoveObserver();
  b.opponent.hand.cards=[energy];b.opponent.stadium.cards=[observer];observer.expected=b.attack.attack;
  b.store.reduceEffect(b.state,b.attack);resolve(b,[energy]);resolve(b,null);
  expect(observer.sawCorrect).toBe(true);expect(b.opponent.deck.cards).toContain(energy);
 });
 it('retains damage when Sudowoodo copies an opponent attack through a nested multi-coin continuation',()=>{
  const b=battle(new Sudowoodo()),dugtrio=new Dugtrio(), original=b.mew.attacks;
  b.opponent.active.cards=[dugtrio];b.state.playerLastAttack[b.opponent.id]={attack:dugtrio.attacks[0],sourceCard:dugtrio};
  b.store.reduceEffect(b.state,b.attack);resolve(b,null);resolve(b,null);resolve(b,null);
  expect(b.opponent.active.damage).toBe(180);expect(b.mew.attacks).toBe(original);
  expect(b.state.prompts.filter(p=>p.result===undefined).length).toBe(0);
 });
});
