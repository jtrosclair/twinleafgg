import { PokemonCard, ShowCardsPrompt, StateUtils } from '../../game';
import { GameError } from '../../game/game-error';
import { GameLog, GameMessage } from '../../game/game-message';
import { Card } from '../../game/store/card/card';
import { CardTag, EnergyType, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { CardList } from '../../game/store/state/card-list';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect, self: Card): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Search a separate view so ChooseCardsPrompt cannot reorder the real deck
  // before the mandatory shuffle. The choosing player sees card identities;
  // the opponent sees only the selected cards through ShowCardsPrompt.
  const searchView = new CardList();
  searchView.cards = [...player.deck.cards];
  searchView.sort(); // Do not reveal the actual order of the shuffled deck.
  const blocked: number[] = [];
  searchView.cards.forEach((card, index) => {
    const aquaBasic = card instanceof PokemonCard && card.superType === SuperType.POKEMON &&
      card.stage === Stage.BASIC && card.tags.includes(CardTag.TEAM_AQUA);
    const waterEnergy = card.superType === SuperType.ENERGY && card.energyType === EnergyType.BASIC && card.name === 'Water Energy';
    if (!aquaBasic && !waterEnergy) blocked.push(index);
  });

  effect.preventDefault = true;
  player.hand.moveCardTo(effect.trainerCard, player.supporter);

  let cards: Card[] = [];
  const search = new ChooseCardsPrompt(
    player, GameMessage.CHOOSE_CARD_TO_HAND, searchView, {},
    { min: 0, max: 2, maxPokemons: 1, maxEnergies: 1, allowCancel: false }
  );
  // This detached view is never sorted by the prompt. Retain index-based
  // restrictions even if a malformed in-memory state contains duplicate IDs.
  search.options.blocked = blocked;
  yield store.prompt(state, search, selected => {
    cards = selected || [];
    next();
  });

  if (cards.length > 0) {
    // Reveal only the chosen cards before moving them from the deck.
    yield store.prompt(state, new ShowCardsPrompt(
      opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards
    ), () => next());
  }

  for (const card of cards) {
    state = MOVE_CARDS(store, state, player.deck, player.hand, { cards: [card], sourceCard: self });
    if (player.hand.cards.includes(card)) {
      store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
    }
  }

  // An unsuccessful search still requires a shuffle, including an empty result.
  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });

}
export class TeamAquasGreatBall extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'DCR';

  public name: string = 'Team Aqua\'s Great Ball';

  public fullName: string = 'Team Aqua\'s Great Ball DCR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '27';

  public text: string =
    'Search your deck for a Basic Team Aqua Pokémon and a basic [W] Energy card, reveal them, and put them into your hand. Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect, this);
      return generator.next().value;
    }

    return state;
  }

}
