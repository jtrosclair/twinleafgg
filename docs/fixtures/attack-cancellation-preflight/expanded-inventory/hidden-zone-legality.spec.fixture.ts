import { ensureClientCards } from '../../client/cards';
import { setupGame, padDeck } from './test-helpers';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CobalionGX } from '../set-team-up/cobalion-gx';

describe('native Iron Rule source in hidden zones',()=>{
 beforeAll(()=>ensureClientCards());
 for(const zone of ['hand','discard','deck','prize'] as const)it('still rejects an attack when its source is in '+zone,()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Mew ex MEW'},hand:['Cobalion-GX TEU'],deck:padDeck(10)},player2:{active:{card:'Charmander BS'},deck:padDeck(10)}});
  const source=g.player1.hand.cards[0] as CobalionGX;
  const destination=zone==='hand'?g.player1.hand:zone==='discard'?g.player1.discard:zone==='deck'?g.player1.deck:g.player1.prizes[0];
  if(zone!=='hand')g.player1.hand.moveCardTo(source,destination);
  g.player2.marker.addMarker(source.IRON_RULE_MARKER,source);g.state.activePlayer=1;
  const attack=new AttackEffect(g.player2,g.player1,g.player2.active.getPokemonCard()!.attacks[0]);let message='none';
  try{g.store.reduceEffect(g.state,attack)}catch(error:any){message=error.message||String(error)}
  expect(destination.cards).toContain(source);expect(message).toBe('BLOCKED_BY_EFFECT');
 });
});
