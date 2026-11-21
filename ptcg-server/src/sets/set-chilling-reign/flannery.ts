import { GameError, GameMessage, Player, PlayerType, State, StateUtils, StoreLike } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { chooseTrainerAttachment, chooseTrainerAttachmentTarget, getAttachedSpecialEnergy } from '../../game/store/prefabs/trainer-attachments';

export class Flannery extends TrainerCard {

  public regulationMark = 'E';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '139';

  public name: string = 'Flannery';

  public fullName: string = 'Flannery CRE';

  public text: string =
    'Discard a Special Energy attached to 1 of your opponent\'s Pokémon, and discard a Stadium in play.';

  public canPlay(_store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);
    return StateUtils.getStadiumCard(state) !== undefined
      || opponent.getPokemonInPlay().some(slot => getAttachedSpecialEnergy(slot).length > 0);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;
    if (!this.canPlay(store, state, effect.player)) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);

    const opponent = StateUtils.getOpponent(state, effect.player);
    const discardStadium = (): void => {
      const stadium = StateUtils.getStadiumCard(state);
      if (!stadium) return;
      const source = StateUtils.findCardList(state, stadium);
      MOVE_CARDS(store, state, source, StateUtils.findOwner(state, source).discard, { sourceCard: this, sourceEffect: effect });
    };

    // Ref: set-pokemon-151/giovannis-charisma.ts (resolve Trainer protection per target).
    if (opponent.getPokemonInPlay().some(slot => getAttachedSpecialEnergy(slot).length > 0)) {
      return chooseTrainerAttachmentTarget(store, state, effect, PlayerType.TOP_PLAYER, getAttachedSpecialEnergy, target => {
        chooseTrainerAttachment(store, state, effect, target, getAttachedSpecialEnergy, GameMessage.CHOOSE_CARD_TO_DISCARD, card => {
          if (card) MOVE_CARDS(store, state, target, opponent.discard, { cards: [card], sourceCard: this, sourceEffect: effect });
          discardStadium();
        });
      });
    }
    discardStadium();
    return state;
  }
}
