import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameError, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';
import { Player } from '../../game/store/state/player';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { ADD_MARKER, CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';

export class AcerolasMischief extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'MEG';
  public setNumber: string = '113';
  public regulationMark = 'I';
  public name: string = 'Acerola\'s Mischief';
  public fullName: string = 'Acerola\'s Mischief M1S';
  public text: string =
    'You can use this card only if your opponent has 2 or fewer Prize cards remaining. ' +
    'Choose 1 of your Pokémon in play. During your opponent\'s next turn, prevent all damage ' +
    'from and effects of attacks done to that Pokémon by your opponent\'s Pokémon ex.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    const opponent = StateUtils.getOpponent(state, player);
    return opponent.getPrizeLeft() <= 2;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.getPrizeLeft() > 2) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const target = targets[0];

        ADD_MARKER(MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, target, this);
        ADD_MARKER(MarkerConstants.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, opponent, this);
      });
    }

    if (effect instanceof AbstractAttackEffect) {
      const sourceCard = effect.source.getPokemonCard();
      if (sourceCard && sourceCard.tags.includes(CardTag.POKEMON_ex)
        && effect.target.marker.hasMarker(MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this)) {
        effect.preventDefault = true;
      }
    }

    CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(
      state,
      effect,
      MarkerConstants.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER,
      MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER,
      this
    );

    return state;
  }
}
