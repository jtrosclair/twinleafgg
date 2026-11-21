import {
  Card,
  CardList,
  ChooseCardsPrompt,
  GameError, GameMessage,
  PlayerType,
  StateUtils
} from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { getPhysicalAttachedEnergy } from '../../game/store/prefabs/attack-effects';
import { chooseTrainerAttachment, chooseTrainerAttachmentTarget } from '../../game/store/prefabs/trainer-attachments';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

function* playCard(next: Function, store: StoreLike, state: State, self: Plumeria, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  let cardsInHand: Card[] = [];

  cardsInHand = player.hand.cards.filter(c => c !== effect.trainerCard);
  if (cardsInHand.length < 2) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (!opponent.getPokemonInPlay().some(slot => getPhysicalAttachedEnergy(slot).length > 0)) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  effect.preventDefault = true;
  player.hand.moveCardTo(effect.trainerCard, player.supporter);

  const handTemp = new CardList();
  handTemp.cards = player.hand.cards.filter(c => c !== self);

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    handTemp,
    {},
    { min: 2, max: 2, allowCancel: false }
  ), selected => {
    cardsInHand = selected || [];
    next();
  });

  // Operation canceled by the user
  if (cardsInHand.length === 0) {
    return state;
  }

  player.hand.moveCardsTo(cardsInHand, player.discard);

  // Ref: set-pokemon-151/giovannis-charisma.ts (check Trainer protection before removing Energy).
  return chooseTrainerAttachmentTarget(store, state, effect, PlayerType.TOP_PLAYER, getPhysicalAttachedEnergy, target => {
    chooseTrainerAttachment(store, state, effect, target, getPhysicalAttachedEnergy, GameMessage.CHOOSE_CARD_TO_DISCARD, card => {
      if (card) MOVE_CARDS(store, state, target, opponent.discard, { cards: [card], sourceCard: self, sourceEffect: effect });
    });
  });
}

export class Plumeria extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BUS';

  public name: string = 'Plumeria';

  public fullName: string = 'Plumeria BUS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '120';

  public text: string = 'Discard 2 cards from your hand. If you do, discard an Energy from 1 of your opponent\'s Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }

}
