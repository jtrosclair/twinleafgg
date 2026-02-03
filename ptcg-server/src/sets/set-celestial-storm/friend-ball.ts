import { TrainerCard } from '../../game/store/card/trainer-card';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { GameMessage } from '../../game/game-message';
import { StoreLike, State, StateUtils, PokemonCard, Card, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Get all types of opponent's Pokemon in play
  const opponentTypes = new Set<string>();

  // Check active Pokemon
  if (opponent.active.cards.length > 0 && opponent.active.cards[0] instanceof PokemonCard) {
    const activePokemon = opponent.active.cards[0] as PokemonCard;
    activePokemon.types.forEach(type => opponentTypes.add(type));
  }

  // Check bench Pokemon
  opponent.bench.forEach(benchSlot => {
    if (benchSlot.cards.length > 0 && benchSlot.cards[0] instanceof PokemonCard) {
      const benchPokemon = benchSlot.cards[0] as PokemonCard;
      benchPokemon.types.forEach(type => opponentTypes.add(type));
    }
  });

  // Block cards that don't share any type with opponent's Pokemon
  const blocked: number[] = [];
  player.deck.cards.forEach((card, index) => {
    if (card instanceof PokemonCard) {
      const hasMatchingType = card.types.some(type => opponentTypes.has(type));
      if (!hasMatchingType) {
        blocked.push(index);
      }
    } else {
      blocked.push(index);
    }
  });

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.POKEMON },
    { min: 1, max: 1, allowCancel: true, blocked: blocked }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.deck.moveCardsTo(cards, player.hand);

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(
      opponent.id,
      GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards
    ), () => next());
  }

  player.supporter.moveCardTo(effect.trainerCard, player.discard);

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class FriendBall extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'CES';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '131';

  public name: string = 'Friend Ball';

  public fullName: string = 'Friend Ball CES';

  public text =
    'Search your deck for a Pokémon with the same type as 1 of your opponent\'s Pokémon in play, reveal it, and put it into your hand. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
