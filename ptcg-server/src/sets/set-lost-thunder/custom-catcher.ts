import { Card, ConfirmPrompt, GameError, GameMessage, State, StateUtils, StoreLike } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS_UNTIL_CARDS_IN_HAND, MOVE_CARDS, SWITCH_IN_OPPONENT_BENCHED_POKEMON } from '../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';

export class CustomCatcher extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'LOT';
  public name: string = 'Custom Catcher';
  public fullName: string = 'Custom Catcher LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '171';

  public text: string =
    `You may play 2 Custom Catcher cards at once.

  • If you played 1 card, draw cards until you have 3 cards in your hand.
  • If you played 2 cards, switch 1 of your opponent's Benched Pokémon with their Active Pokémon. (This effect works one time for 2 cards.)`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!WAS_TRAINER_USED(effect, this)) return state;

    const { player } = effect;
    // The Item reducer has already moved the first copy out of the hand.
    const second = player.hand.cards.find(card => card !== this && card.name === this.name);
    const opponent = StateUtils.getOpponent(state, player);
    const canDraw = player.hand.cards.length < 3 && player.deck.cards.length > 0;
    const canSwitch = second !== undefined && opponent.bench.some(slot => !!slot.getPokemonCard());
    const playBoth = (companion: Card) => {
      MOVE_CARDS(store, state, player.hand, player.discard, { cards: [companion], sourceCard: this });
      return SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, player);
    };

    if (canSwitch && canDraw) {
      return store.prompt(state, new ConfirmPrompt(player.id, GameMessage.WANT_TO_PLAY_BOTH_CARDS_AT_ONCE), both => {
        if (both) playBoth(second);
        else DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 3);
      });
    }
    if (canSwitch) return playBoth(second);
    if (!canDraw) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);

    DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 3);
    return state;
  }
}
