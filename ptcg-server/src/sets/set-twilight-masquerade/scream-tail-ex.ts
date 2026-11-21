import { PokemonCard } from '../../game/store/card/pokemon-card';
import { StoreLike, State, GameError, GameMessage, StateUtils, CardTag, CardType, Stage } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { PlaySupporterEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../game/store/prefabs/attack-effects';
import { afterAttackDamageForOriginalDefender } from '../../game/store/prefabs/post-damage-identity';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class ScreamTailex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex, CardTag.ANCIENT];

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 190;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Scream',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'You can use this attack only if you go second, and only during your first turn. During your opponent\'s next turn, they can\'t play any Supporter cards from their hand.'
    },
    {
      name: 'Crunch',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
      damage: 120,
      text: 'Discard an Energy from your opponent\'s Active Pokémon.'
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '94';

  public name: string = 'Scream Tail ex';

  public fullName: string = 'Scream Tail ex TWM';

  public readonly SUDDEN_SHRIEK_MARKER = 'SUDDEN_SHRIEK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      // Get current turn
      const turn = state.turn;

      // Check if it is player's first turn
      if (turn !== 2) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      } else {

        const player = effect.player;
        const opponent = StateUtils.getOpponent(state, player);
        opponent.marker.addMarker(this.SUDDEN_SHRIEK_MARKER, this);
      }
    }

    // Crunch resolves damage before removing the Energy.
    if (WAS_ATTACK_USED(effect, 1, this)) {
      afterAttackDamageForOriginalDefender(state, effect, (effectStore, next) =>
        DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(effectStore, next, effect));
    }

    if (effect instanceof PlaySupporterEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.marker.hasMarker(this.SUDDEN_SHRIEK_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.SUDDEN_SHRIEK_MARKER, this)) {
      effect.player.marker.removeMarker(this.SUDDEN_SHRIEK_MARKER, this);
    }

    return state;
  }
}
