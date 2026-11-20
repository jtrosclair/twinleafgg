import { PokemonCard, Stage, CardType, PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { canUseKnockOutAbility, registerKnockOutRescue } from '../../game/store/prefabs/knock-out-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Gengar extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Haunter';
  public cardType: CardType = D;
  public hp: number = 130;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Infinite Shadow',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is Knocked Out by damage from an attack from your opponent\'s Pokémon, put it into your hand instead of the discard pile. (Discard all cards attached to it.)'
  }];

  public attacks = [{
    name: 'Mind Jack',
    cost: [D],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 30 more damage for each of your opponent\'s Benched Pokemon.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public usSetNumber = 'POR 50';
  public name: string = 'Gengar';
  public fullName: string = 'Gengar M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-unified-minds/aegislash.ts (return the evolution stack before Prizes)
    if (canUseKnockOutAbility(store, state, effect, this) && effect.resolveBeforeDiscard) {
      registerKnockOutRescue(store, state, effect, this);
    }

    // Mind Jack - damage based on opponent's benched Pokemon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      const benchCount = opponent.bench.filter(bench => bench.cards.length > 0).length;
      effect.damage = 10 + (benchCount * 30);
    }

    return state;
  }
}
