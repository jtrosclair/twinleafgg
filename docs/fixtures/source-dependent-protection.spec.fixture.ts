// Research fixture: copy to ptcg-server/src/sets/tests/source-dependent-protection.spec.ts.
// These deliberately adversarial reducers are valid Store participants; they
// demonstrate why cache keys and purity guarantees cannot be assumed.
import { CardTag, CardType, PokemonCard, PowerType, Stage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAbilityEffect } from '../../game/store/effects/game-effects';
import { State } from '../../game/store/state/state';
import { AerodactylVstar } from '../set-lost-origin/aerodactyl-vstar';
import { padDeck, setupGame } from './test-helpers';

class TargetV extends PokemonCard {
  public name = 'Target V'; public fullName = 'Target V Test'; public set = 'TEST';
  public stage = Stage.BASIC; public cardType = CardType.FIRE; public hp = 100;
  public tags = [CardTag.POKEMON_V];
}
function setup() {
  const g = setupGame({turn: 3,
    player1: {active: {card: 'Pikachu BS'}, deck: padDeck(10)},
    player2: {active: {card: 'Mew ex MEW'}, deck: padDeck(10)}});
  const first = new AerodactylVstar(); const second = new AerodactylVstar();
  const target = new TargetV();
  g.player1.active.cards = [first]; g.player1.bench[0].cards = [second];
  g.player2.active.cards = [target];
  return {g, first, second};
}
const power = () => ({name: 'Ancient Star', powerType: PowerType.ABILITY, text: ''});

it('can protect from one exact source while allowing an identical other source', () => {
  const {g, first, second} = setup();
  class Shield extends PokemonCard {
    public name='Source shield'; public fullName='Source shield TEST'; public set='TEST';
    public reduceEffect(_store: any, state: State, effect: Effect): State {
      if (effect instanceof EffectOfAbilityEffect && effect.card === first) effect.target = undefined;
      return state;
    }
  }
  g.player2.bench[0].cards = [new Shield()];
  const a = new EffectOfAbilityEffect(g.player1, power(), first, g.player2.active);
  const b = new EffectOfAbilityEffect(g.player1, power(), second, g.player2.active);
  g.store.reduceEffect(g.state, a); g.store.reduceEffect(g.state, b);
  expect(a.target).toBeUndefined(); expect(b.target).toBe(g.player2.active);
});

it('can change its answer and perform an observable side effect between queries', () => {
  const {g, first} = setup(); let invocations = 0;
  class OneUseShield extends PokemonCard {
    public name='One use shield'; public fullName='One use shield TEST'; public set='TEST';
    public reduceEffect(_store: any, state: State, effect: Effect): State {
      if (effect instanceof EffectOfAbilityEffect && effect.card === first && ++invocations === 1) {
        effect.target = undefined;
      }
      return state;
    }
  }
  g.player2.bench[0].cards = [new OneUseShield()];
  const a = new EffectOfAbilityEffect(g.player1, power(), first, g.player2.active);
  const b = new EffectOfAbilityEffect(g.player1, power(), first, g.player2.active);
  g.store.reduceEffect(g.state, a); g.store.reduceEffect(g.state, b);
  expect(a.target).toBeUndefined(); expect(b.target).toBe(g.player2.active);
  expect(invocations).toBe(2);
});
