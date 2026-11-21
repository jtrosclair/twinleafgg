import { GameError, GameMessage, PlayerType, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { getPhysicalAttachedEnergy } from '../../game/store/prefabs/attack-effects';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { chooseTrainerAttachment, chooseTrainerAttachmentTarget } from '../../game/store/prefabs/trainer-attachments';

export class WaitAndSeeHammer extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'LOT';
  public setNumber: string = '192';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Wait and See Hammer';
  public fullName: string = 'Wait and See Hammer LOT';
  public text: string = 'You can use this card only if you go second, and only on your first turn. Discard an Energy from 1 of your opponent\'s Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;

    const opponent = StateUtils.getOpponent(state, effect.player);
    if (state.turn !== 2 || !opponent.getPokemonInPlay().some(slot => getPhysicalAttachedEnergy(slot).length > 0)) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Ref: set-pokemon-151/giovannis-charisma.ts (move a physical Energy with Trainer attribution).
    return chooseTrainerAttachmentTarget(store, state, effect, PlayerType.TOP_PLAYER, getPhysicalAttachedEnergy, target => {
      chooseTrainerAttachment(store, state, effect, target, getPhysicalAttachedEnergy, GameMessage.CHOOSE_CARD_TO_DISCARD, card => {
        if (card) MOVE_CARDS(store, state, target, opponent.discard, { cards: [card], sourceCard: this, sourceEffect: effect });
      });
    });
  }
}
