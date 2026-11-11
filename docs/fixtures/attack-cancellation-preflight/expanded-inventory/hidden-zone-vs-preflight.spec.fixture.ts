import { ensureClientCards } from '../../client/cards';
import { setupGame,padDeck } from './test-helpers';
import { CobalionGX } from '../set-team-up/cobalion-gx';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { AttackAction } from '../../game/store/actions/game-actions';

describe('hidden-zone Iron Rule legality precedes Sand Attack cancellation',()=>{
 beforeAll(()=>ensureClientCards());
 for(const zone of ['hand','discard','deck','prize'] as const)it('rejects without flipping when the source is in '+zone,()=>{
  const g=setupGame({turn:5,player1:{active:{card:'Charmander BS',energy:['Fire Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},bench:[{card:'Sandshrew BS'}],hand:['Cobalion-GX TEU'],deck:padDeck(10)}});
  const source=g.player2.hand.cards[0] as CobalionGX,target=zone==='hand'?g.player2.hand:zone==='discard'?g.player2.discard:zone==='deck'?g.player2.deck:g.player2.prizes[0];
  if(zone!=='hand')g.player2.hand.moveCardTo(source,target);
  g.player1.marker.addMarker(source.IRON_RULE_MARKER,source);
  g.player1.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,g.player2.bench[0].getPokemonCard()!);
  let flips=0;g.overridePrompt('Coin flip',()=>{flips++;return false});let result='success';
  try{g.store.dispatch(new AttackAction(g.player1.id,'Scratch'))}catch(error:any){result=error.message||String(error)}
  expect(result).toBe('BLOCKED_BY_EFFECT');expect(flips).toBe(0);expect(g.store.state.turn).toBe(5);
 });
});
