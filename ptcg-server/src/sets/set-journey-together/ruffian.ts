import { Card, GameError, GameMessage, Player, PlayerType, State, StateUtils, StoreLike } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { chooseTrainerAttachment, chooseTrainerAttachmentTarget, getAttachedSpecialEnergy, moveTrainerAttachments } from '../../game/store/prefabs/trainer-attachments';

export class Ruffian extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'I';
  public set: string = 'JTG';
  public name: string = 'Ruffian';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '157';
  public fullName: string = 'Ruffian JTG';

  public text: string = 'Discard a Pokémon Tool and a Special Energy from 1 of your opponent\'s Pokémon.';

  public canPlay(_store: StoreLike, state: State, player: Player): boolean {
    return StateUtils.getOpponent(state, player).getPokemonInPlay().some(slot =>
      slot.tools.length > 0 || getAttachedSpecialEnergy(slot).length > 0);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;
    if (!this.canPlay(store, state, effect.player)) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);

    const opponent = StateUtils.getOpponent(state, effect.player);
    // Ref: set-lost-thunder/faba.ts (choose an attached Tool or Special Energy).
    return chooseTrainerAttachmentTarget(store, state, effect, PlayerType.TOP_PLAYER,
      slot => [...slot.tools, ...getAttachedSpecialEnergy(slot)], target => {
        chooseTrainerAttachment(store, state, effect, target, slot => slot.tools, GameMessage.CHOOSE_CARD_TO_DISCARD, tool => {
          chooseTrainerAttachment(store, state, effect, target, getAttachedSpecialEnergy, GameMessage.CHOOSE_CARD_TO_DISCARD, energy => {
            const cards = [tool, energy].filter((card): card is Card => card !== undefined);
            if (cards.length > 0) {
              moveTrainerAttachments(store, state, effect, target, opponent.discard, cards);
            }
          }, true);
        }, true);
      });
  }
}
