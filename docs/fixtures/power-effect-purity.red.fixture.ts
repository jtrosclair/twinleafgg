// Diagnostic only: copy into an isolated ptcg-server/src/sets/tests/ checkout
// as power-effect-purity.red.spec.ts. This deliberately fails until legacy
// Ability suppression can be queried without fan-out to unrelated handlers.
import { CardType, PokemonCard, Stage } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { Store } from '../../game/store/store';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { deepClone } from '../../utils/utils';
import { Goodra } from '../set-fusion-strike/goodra';
import { padDeck, setupGame } from './test-helpers';

it('does not leak unrelated PowerEffect observer side effects from a cloned suppression query',()=>{
 const g=setupGame({turn:3,player1:{active:{card:'Pikachu BS'},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
 let calls=0;
 class Observer extends PokemonCard {
  public stage=Stage.BASIC;public cardType=CardType.PSYCHIC;public hp=100;public name='Observer';public fullName='Observer Test';public set='TEST';
  public reduceEffect(_store:StoreLike,state:State,effect:Effect):State {if(effect instanceof PowerEffect)calls++;return state;}
 }
 const source=new Goodra();g.player2.active.cards=[source];g.player1.bench[0].cards=[new Observer()];
 const refs:{s:Object;d:Object}[]=[];const state=deepClone(g.state,[],refs) as State;
 const find=<T extends Object>(original:T):T=>refs.find(entry=>entry.s===original)!.d as T;
 const store=new Store({onStateChange:()=>undefined});store.state=state;
 try { expect(IS_ABILITY_BLOCKED(store,state,find(g.player2),find(source))).toBe(false);expect(calls).toBe(0); }
 finally {store.cleanup();}
});
