import { ChooseCardsPrompt, GameError, GameMessage, State, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS, MOVE_CARDS, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';

export class ProfessorRowanDP extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '112';
  public name: string = 'Professor Rowan';
  public fullName: string = 'Professor Rowan DP';
  public text: string = 'Choose 1 card in your hand and shuffle the rest of your cards into your deck. Then, draw 4 cards. (If this is the only card in your hand, you can’t play this card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!WAS_TRAINER_USED(effect, this)) return state;
    const player = effect.player;
    if (player.supporterTurn > 0) throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
    if (player.hand.cards.length <= 1) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    MOVE_CARDS(store, state, player.hand, player.supporter, { cards: [effect.trainerCard], sourceCard: this });
    effect.preventDefault = true;
    return store.prompt(state, new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.hand,
      {},
      { min: 1, max: 1, allowCancel: false }
    ), selected => {
      const keep = selected || [];
      const rest = player.hand.cards.filter(card => !keep.includes(card));
      if (rest.length) MOVE_CARDS(store, state, player.hand, player.deck, { cards: rest, sourceCard: this });
      SHUFFLE_DECK(store, state, player);
      DRAW_CARDS(player, 4);
    });
  }
}
