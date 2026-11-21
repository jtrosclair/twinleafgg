import { Card, CardManager, CardTarget, ChooseCardsPrompt, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PokemonCard, PokemonCardList, ShuffleDeckPrompt, SlotType } from '../../game';
import { Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { AfterEvolveEffect, EvolveEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

function isEvolution(card: Card): card is PokemonCard {
  return card instanceof PokemonCard && card.stage > Stage.BASIC && card.stage !== Stage.LV_X;
}

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  if (state.turn <= 2) {
    throw new GameError(GameMessage.CANNOT_EVOLVE_ON_YOUR_FIRST_TURN);
  }
  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const evolutionParents = new Set(CardManager.getInstance().getAllCards().filter(isEvolution).map(card => card.evolvesFrom));
  const blocked: CardTarget[] = [];
  let eligible = 0;
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
    if (list.pokemonPlayedTurn >= state.turn || list.cannotEvolveNextTurn || !evolutionParents.has(card.name)) {
      blocked.push(target);
    } else {
      eligible++;
    }
  });
  if (eligible === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let targets: PokemonCardList[] = [];
  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_EVOLVE,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.ACTIVE, SlotType.BENCH],
    { min: 1, max: Math.min(2, eligible), allowCancel: false, blocked }
  ), selection => {
    targets = selection || [];
    next();
  });

  if (targets.length === 0) {
    return state; // canceled by user
  }

  const evolutions: EvolveEffect[] = [];
  const selectedCards = new Set<Card>();
  const completions: AfterEvolveEffect[] = [];
  for (const target of targets) {
    const pokemonCard = target.getPokemonCard();
    if (pokemonCard === undefined) {
      return state; // invalid target?
    }

    const blocked = player.deck.cards.flatMap((card, index) => !isEvolution(card) || selectedCards.has(card) ? [index] : []);
    yield store.prompt(state, new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_EVOLVE,
      player.deck,
      { superType: SuperType.POKEMON, evolvesFrom: pokemonCard.name },
      { min: 0, max: 1, allowCancel: false, blocked },
    ), selected => {
      const card = selected?.[0] as Card | undefined;
      if (card && isEvolution(card)) {
        const evolution = new EvolveEffect(player, target, card, player.deck);
        evolution.completionBatch = completions;
        evolutions.push(evolution);
        selectedCards.add(card);
      }
      next();
    });
  }

  for (const evolution of evolutions) store.reduceEffect(state, evolution);
  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
    for (const completion of completions) store.reduceEffect(state, completion);
  });
}

export class PokemonBreedersNurturing extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'D';

  public set: string = 'DAA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '166';

  public name: string = 'Pokémon Breeder\'s Nurturing';

  public fullName: string = 'Pokémon Breeder\'s Nurturing DAA';

  public text: string =
    'Choose up to 2 of your Pokémon in play. For each of those Pokémon, search your deck for a card that evolves from that Pokémon and put it onto that Pokémon to evolve it. Then, shuffle your deck. You can\'t use this card during your first turn or on a Pokémon that was put into play this turn.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }
}
