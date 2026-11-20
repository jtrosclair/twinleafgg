import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { registerKnockOutDeckSearch } from '../../game/store/prefabs/knock-out-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Gengar extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Haunter';
  public cardType: CardType = P;
  public hp: number = 130;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Last Gift',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is Knocked Out by damage from an attack from your opponent\'s Pokémon, search your deck for up to 2 cards and put them into your hand. Then, shuffle your deck.'
  }];

  public attacks = [{
    name: 'Pain Burst',
    cost: [C, C, C],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 40 more damage for each damage counter on your opponent\'s Active Pokémon.'
  }];

  public set: string = 'CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '57';
  public name: string = 'Gengar';
  public fullName: string = 'Gengar CRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-fusion-strike/farewell-bell.ts (search before Knock Out discard)
    registerKnockOutDeckSearch(store, state, effect, this, 2);

    // Pain Burst
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      effect.damage += 4 * opponent.active.damage;
    }

    return state;
  }
}