import { CardTag, ChooseCardsPrompt, GameError, GameMessage, State, StoreLike, SuperType, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DiscardToHandEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class MiraculousIntercom extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public tags = [CardTag.ACE_SPEC];

  public regulationMark = 'H';

  public set: string = 'SSP';

  public name: string = 'Miracle Headset';

  public fullName: string = 'Miraculous Intercom SSP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '183';

  public text: string = 'Put up to 2 Supporter cards from your discard pile into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;
    const player = effect.player;
    const hasSupporter = player.discard.cards.some(card =>
      card instanceof TrainerCard && card.trainerType === TrainerType.SUPPORTER);
    if (!hasSupporter) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);

    // Ref: set-shrouded-fable/nightly-stretcher.ts (Slime Mold Colony prevents discard recovery).
    const recover = new DiscardToHandEffect(player, this);
    state = store.reduceEffect(state, recover);
    if (recover.preventDefault) return state;

    return store.prompt(state, new ChooseCardsPrompt(
      player, GameMessage.CHOOSE_CARD_TO_HAND, player.discard,
      { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
      { min: 1, max: 2, allowCancel: false },
    ), cards => {
      MOVE_CARDS(store, state, player.discard, player.hand, { cards: cards ?? [], sourceCard: this, sourceEffect: effect });
    });
  }
}
