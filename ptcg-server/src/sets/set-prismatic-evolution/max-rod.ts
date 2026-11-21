import { CardTag, ChooseCardsPrompt, EnergyCard, EnergyType, GameError, GameMessage, PokemonCard, State, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DiscardToHandEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class MaxRod extends TrainerCard {

  public regulationMark = 'H';

  public tags = [CardTag.ACE_SPEC];

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'PRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '116';

  public name: string = 'Max Rod';

  public fullName: string = 'Max Rod PRE';

  public text: string =
    'Choose up to 5 in any combination of Pokémon and Basic Energy cards from your discard pile and put them into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;
    const player = effect.player;
    const blocked: number[] = [];
    player.discard.cards.forEach((card, index) => {
      if (!(card instanceof PokemonCard) && !(card instanceof EnergyCard && card.energyType === EnergyType.BASIC)) {
        blocked.push(index);
      }
    });
    if (blocked.length === player.discard.cards.length) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);

    // Ref: set-surging-sparks/miraculous-intercom.ts (protected discard-to-hand move).
    const recover = new DiscardToHandEffect(player, this);
    state = store.reduceEffect(state, recover);
    if (recover.preventDefault) return state;

    return store.prompt(state, new ChooseCardsPrompt(
      player, GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {},
      { min: 1, max: 5, allowCancel: false, blocked },
    ), cards => {
      MOVE_CARDS(store, state, player.discard, player.hand, { cards: cards ?? [], sourceCard: this, sourceEffect: effect });
    });
  }
}
