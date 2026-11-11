import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';

describe('queued attack damage and a reused target slot',()=>{
  it('does not damage a replacement Pokemon occupying the selected slot',()=>{
    const g=setupGame({turn:2,
      player1:{active:{card:'Buzzwole-GX CIN',energy:['Fighting Energy SVE']},deck:padDeck(10)},
      player2:{active:{card:'Sceptile CES'},bench:[{card:'Mew ex MEW'}],deck:padDeck(10)}});
    const slot=g.player2.bench[0], original=slot.getPokemonCard()!, replacement=getCardByName('Charmander BS');
    const reduce=g.store.reduceEffect.bind(g.store);let replaced=false;
    spyOn(g.store,'reduceEffect').and.callFake((state:State,effect:Effect)=>{
      if(!replaced&&effect instanceof PutDamageEffect&&effect.target===slot){
        replaced=true;slot.moveTo(g.player2.hand);slot.clearEffects();slot.damage=0;slot.cards=[replacement];
      }
      return reduce(state,effect);
    });
    useAttack(g.store,g.state,0,'Jet Punch');
    expect(replaced).toBe(true);expect(g.player2.hand.cards).toContain(original);expect(slot.getPokemonCard()).toBe(replacement);
    expect(slot.damage).toBe(0);
  });
});
