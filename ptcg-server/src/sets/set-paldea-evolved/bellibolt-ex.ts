import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';
import { OPTIONALLY_DISCARD_ATTACK_ENERGY } from '../../game/store/prefabs/costs';

export class Belliboltex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Tadbulb';
  public cardType: CardType = L;
  public hp: number = 280;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Jumping Press',
      cost: [C, C],
      damage: 0,
      text: 'This attack does 50 damage to 1 of your opponent\'s Pokémon. (Don’t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Paralyzing Bolt',
      cost: [L, L, C],
      damage: 160,
      text: 'You may discard 2 [L] Energy from this Pokémon to make your opponent\'s Active Pokémon Paralyzed.'
    }
  ];

  public set: string = 'PAL';
  public regulationMark: string = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '79';
  public name: string = 'Bellibolt ex';
  public fullName: string = 'Bellibolt ex PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Jumping Press
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(50, effect, store, state);
    }

    // Paralyzing Bolt
    if (AFTER_ATTACK(effect, 1, this) && effect.resolvedAttackEffect && effect.originalDefender === effect.opponent.active) {
      return OPTIONALLY_DISCARD_ATTACK_ENERGY(store, state, effect.resolvedAttackEffect, [L, L], attackState => {
        ADD_PARALYZED_TO_PLAYER_ACTIVE(store, attackState, effect.opponent, effect);
      });
    }

    return state;
  }
}