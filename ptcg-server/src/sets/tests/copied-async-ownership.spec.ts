import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType } from '../../game/store/card/card-types';
import { State, GamePhase } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Store } from '../../game/store/store';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { StoreLike } from '../../game/store/store-like';
import { cloneAttacks, openCopyAttackSession, clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { Cosmog } from '../set-celebrations/cosmog';
import { Dugtrio } from '../set-chilling-reign/dugtrio';
import { GlimwoodTangle } from '../set-darkness-ablaze/glimwood-tangle';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { HisuianGrowlithe } from '../set-astral-radiance/hisuian-growlithe';
import { Mewex } from '../set-30th-celebration/mew-ex';

class AsyncSource extends PokemonCard {
  public name='Async Source';public fullName='Async Source TEST';public set='TEST';
  public readonly ASYNC_MARKER: string='ASYNC_FIXTURE_MARKER';
  public attacks=[{name:'Async Choice',cost:[],damage:0,text:''}];
  public reduceEffect(store:StoreLike,state:State,effect:Effect):State {
    if(effect instanceof AttackEffect && effect.attack===this.attacks[0]) {
      return store.prompt(state,new ConfirmPrompt(effect.player.id,GameMessage.WANT_TO_USE_ABILITY), first=>{
        if(!first)return;
        store.prompt(state,new ConfirmPrompt(effect.player.id,GameMessage.WANT_TO_USE_ABILITY), second=>{
          if (this.ASYNC_MARKER === 'THROWING_MARKER') throw new Error('fixture callback failure');
          if(second && this.attacks[0]===effect.attack) effect.player.active.marker.addMarker(this.ASYNC_MARKER,this);
        });
      });
    }
    return state;
  }
}
let sharedCoin: CoinFlipEffect;
class SharedCoinSource extends PokemonCard {
  public name='Shared Coin Source';public fullName='Shared Coin Source TEST';public set='TEST';
  public attacks=[{name:'Shared Coin',cost:[],damage:0,text:''}];
  public reduceEffect(store:StoreLike,state:State,effect:Effect):State {
    if(effect instanceof AttackEffect && effect.attack===this.attacks[0]) return store.reduceEffect(state,sharedCoin);
    return state;
  }
}
class CoinObserver extends TrainerCard {
 public name='Coin Observer';public fullName='Coin Observer TEST';public set='TEST';public trainerType=TrainerType.STADIUM;
 public reduceEffect(_store:StoreLike,state:State,effect:Effect):State {
  if(effect instanceof CoinFlipEffect && effect.callback) {
   const previous=effect.callback;effect.callback=result=>{(state as any).observerCalls=((state as any).observerCalls || 0)+1;previous(result);};
  }
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
describe('copied attack asynchronous callback ownership',()=>{
 beforeEach(()=>{clearCopyAttackSessionsForTests();spyOn(Math,'random').and.returnValue(0);});
 for(const [label,source,marker] of [
  ['Cosmog',new Cosmog(),'STAR_PROTECTION_MARKER'],
  ['Hisuian Growlithe',new HisuianGrowlithe(),'PREVENT_DAMAGE_MARKER']
 ] as Array<[string,PokemonCard,string]>) it('preserves '+label+' coin-flip defense after the delayed callback',()=>{
   const b=battle(source),attack=b.mew.attacks;b.store.reduceEffect(b.state,b.attack);
   expect(b.mew.attacks).toBe(attack);expect((b.mew as any)[marker]).toBeUndefined();
   resolve(b,null);expect(b.player.active.marker.hasMarker((source as any)[marker],b.mew)).toBe(true);
   expect(b.mew.attacks).toBe(attack);expect((b.mew as any)[marker]).toBeUndefined();
   b.state.activePlayer=1; const hit=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:70,text:''});
   b.store.reduceEffect(b.state,new DealDamageEffect(hit,70));expect(b.player.active.damage).toBe(0);
 });
 it('preserves a shared coin effect callback and isolates pending dispatches',()=>{
  const a=battle(new SharedCoinSource()),b=battle(new SharedCoinSource()),seen:string[]=[];
  const callback=()=>{seen.push(`${a.mew.attacks[0]===a.attack.attack}/${b.mew.attacks[0]===b.attack.attack}`);};
  sharedCoin=new CoinFlipEffect(a.player,callback);
  a.store.reduceEffect(a.state,a.attack);b.store.reduceEffect(b.state,b.attack);
  expect(sharedCoin.callback).toBe(callback);expect(sharedCoin.result).toBe(true);
  resolve(b,null);expect(seen).toEqual(['false/true']);resolve(a,null);expect(seen).toEqual(['false/true','true/false']);
  expect(sharedCoin.callback).toBe(callback);
 });
 it('allows a coin observer to replace its per-dispatch callback',()=>{
  const b=battle(new SharedCoinSource());b.player.stadium.cards.push(new CoinObserver());let calls=0;
  const callback=()=>{calls++;};sharedCoin=new CoinFlipEffect(b.player,callback);
  b.store.reduceEffect(b.state,b.attack);expect(sharedCoin.callback).toBe(callback);resolve(b,null);
  expect((b.state as any).observerCalls).toBe(1);expect(calls).toBe(1);expect(sharedCoin.callback).toBe(callback);
 });
 for(const reflip of [false,true]) it('keeps copied Cosmog defense through Glimwood '+(reflip?'reflip':'decline'),()=>{
  const source=new Cosmog(),b=battle(source);b.player.stadium.cards.push(new GlimwoodTangle());
  if(reflip) (Math.random as jasmine.Spy).and.returnValues(0.99,0);
  b.store.reduceEffect(b.state,b.attack);resolve(b,null);resolve(b,reflip);if(reflip)resolve(b,null);
  expect(b.player.active.marker.hasMarker(source.STAR_PROTECTION_MARKER,b.mew)).toBe(true);
 });
 for(const reflip of [false,true]) it('keeps copied Dugtrio three-coin results through Glimwood '+(reflip?'reflip':'decline'),()=>{
  const source=new Dugtrio(),b=battle(source);b.player.stadium.cards.push(new GlimwoodTangle());
  b.store.reduceEffect(b.state,b.attack);resolve(b,null);resolve(b,null);resolve(b,null);resolve(b,reflip);
  if(reflip){resolve(b,null);resolve(b,null);resolve(b,null);}
  expect(b.attack.damage).toBe(180);expect(b.player.active.marker.hasMarker(source.PREVENT_MARKER,b.mew)).toBe(true);
 });
 it('keeps the copycat marker constants intact and does not defend on tails',()=>{
  const source=new Cosmog(),b=battle(source),mew=b.mew as any;
  mew.STAR_PROTECTION_MARKER='COPYCAT_OWN_MARKER';
  (Math.random as jasmine.Spy).and.returnValue(0.99);
  b.store.reduceEffect(b.state,b.attack);resolve(b,null);
  expect(mew.STAR_PROTECTION_MARKER).toBe('COPYCAT_OWN_MARKER');
  expect(b.player.active.marker.hasMarker(source.STAR_PROTECTION_MARKER,b.mew)).toBe(false);
  b.state.activePlayer=1;const hit=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:70,text:''});
  b.store.reduceEffect(b.state,new DealDamageEffect(hit,70));expect(b.player.active.damage).toBe(70);
 });
 it('keeps original copycat context visible to an unrelated event while a prompt is pending',()=>{
  const source=new AsyncSource(),b=battle(source),originalAttacks=b.mew.attacks;
  b.store.reduceEffect(b.state,b.attack);
  let checked=false;spyOn(b.mew,'reduceEffect').and.callFake((_store:StoreLike,state:State)=>{
   checked=true;expect(b.mew.attacks).toBe(originalAttacks);expect((b.mew as any).ASYNC_MARKER).toBeUndefined();return state;
  });
  b.store.reduceEffect(b.state,new CheckProvidedEnergyEffect(b.player));expect(checked).toBe(true);
  resolve(b,true);resolve(b,true);expect(b.player.active.marker.hasMarker(source.ASYNC_MARKER,b.mew)).toBe(true);
 });
 it('restores context when an asynchronous callback throws',()=>{
  const source=new AsyncSource();(source as any).ASYNC_MARKER='THROWING_MARKER';
  const b=battle(source),originalAttacks=b.mew.attacks;b.store.reduceEffect(b.state,b.attack);resolve(b,true);
  expect(()=>resolve(b,true)).toThrow();expect(b.mew.attacks).toBe(originalAttacks);expect((b.mew as any).ASYNC_MARKER).toBeUndefined();
 });
 it('keeps two pending copied attacks isolated when callbacks resolve out of order',()=>{
  const first=new AsyncSource(),second=new AsyncSource();(second as any).ASYNC_MARKER='SECOND_CONTEXT_MARKER';
  const a=battle(first),b=battle(second),firstAttacks=a.mew.attacks,secondAttacks=b.mew.attacks;
  a.store.reduceEffect(a.state,a.attack);b.store.reduceEffect(b.state,b.attack);
  expect((a.mew as any).ASYNC_MARKER).toBeUndefined();expect((b.mew as any).ASYNC_MARKER).toBeUndefined();
  resolve(a,true);resolve(b,true);
  expect(a.mew.attacks).toBe(firstAttacks);expect(b.mew.attacks).toBe(secondAttacks);
  resolve(b,true);expect(b.player.active.marker.hasMarker(second.ASYNC_MARKER,b.mew)).toBe(true);
  expect(a.player.active.marker.hasMarker(first.ASYNC_MARKER,a.mew)).toBe(false);
  expect((a.mew as any).ASYNC_MARKER).toBeUndefined();expect((b.mew as any).ASYNC_MARKER).toBeUndefined();
  resolve(a,true);expect(a.player.active.marker.hasMarker(first.ASYNC_MARKER,a.mew)).toBe(true);
  expect(a.player.active.marker.hasMarker(second.ASYNC_MARKER,a.mew)).toBe(false);
  expect(a.mew.attacks).toBe(firstAttacks);expect(b.mew.attacks).toBe(secondAttacks);
 });
 it('restores source attack and marker context around nested asynchronous choices only',()=>{
  const source=new AsyncSource(),b=battle(source),attack=b.mew.attacks;b.store.reduceEffect(b.state,b.attack);
  expect(b.mew.attacks).toBe(attack);resolve(b,true);expect(b.mew.attacks).toBe(attack);resolve(b,true);
  expect(b.player.active.marker.hasMarker(source.ASYNC_MARKER,b.mew)).toBe(true);
  expect(b.mew.attacks).toBe(attack);expect((b.mew as any).ASYNC_MARKER).toBeUndefined();
 });
});
