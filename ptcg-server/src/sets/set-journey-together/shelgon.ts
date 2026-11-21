import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Shelgon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Bagon';
  public cardType: CardType = CardType.DRAGON;
  public hp: number = 100;
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Guard Press',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: 'During your opponent\'s next turn, this Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).'
    },
    {
      name: 'Heavy Impact',
      cost: [CardType.FIRE, CardType.WATER, CardType.COLORLESS],
      damage: 80,
      text: ''
    },

  ];

  public set: string = 'JTG';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '113';
  public name: string = 'Shelgon';
  public fullName: string = 'Shelgon JTG';

  public readonly GUARD_PRESS = 'GUARD_PRESS';
  public readonly CLEAR_GUARD_PRESS = 'CLEAR_GUARD_PRESS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.source.damageReductionNextTurn = 30;
    }

    // Legacy saves stored this effect as a marker.
    if (effect instanceof PutDamageEffect && effect.target.marker.hasMarker(this.GUARD_PRESS, this)) {
      if (effect.player !== StateUtils.findOwner(state, effect.target)) {
        effect.reduceDamageAfterWeakness(30, this.fullName);
      }
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_GUARD_PRESS, this)) {
      effect.player.marker.removeMarker(this.CLEAR_GUARD_PRESS, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.GUARD_PRESS, this);
      });
    }

    return state;
  }

}