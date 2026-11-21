import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { GameError, GameMessage, PlayerType, AttachEnergyPrompt, SlotType, StateUtils, ChooseCardsPrompt, Card, CardList, ShowCardsPrompt } from '../../game';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ATTACH_ENERGY_TRANSFERS, BLOCK_IF_DECK_EMPTY, MOVE_CARDS, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';

export class Crispin extends TrainerCard {

  public regulationMark = 'H';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SCR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '133';

  public name: string = 'Crispin';

  public fullName: string = 'Crispin SCR';

  public text: string =
    'Search your deck for up to 2 Basic Energy cards of different types, reveal them, and put 1 of them into your hand. Attach the other to 1 of your Pokémon. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }
      BLOCK_IF_DECK_EMPTY(player);

      player.hand.moveCardTo(this, player.supporter);
      effect.preventDefault = true;

      const filter = { superType: SuperType.ENERGY, energyType: EnergyType.BASIC };
      return store.prompt(state, new ChooseCardsPrompt(
        player, GameMessage.CHOOSE_CARD_TO_HAND, player.deck,
        filter, { min: 0, max: 2, allowCancel: false, differentTypes: true },
      ), selected => {
        if (selected.length === 0) {
          SHUFFLE_DECK(store, state, player);
          return;
        }
        const opponent = StateUtils.getOpponent(state, player);
        store.prompt(state, new ShowCardsPrompt(
          opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selected,
        ), () => {
          const putInHand = (card: Card) => {
            MOVE_CARDS(store, state, player.deck, player.hand, { cards: [card], sourceCard: this });
          };

          // Only a second Energy can be attached.
          if (selected.length === 1) {
            putInHand(selected[0]);
            SHUFFLE_DECK(store, state, player);
            return;
          }
          const revealed = new CardList();
          revealed.cards = selected.slice();
          store.prompt(state, new AttachEnergyPrompt(
            player.id, GameMessage.ATTACH_ENERGY_CARDS, revealed, PlayerType.BOTTOM_PLAYER,
            [SlotType.BENCH, SlotType.ACTIVE], filter,
            { allowCancel: false, min: 1, max: 1, differentTargets: true },
          ), transfers => {
            const [first, second] = selected;
            const remaining = first === transfers[0].card ? second : first;
            putInHand(remaining);
            ATTACH_ENERGY_TRANSFERS(store, state, player, transfers, 'deck', {
              sourceCard: this,
              onAttached: () => SHUFFLE_DECK(store, state, player)
            });
          });
        });
      });
    }
    return state;
  }
}
