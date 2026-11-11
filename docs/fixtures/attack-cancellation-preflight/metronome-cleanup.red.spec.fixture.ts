import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { State } from '../../game/store/state/state';
import { padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';

describe('cancelled attack lifecycle research', () => {
  it('preserves AfterAttackEffect listeners and the engine rearm cleanup', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Charmander BS',energy:['Water Energy SVE']},deck:padDeck(10)},
      player2:{active:{card:'Mew V FST'},bench:[{card:'Sandshrew BS'}],deck:padDeck(10)}});
    g.player1.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,g.player2.bench[0].getPokemonCard()!);
    // Synthetic pre-existing flag exposes the core cleanup performed for every AfterAttackEffect.
    const slot=g.player2.active;slot.defendingPokemonExtraDamageRearmAfterAttack=true;slot.defendingPokemonExtraDamagePending=false;
    let observed=false, clean=false;const reduce=g.store.reduceEffect.bind(g.store);
    spyOn(g.store,'reduceEffect').and.callFake((s:State,e:any)=>{const result=reduce(s,e);if(e instanceof AfterAttackEffect){observed=true;clean=!slot.defendingPokemonExtraDamageRearmAfterAttack&&slot.defendingPokemonExtraDamagePending;}return result;});
    g.overridePrompt('Coin flip',()=>false);useAttack(g.store,g.state,0,'Scratch');
    expect(observed).toBe(true);expect(clean).toBe(true);
  });
});
