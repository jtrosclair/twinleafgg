import { GameError, GameMessage, PlayerType, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { chooseTrainerAttachment, chooseTrainerAttachmentTarget, getAttachedSpecialEnergy } from '../../game/store/prefabs/trainer-attachments';

export class FanOfWaves extends TrainerCard {

  public regulationMark = 'E';

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '127';

  public name: string = 'Fan of Waves';

  public fullName: string = 'Fan of Waves BST';

  public text: string =
    'Put a Special Energy attached to 1 of your opponent\'s Pokémon on the bottom of their deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;

    const opponent = StateUtils.getOpponent(state, effect.player);
    if (!opponent.getPokemonInPlay().some(slot => getAttachedSpecialEnergy(slot).length > 0)) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Ref: set-pokemon-151/giovannis-charisma.ts (move a physical Energy with Trainer attribution).
    return chooseTrainerAttachmentTarget(store, state, effect, PlayerType.TOP_PLAYER, getAttachedSpecialEnergy, target => {
      chooseTrainerAttachment(store, state, effect, target, getAttachedSpecialEnergy, GameMessage.CHOOSE_CARD_TO_DISCARD, card => {
        if (card) MOVE_CARDS(store, state, target, opponent.deck, { cards: [card], sourceCard: this, sourceEffect: effect, toBottom: true });
      });
    });
  }
}
