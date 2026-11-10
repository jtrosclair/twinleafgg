import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { Player } from '../../game/store/state/player';
import { CardList } from '../../game/store/state/card-list';
import { State, GamePhase, GameWinner } from '../../game/store/state/state';
import { GameMessage } from '../../game/game-message';
import { Rules } from '../../game/store/state/rules';
import { Store } from '../../game/store/store';
import { Effect } from '../../game/store/effects/effect';
import { BetweenTurnsEffect, AfterBetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { betweenTurns, initNextTurn } from '../../game/store/effect-reducers/game-phase-effect';
import { GenericSerializer } from '../../game/serializer/generic.serializer';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { compactSerializedState } from '../../game/serializer/compact-state';
import { WelaVolcanoPark } from '../set-dragons-majesty/wela-volcano-park';
import { FullFlame } from '../set-ex-legend-maker/full-flame';
import { Centiskorch } from '../set-battle-styles/centiskorch';
class Body extends PokemonCard {public name='Test';public fullName='Test TST';public set='TST';public stage=Stage.BASIC;public hp=100;}
class ForcePersistence extends PokemonCard {
 public name='Override';public fullName='Override TST';public set='TST';public stage=Stage.BASIC;public hp=100;
 constructor(public value:boolean){super();}
 public reduceEffect(_store:any,state:State,effect:Effect):State {if(effect instanceof BetweenTurnsEffect&&effect.player.id===1)effect.burnFlipResult=this.value;return state;}
}
function setup(old?:boolean,card?:PokemonCard,stadium?:any,deckOut=false,alsoAsleep=false){
 const state=new State(),p=new Player(),o=new Player();p.id=1;o.id=2;p.name='P1';o.name='P2';state.players=[p,o];state.turn=3;state.phase=GamePhase.PLAYER_TURN;
 p.active.cards=[new Body()];o.active.cards=[new Body()];p.prizes=[new CardList()];o.prizes=[new CardList()];p.prizes[0].cards=[new Body()];o.prizes[0].cards=[new Body()];p.deck.cards=[new Body()];o.deck.cards=deckOut?[]:[new Body()];
 if(old!==undefined)state.rules.oldBurnRule=old;if(card){const slot=new (p.active.constructor as any)();slot.cards=[card];o.bench=[slot];}if(stadium)p.stadium.cards=[stadium];p.active.addSpecialCondition(SpecialCondition.BURNED);if(alsoAsleep)p.active.addSpecialCondition(SpecialCondition.ASLEEP);
 const events:string[]=[];const store=new Store({onStateChange:()=>{}});store.state=state;
 const original=store.reduceEffect.bind(store);spyOn(store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof AfterBetweenTurnsEffect&&e.player===p)events.push('after:'+p.active.damage);return original(s,e)});
 let completed=false;betweenTurns(store,state,()=>{completed=true;events.push('complete');if(deckOut)initNextTurn(store,state)});
 const burnPrompt=()=>state.prompts.find(x=>x instanceof CoinFlipPrompt&&x.playerId===p.id&&x.result===undefined);
 const flip=(heads:boolean)=>{const q=burnPrompt();expect(q).toBeDefined();store.dispatch(new ResolvePromptAction(q!.id,heads));};
 return {state,p,o,store,events,burnPrompt,flip,isCompleted:()=>completed};
}
describe('optional retro burn and unchanged snapshots',()=>{
 it('does not add a Rules field to legacy or compact snapshots',()=>{
  const rules=new Rules();expect(Object.prototype.hasOwnProperty.call(rules,'oldBurnRule')).toBe(false);
  const wire=new GenericSerializer(Rules,'Rules').serialize(rules) as any;expect(Object.prototype.hasOwnProperty.call(wire,'oldBurnRule')).toBe(false);
  expect(JSON.stringify(wire)).toBe('{"_type":"Rules","firstTurnDrawCard":true,"firstTurnUseSupporter":true,"attackFirstTurn":false,"supporterCleanupAtEndTurn":false,"unlimitedEnergyAttachments":false,"alternativeSetup":false}');
  rules.oldBurnRule=true;const enabled=new GenericSerializer(Rules,'Rules').serialize(rules) as any;expect(enabled.oldBurnRule).toBe(true);
 });
 it('round-trips explicit retro true and false while legacy omission remains omitted',()=>{
  const codec=new StateSerializer();
  for(const value of [undefined,true,false]) {
   const state=new State();if(value!==undefined)state.rules.oldBurnRule=value;
   const wire=codec.serialize(state),compact=compactSerializedState(wire),restored=codec.deserialize(compact);
   expect(restored.rules.oldBurnRule).toBe(value);
   const rules=JSON.parse(compact)[1].rules;expect(Object.prototype.hasOwnProperty.call(rules,'oldBurnRule')).toBe(value!==undefined);
  }
 });
 for(const heads of [true,false])it(`old rule waits for ${heads?'heads':'tails'}, applies ${heads?0:20}, and remains burned`,()=>{
  const b=setup(true);expect(b.p.active.damage).toBe(0);expect(b.isCompleted()).toBe(false);expect(b.events).toEqual([]);b.flip(heads);
  expect(b.p.active.damage).toBe(heads?0:20);expect(b.p.active.specialConditions).toContain(SpecialCondition.BURNED);
  expect(b.events).toEqual(['after:'+(heads?0:20),'complete']);expect(b.isCompleted()).toBe(true);
 });
 for(const heads of [true,false])it(`default modern burn keeps current behavior on ${heads?'heads':'tails'}`,()=>{
  const b=setup();expect(b.p.active.damage).toBe(20);b.flip(heads);expect(b.p.active.damage).toBe(20);
  expect(b.p.active.specialConditions.includes(SpecialCondition.BURNED)).toBe(!heads);
 });
 for(const fixed of [true,false])it(`default modern burn preserves existing fixed ${fixed} recovery override`,()=>{
  const b=setup(undefined,new ForcePersistence(fixed));expect(b.burnPrompt()).toBeUndefined();expect(b.p.active.damage).toBe(fixed?20:40);
  expect(b.p.active.specialConditions).toContain(SpecialCondition.BURNED);expect(b.isCompleted()).toBe(true);
 });
 for(const stadium of [new WelaVolcanoPark(),new FullFlame()])for(const heads of [true,false])it(`retro ${stadium.name} still flips ${heads?'heads':'tails'}`,()=>{
  const b=setup(true,undefined,stadium);expect(b.burnPrompt()).toBeDefined();b.flip(heads);expect(b.p.active.specialConditions).toContain(SpecialCondition.BURNED);
  expect(b.p.active.damage).toBe(heads?0:stadium instanceof FullFlame?40:20);
 });
 it('retro Centiskorch suppression of burn recovery does not suppress the damage flip',()=>{
  const b=setup(true,new Centiskorch());expect(b.burnPrompt()).toBeDefined();b.flip(false);expect(b.p.active.damage).toBe(20);expect(b.p.active.specialConditions).toContain(SpecialCondition.BURNED);
 });
 it('waits for both sleep and retro burn flips before after-checkup and next turn',()=>{
  const b=setup(true,undefined,undefined,false,true);
  const sleep=b.state.prompts.find(q=>q instanceof CoinFlipPrompt && q.message===GameMessage.FLIP_ASLEEP)!;
  const burn=b.state.prompts.find(q=>q instanceof CoinFlipPrompt && q.message===GameMessage.FLIP_BURNED)!;
  expect(sleep).toBeDefined();expect(burn).toBeDefined();b.store.dispatch(new ResolvePromptAction(sleep.id,true));
  expect(b.isCompleted()).toBe(false);expect(b.events).toEqual([]);b.store.dispatch(new ResolvePromptAction(burn.id,false));
  expect(b.isCompleted()).toBe(true);expect(b.events).toEqual(['after:20','complete']);
  expect(b.p.active.specialConditions).toContain(SpecialCondition.BURNED);expect(b.p.active.specialConditions).not.toContain(SpecialCondition.ASLEEP);
 });
 it('default Wela still keeps Burn without an additional flip',()=>{
  const b=setup(undefined,undefined,new WelaVolcanoPark());expect(b.burnPrompt()).toBeUndefined();
  expect(b.p.active.damage).toBe(20);expect(b.p.active.specialConditions).toContain(SpecialCondition.BURNED);
 });
 it('waits for the old burn coin before checking opponent deck-out',()=>{
  const b=setup(true,undefined,undefined,true);expect(b.state.phase).toBe(GamePhase.BETWEEN_TURNS);expect(b.state.winner).toBe(GameWinner.NONE);
  b.flip(true);expect(b.state.phase).toBe(GamePhase.FINISHED);expect(b.state.winner).toBe(GameWinner.PLAYER_1);
 });
 it('processes a lethal retro burn before the opponent deck-out',()=>{
  const b=setup(true,undefined,undefined,true);b.p.active.damage=80;b.flip(false);
  expect(b.state.phase).toBe(GamePhase.FINISHED);expect(b.state.winner).toBe(GameWinner.PLAYER_2);
 });
 it('does not damage a replacement put into the same active slot while the coin is pending',()=>{
  const b=setup(true),old=b.p.active.getPokemonCard()!;b.p.active.cards=[new Body()];b.flip(false);expect(b.p.active.getPokemonCard()).not.toBe(old);expect(b.p.active.damage).toBe(0);
 });
});
