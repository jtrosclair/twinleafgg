import { Bouffalant } from '../set-stellar-crown/bouffalant';
import { UseAttackEffect } from '../../game/store/effects/game-effects';
import { setupGame, padDeck } from './test-helpers';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
describe('Boundless Power uses the actual attack source slot',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 it('restricts an explicit bench-origin delegated user rather than the Active Pokemon',()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Charmander BS'},bench:[{card:'Mew ex 30C',energy:['Fire Energy SVE','Fire Energy SVE','Fire Energy SVE']}],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}});
  const target=g.player2.active.getPokemonCard()!;target.hp=1000;target.weakness=[];target.resistance=[];
  const source=new Bouffalant(),bench=g.player1.bench[0],active=g.player1.active;
  const action=new UseAttackEffect(g.player1,source.attacks[0]);action.delegateFrom=source;action.source=bench;
  g.store.reduceEffect(g.state,action);
  expect(g.player2.active.damage).toBe(130);
  expect(bench.cannotAttackNextTurn||bench.cannotAttackNextTurnPending).toBe(true);
  expect(active.cannotAttackNextTurn||active.cannotAttackNextTurnPending).toBe(false);
 });
});
