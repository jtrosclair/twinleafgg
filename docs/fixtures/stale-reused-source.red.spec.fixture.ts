import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';

describe('queued attack damage and a reused attacking slot',()=>{
  it('preserves the original Ultra Beast attribution after the attacker is replaced',()=>{
    const g=setupGame({turn:2,
      player1:{active:{card:'Buzzwole-GX CIN',energy:['Fighting Energy SVE']},deck:padDeck(10)},
      player2:{active:{card:'Sceptile CES'},bench:[{card:'Mew ex MEW',energy:['Grass Energy SVE']}],deck:padDeck(10)}});
    const target=g.player2.bench[0],source=g.player1.active,original=source.getPokemonCard()!,replacement=getCardByName('Charmander BS');
    const reduce=g.store.reduceEffect.bind(g.store);let replaced=false;
    spyOn(g.store,'reduceEffect').and.callFake((state:State,effect:Effect)=>{
      if(!replaced&&effect instanceof PutDamageEffect&&effect.target===target){
        replaced=true;source.moveTo(g.player1.discard);source.clearEffects();source.damage=0;source.cards=[replacement];
      }
      return reduce(state,effect);
    });
    useAttack(g.store,g.state,0,'Jet Punch');
    expect(replaced).toBe(true);expect(g.player1.discard.cards).toContain(original);expect(source.getPokemonCard()).toBe(replacement);
    expect(target.damage).toBe(0);
  });
});
