import { CardTag, ChooseCardsPrompt, GameError, GameMessage, State, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';

export class BrilliantBlender extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;
  public tags = [CardTag.ACE_SPEC];
  public regulationMark = 'H';
  public set: string = 'SSP';
  public name: string = 'Brilliant Blender';
  public fullName: string = 'Brilliant Blender SSP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '164';

  public text: string =
    'Search your deck for up to 5 cards and discard them. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;
    const player = effect.player;
    if (player.deck.cards.length === 0) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);

    // Ref: set-scarlet-and-violet/ultra-ball.ts (typed discard followed by the deck shuffle).
    return store.prompt(state, new ChooseCardsPrompt(
      player, GameMessage.CHOOSE_CARD_TO_DISCARD, player.deck, {},
      { min: 1, max: 5, allowCancel: false },
    ), cards => {
      const next = MOVE_CARDS(store, state, player.deck, player.discard, {
        cards: cards ?? [], sourceCard: this, sourceEffect: effect
      });
      SHUFFLE_DECK(store, next, player);
    });
  }
}
