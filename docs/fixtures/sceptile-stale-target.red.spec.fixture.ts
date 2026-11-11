import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { State } from '../../game/store/state/state';
import { padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';

describe('Sceptile stale attack target regression',()=>{
  it('does not throw when Jet Punch damage targets a slot removed during a reaction',()=>{
    const g=setupGame({turn:2,
      player1:{active:{card:'Buzzwole-GX CIN',energy:['Fighting Energy SVE']},deck:padDeck(10)},
      player2:{active:{card:'Sceptile CES'},bench:[{card:'Mew ex MEW'}],deck:padDeck(10)}});
    const target=g.player2.bench[0],reduce=g.store.reduceEffect.bind(g.store);
    spyOn(g.store,'reduceEffect').and.callFake((state:State,effect:Effect)=>{
      if(effect instanceof PutDamageEffect&&effect.target===target) {
        const i=g.player2.bench.indexOf(target);if(i>=0)g.player2.bench.splice(i,1);
      }
      return reduce(state,effect);
    });
    expect(()=>useAttack(g.store,g.state,0,'Jet Punch')).not.toThrow();
  });
  it('does not throw when the attacking slot is removed during a reaction',()=>{
    const g=setupGame({turn:2,
      player1:{active:{card:'Buzzwole-GX CIN',energy:['Fighting Energy SVE']},deck:padDeck(10)},
      player2:{active:{card:'Sceptile CES'},bench:[{card:'Mew ex MEW'}],deck:padDeck(10)}});
    const target=g.player2.bench[0],attacker=g.player1.active,reduce=g.store.reduceEffect.bind(g.store);
    spyOn(g.store,'reduceEffect').and.callFake((state:State,effect:Effect)=>{
      if(effect instanceof PutDamageEffect&&effect.target===target && g.player1.active===attacker) {
        g.player1.active=new PokemonCardList();
      }
      return reduce(state,effect);
    });
    expect(()=>useAttack(g.store,g.state,0,'Jet Punch')).not.toThrow();
  });
});
