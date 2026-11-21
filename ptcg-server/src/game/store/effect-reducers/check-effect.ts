import { GameError } from '../../game-error';
import { GameLog, GameMessage } from '../../game-message';
import { CardManager } from '../../cards/card-manager';
import { deepClone } from '../../../utils/utils';
import { PlayerType, SlotType } from '../actions/play-card-action';
import { Card } from '../card/card';
import { CardTag, Stage } from '../card/card-types';
import { EnergyCard } from '../card/energy-card';
import { PokemonCard } from '../card/pokemon-card';
import { CheckHpEffect, CheckProvidedEnergyEffect, CheckTableStateEffect } from '../effects/check-effects';
import { Effect } from '../effects/effect';
import { EffectKnockOutOptions, KnockOutEffect, MovedToActiveEffect } from '../effects/game-effects';
import { protectAttackerAfterKnockOut } from '../prefabs/knock-out-effects';
import { TAKE_SPECIFIC_PRIZES, MOVE_CARDS } from '../prefabs/prefabs';
import { ChoosePokemonPrompt } from '../prompts/choose-pokemon-prompt';
import { createPlayer, setupGame } from '../reducers/setup-reducer';
import { CardList } from '../state/card-list';
import { PokemonCardList } from '../state/pokemon-card-list';
import { GamePhase, GameWinner, State } from '../state/state';
import { StoreLike } from '../store-like';
import { recordActiveAbilityLockOrder } from '../state/active-ability-lock-order';
import { resolveKnockOutGroup } from './knock-out';

interface PokemonItem {
  playerNum: number;
  cardList: PokemonCardList;
  card: PokemonCard;
  destination?: 'lostzone';
  effectOptions?: EffectKnockOutOptions;
}

interface PrizeGroup {
  destination: CardList;
  count: number;
}

// Pending effects only belong to the live board. They are consumed by the next
// normal Knock Out check and never carried into a reset or a rolled-back action.
const pendingEffectKnockOuts = new WeakMap<State, Map<PokemonCard, EffectKnockOutOptions | undefined>>();

export function scheduleEffectKnockOut(state: State, pokemon: PokemonCard, options?: EffectKnockOutOptions): void {
  const pending = pendingEffectKnockOuts.get(state) ?? new Map();
  if (!pending.has(pokemon) || options) pending.set(pokemon, options);
  pendingEffectKnockOuts.set(state, pending);
}

function findKoPokemons(store: StoreLike, state: State): PokemonItem[] {
  const pokemons: PokemonItem[] = [];
  const effectKnockOuts = pendingEffectKnockOuts.get(state);
  pendingEffectKnockOuts.delete(state);

  for (let i = 0; i < state.players.length; i++) {
    const player = state.players[i];
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
      const checkHpEffect = new CheckHpEffect(player, cardList);
      store.reduceEffect(state, checkHpEffect);

      const effectKnockOut = effectKnockOuts && cardList.getPokemons().find(pokemon => effectKnockOuts.has(pokemon));
      if (effectKnockOut) cardList.attackDamageKnockOut = undefined;
      const ko = cardList.attackDamageKnockOut;
      const destination = ko && ko.turn === state.turn && state.phase === GamePhase.ATTACK
        && ko.playerId === state.players[state.activePlayer].id
        && ko.playerId !== player.id && ko.targetCard === card ? ko.destination : undefined;
      // Consume the opt-in at the next state check, even if healed/saved.
      // Never carry a Lost Crisis destination into another attack or checkup.
      if (ko) { delete ko.destination; delete ko.targetCard; }
      if (effectKnockOut || cardList.damage >= checkHpEffect.hp) {
        const effectOptions = effectKnockOut && effectKnockOuts?.get(effectKnockOut);
        pokemons.push({ playerNum: i, cardList, card, destination, effectOptions });
      }
    });
  }

  return pokemons;
}

//New, Optimized Code ^^ Test Old Code CPU Usage First
// function findKoPokemons(store: StoreLike, state: State): PokemonItem[] {
//   return state.players.reduce((koPokemons: PokemonItem[], player, playerNum) => {
//     player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
//       const checkHpEffect = new CheckHpEffect(player, cardList);
//       store.reduceEffect(state, checkHpEffect);

//       if (cardList.damage >= checkHpEffect.hp) {
//         koPokemons.push({ playerNum, cardList });
//       }
//     });
//     return koPokemons;
//   }, []);
// }

// function handleMaxToolsChange(store: StoreLike, state: State): State {
//   state.players.forEach((player, index) => {
//     player.forEachPokemon(PlayerType.ANY, (cardList) => {
//       if (cardList.tools.length > cardList.maxTools) {
//         const amount = cardList.tools.length - cardList.maxTools;
//         REMOVE_TOOLS_FROM_POKEMON_PROMPT(store, state, player, cardList, SlotType.DISCARD, amount, amount);
//       }
//     });
//   });
//   return state;
// }

function handleBenchSizeChange(store: StoreLike, state: State, benchSizes: number[]): State {
  // Skip if we've already handled bench size changes in this state check
  if (state.benchSizeChangeHandled) {
    return state;
  }

  state.players.forEach((player, index) => {
    const benchSize = benchSizes[index];
    // Add empty slots if bench is smaller
    while (player.bench.length < benchSize) {
      const bench = new PokemonCardList();
      bench.isPublic = true;
      player.bench.push(bench);
    }

    if (player.bench.length === benchSize) {
      return;
    }

    // Remove empty slots, starting from the right side
    const empty: PokemonCardList[] = [];
    for (let index = player.bench.length - 1; index >= 0; index--) {
      const bench = player.bench[index];
      const isEmpty = bench.cards.length === 0;
      if (player.bench.length - empty.length > benchSize && isEmpty) {
        empty.push(bench);
      }
    }

    if (player.bench.length - empty.length <= benchSize) {
      // Discarding empty slots is enough
      for (let i = player.bench.length - 1; i >= 0; i--) {
        if (empty.includes(player.bench[i])) {
          player.bench.splice(i, 1);
        }
      }
      return;
    }

    // Player has more Pokemons than bench size, discard some
    const count = player.bench.length - empty.length - benchSize;
    store.prompt(state, new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_DISCARD,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.BENCH],
      { min: count, max: count, allowCancel: false }
    ), results => {
      results = results || [];
      const selected = [...empty, ...results];

      // Discard all empty slots and selected Pokemons
      for (let i = player.bench.length - 1; i >= 0; i--) {
        if (selected.includes(player.bench[i])) {
          const cardList = player.bench[i];
          const pokemons = cardList.getPokemons();
          const otherCards = cardList.cards.filter(card =>
            !(card instanceof PokemonCard) &&
            !pokemons.includes(card as PokemonCard) &&
            (!cardList.tools || !cardList.tools.includes(card))
          );
          const tools = [...cardList.tools];

          // Move other cards to discard
          if (otherCards.length > 0) {
            MOVE_CARDS(store, state, cardList, player.discard, { cards: otherCards });
          }

          // Move tools to discard
          for (const tool of tools) {
            cardList.moveCardTo(tool, player.discard);
          }

          // Move Pokémon to discard
          if (pokemons.length > 0) {
            MOVE_CARDS(store, state, cardList, player.discard, { cards: pokemons });
          }
          player.bench.splice(i, 1);
        }
      }
    });
  });
  // Mark that we've handled bench size changes
  state.benchSizeChangeHandled = true;
  return state;
}

/** Reconcile bench capacity without running knockouts, prizes, or turn effects. */
export function checkBenchSize(store: StoreLike, state: State): State {
  recordActiveAbilityLockOrder(state);
  const effect = new CheckTableStateEffect(state.players.map(() => 5));
  store.reduceEffect(state, effect);
  return handleBenchSizeChange(store, state, effect.benchSizes);
}

function chooseActivePokemons(state: State): ChoosePokemonPrompt[] {
  const prompts: ChoosePokemonPrompt[] = [];

  // After simultaneous Knock Outs, the player whose turn is next promotes first.
  const turnPlayer = state.players[state.activePlayer];
  const nextPlayerIndex = turnPlayer?.usedTurnSkip ? state.activePlayer : (state.activePlayer === 0 ? 1 : 0);
  const promotionOrder = nextPlayerIndex === 1 ? [...state.players].reverse() : state.players;
  for (const player of promotionOrder) {
    const hasActive = player.active.cards.length > 0;
    const hasBenched = player.bench.some(bench => bench.cards.length > 0);
    if (!hasActive && hasBenched) {
      const choose = new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { min: 1, allowCancel: false }
      );
      prompts.push(choose);
    }
  }
  return prompts;
}

function* resolveActivePromotions(
  next: Function, store: StoreLike, state: State, activePrompts: ChoosePokemonPrompt[]
): Generator<State, State, void> {
  for (const prompt of activePrompts) {
    const player = state.players.find(p => p.id === prompt.playerId);
    if (!player) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    state = store.prompt(state, prompt, (result) => {
      const selectedPokemon = result as PokemonCardList[];
      if (selectedPokemon.length !== 1) {
        throw new GameError(GameMessage.ILLEGAL_ACTION);
      }
      const benchIndex = player.bench.indexOf(selectedPokemon[0]);
      if (benchIndex === -1 || player.active.cards.length > 0) {
        throw new GameError(GameMessage.ILLEGAL_ACTION);
      }
      const temp = player.active;
      player.active = player.bench[benchIndex];
      player.bench[benchIndex] = temp;
      recordActiveAbilityLockOrder(state);
      const newActivePokemon = player.active.getPokemonCard();
      if (newActivePokemon) {
        // Add to new tracking system
        if (!player.movedToActiveThisTurn.includes(newActivePokemon.id)) {
          player.movedToActiveThisTurn.push(newActivePokemon.id);
        }
        // Keep existing boolean for backwards compatibility
        newActivePokemon.movedToActiveThisTurn = true;
        // Dispatch MovedToActiveEffect for cards that intercept it
        store.reduceEffect(state, new MovedToActiveEffect(player, newActivePokemon));
      }
    });

    if (store.hasPrompts()) {
      yield store.waitPrompt(state, () => next());
    }
  }
  return state;
}

// function choosePrizeCards(state: State, prizesToTake: [number, number]): ChooseCardsPrompt[] {
//   const prompts: ChooseCardsPrompt[] = [];

//   for (let i = 0; i < state.players.length; i++) {
//     const player = state.players[i];
//     const prizeLeft = player.getPrizeLeft();

//     if (prizesToTake[i] > prizeLeft) {
//       prizesToTake[i] = prizeLeft;
//     }

//     if (prizesToTake[i] > 0) {
//       const allPrizeCards = new CardList();
//       // allPrizeCards.isSecret = true;  // Set the CardList as secret
//       // allPrizeCards.isPublic = false;
//       // allPrizeCards.faceUpPrize = false;
//       player.prizes.forEach(prizeList => {
//         allPrizeCards.cards.push(...prizeList.cards);
//       });

//       const prompt = new ChooseCardsPrompt(
//         player,
//         GameMessage.CHOOSE_PRIZE_CARD,
//         allPrizeCards,
//         {},  // No specific filter needed for prizes
//         { min: prizesToTake[i], max: prizesToTake[i], isSecret: player.prizes[0].isSecret, allowCancel: false }
//       );
//       prompts.push(prompt);
//     }
//   }

//   return prompts;
// }


export function endGame(store: StoreLike, state: State, winner: GameWinner): State {

  if (state.players.length !== 2) {
    return state;
  }

  // Allow ending the game during any phase except FINISHED
  if (state.phase === GamePhase.FINISHED) {
    return state;
  }

  switch (winner) {
    case GameWinner.NONE:
      store.log(state, GameLog.LOG_GAME_FINISHED);
      break;
    case GameWinner.DRAW:
      store.log(state, GameLog.LOG_GAME_FINISHED_DRAW);
      break;
    case GameWinner.PLAYER_1:
    case GameWinner.PLAYER_2: {
      const winnerName = winner === GameWinner.PLAYER_1
        ? state.players[0].name
        : state.players[1].name;
      store.log(state, GameLog.LOG_GAME_FINISHED_WINNER, { name: winnerName });
      break;
    }
  }

  // Apply win condition overrides
  if (state.winConditions?.selfDeckOut && winner === GameWinner.PLAYER_1) {
    const player1 = state.players[0];
    if (player1 && player1.deck.cards.length > 0) {
      winner = GameWinner.PLAYER_2;
      store.log(state, GameLog.LOG_GAME_FINISHED_WINNER, { name: state.players[1].name });
    }
  }

  if (state.winConditions?.cardsInDeck !== undefined && winner === GameWinner.PLAYER_1) {
    const player1 = state.players[0];
    if (player1 && player1.deck.cards.length !== state.winConditions.cardsInDeck) {
      winner = GameWinner.PLAYER_2;
      store.log(state, GameLog.LOG_GAME_FINISHED_WINNER, { name: state.players[1].name });
    }
  }

  if (state.winConditions?.mustLose) {
    if (winner === GameWinner.PLAYER_2) {
      // Player1 lost as required — report player1 as the "winner"
      winner = GameWinner.PLAYER_1;
      store.log(state, GameLog.LOG_GAME_FINISHED_WINNER, { name: state.players[0].name });
    } else {
      // Player1 didn't lose — report player2 as the "winner"
      winner = GameWinner.PLAYER_2;
      store.log(state, GameLog.LOG_GAME_FINISHED_WINNER, { name: state.players[1].name });
    }
  }

  state.winner = winner;
  state.phase = GamePhase.FINISHED;
  return state;
}

export function checkWinner(store: StoreLike, state: State, onComplete?: () => void): State {
  const points: [number, number] = [0, 0];
  const prizeCounts = state.players.map(player => player.getPrizeLeft());

  for (let i = 0; i < state.players.length; i++) {
    const player = state.players[i];
    const other = i === 0 ? 1 : 0;

    if (!player.active.getPokemonCard() && !player.bench.some(slot => slot.getPokemonCard())) {
      store.log(state, GameLog.LOG_PLAYER_NO_ACTIVE_POKEMON, { name: player.name });
      points[other]++;
    }

    if (prizeCounts[i] === 0) {
      store.log(state, GameLog.LOG_PLAYER_NO_PRIZE_CARD, { name: player.name });
      points[i]++;
    } else if (state.isSuddenDeath && prizeCounts[i] < prizeCounts[other]) {
      points[i]++;
    }
  }

  if (points[0] > 0 && points[0] === points[1]) {
    return initiateSuddenDeath(store, state);
  }

  if (points[0] + points[1] === 0) {
    if (onComplete) {
      onComplete();
    }
    return state;
  }

  let winner = GameWinner.DRAW;
  if (points[0] > points[1]) {
    winner = GameWinner.PLAYER_1;
  } else if (points[1] > points[0]) {
    winner = GameWinner.PLAYER_2;
  }

  state = endGame(store, state, winner);
  if (onComplete) {
    onComplete();
  }
  return state;
}

function initiateSuddenDeath(store: StoreLike, state: State): State {
  const manager = CardManager.getInstance();
  const players = state.players.map(previous => {
    const player = createPlayer(previous.id, previous.name);
    player.avatarName = previous.avatarName;
    player.deckId = previous.deckId;
    player.sleeveImagePath = previous.sleeveImagePath;

    const seen = new Set<Card>();
    const collect = (card: Card): void => {
      if (seen.has(card)) return;
      seen.add(card);
      card.cards.cards.forEach(collect);
      const fresh = manager.getCardByName(card.fullName) ?? deepClone(card);
      fresh.cards = new CardList();
      fresh.id = card.id;
      player.deck.cards.push(fresh);
    };
    [previous.deck, previous.hand, previous.discard, previous.lostzone,
      previous.stadium, previous.supporter, ...previous.prizes].forEach(zone => zone.cards.forEach(collect));
    [previous.active, ...previous.bench].forEach(slot => {
      [...slot.cards, ...slot.tools, ...slot.energies.cards].forEach(collect);
    });
    return player;
  });

  // A shortened puzzle can end in a draw without enough cards to set up
  // two full hands and six Prizes each. Leave its finished board available.
  if (players.some(player => player.deck.cards.length < 13 || !player.deck.cards.some(card =>
    (card instanceof PokemonCard && card.stage === Stage.BASIC) || card.tags.includes(CardTag.PLAY_DURING_SETUP)))) {
    return endGame(store, state, GameWinner.DRAW);
  }

  store.log(state, GameLog.LOG_SUDDEN_DEATH);
  state.players = players;
  state.activePlayer = 0;
  state.turn = 0;
  state.phase = GamePhase.SETUP;
  state.winner = GameWinner.NONE;
  state.isSuddenDeath = true;
  state.lastAttack = null;
  state.playerLastAttack = {};
  state.activeAbilityLockOrder = undefined;
  state.copiedAttackCheckpoints = undefined;

  const generator = setupGame(() => generator.next(), store, state);
  return generator.next().value;
}

export function* executeCheckState(next: Function, store: StoreLike, state: State, onComplete?: () => void): IterableIterator<State> {
  const prizeGroups: PrizeGroup[][] = state.players.map(() => []);
  const promoteBeforePrizes = new Set<number>();

  // Resolve every Knock Out created by these effects before taking Prizes.
  const processed = new Set<PokemonCard>();
  let pending = findKoPokemons(store, state);
  while (pending.length > 0) {
    const pokemonInPlay = pending.length > 1 ? state.players.map(player =>
      player.getPokemonInPlay().flatMap(slot => slot.getPokemonCard() ?? [])) : undefined;
    const simultaneousKnockOuts = pokemonInPlay && new Set(pending.map(pokemon => pokemon.cardList));
    const resolved: KnockOutEffect[] = [];
    const continuations: (() => void)[] = [];
    for (const pokemon of pending) {
      const owner = state.players[pokemon.playerNum];
      if (pokemon.cardList.getPokemonCard() !== pokemon.card) continue;
      processed.add(pokemon.card);
      const effect = new KnockOutEffect(owner, pokemon.cardList, true);
      effect.pokemonInPlayBeforeKnockOut = pokemonInPlay?.[pokemon.playerNum];
      effect.simultaneousKnockOuts = simultaneousKnockOuts;
      effect.knockOutDestination = pokemon.destination;
      effect.energyAttachment = pokemon.effectOptions?.energyAttachment;
      if (pokemon.destination) {
        effect.knockOutDestinationLabel = pokemon.cardList.attackDamageKnockOut?.attack.name;
      }
      state = store.reduceEffect(state, effect);
      if (store.hasPrompts()) yield store.waitPrompt(state, () => next());
      if (effect.preventDefault) continue;

      protectAttackerAfterKnockOut(state, effect);
      resolved.push(effect);
      if (pokemon.effectOptions?.afterDiscard) continuations.push(pokemon.effectOptions.afterDiscard);
      if (effect.preventPrizes) continue;

      const opponentIndex = pokemon.playerNum === 0 ? 1 : 0;
      const destination = effect.prizeDestination ?? state.players[opponentIndex].hand;
      let group = prizeGroups[opponentIndex].find(group => group.destination === destination);
      if (!group) {
        group = { destination, count: 0 };
        prizeGroups[opponentIndex].push(group);
      }
      group.count += Math.max(0, effect.prizeCount - effect.prizeReduction);
    }
    state = yield* resolveKnockOutGroup(() => next(), store, state, resolved);
    for (const effect of resolved) {
      if (effect.promoteBeforePrizes) promoteBeforePrizes.add(effect.player.id);
    }
    // A printed discard cost can make the discarded cards available to the
    // rest of its effect. Finish that effect before taking any Prizes.
    for (const continueEffect of continuations) {
      continueEffect();
      if (store.hasPrompts()) yield store.waitPrompt(state, () => next());
    }
    pending = findKoPokemons(store, state).filter(pokemon => !processed.has(pokemon.card));
  }

  // Check table state and handle bench size after KOs
  checkBenchSize(store, state);
  if (store.hasPrompts()) {
    yield store.waitPrompt(state, () => next());
  }

  if (promoteBeforePrizes.size > 0) {
    const prompts = chooseActivePokemons(state);
    // Energy Shift promotes before Prizes. Keep turn order when both Active Pokémon were Knocked Out.
    const lastEarly = prompts.map(prompt => promoteBeforePrizes.has(prompt.playerId)).lastIndexOf(true);
    state = yield* resolveActivePromotions(next, store, state, prompts.slice(0, lastEarly + 1));
  }

  // Both players take their Prizes for this check before the winner is decided.
  for (let i = 0; i < state.players.length && state.phase !== GamePhase.FINISHED; i++) {
    const player = state.players[i];
    const available = player.prizes.filter(prize => prize.cards.length > 0);
    const groups = prizeGroups[i].map(({ count, destination }) => ({ prizes: available.splice(0, count), destination }));
    const reservedPrizes = groups.flatMap(group => group.prizes);
    for (const { prizes, destination } of groups) {
      if (!prizes.length) continue;
      TAKE_SPECIFIC_PRIZES(store, state, player, prizes, { destination, reservedPrizes });
      if (store.hasPrompts()) yield store.waitPrompt(state, () => next());
    }
  }

  state.benchSizeChangeHandled = false;
  if (state.phase !== GamePhase.FINISHED) state = checkWinner(store, state);
  if (state.phase === GamePhase.FINISHED) {
    onComplete?.();
    return state;
  }
  // An equal result can start the configured tiebreaker setup.
  if (store.hasPrompts()) return state;

  const activePrompts = chooseActivePokemons(state);
  state = yield* resolveActivePromotions(next, store, state, activePrompts);

  // Promotion effects can themselves change which player wins.
  if (activePrompts.length > 0) checkWinner(store, state, onComplete);
  else onComplete?.();

  return state;
}

export function checkState(store: StoreLike, state: State, onComplete?: () => void): State {
  if ([GamePhase.PLAYER_TURN, GamePhase.ATTACK, GamePhase.BETWEEN_TURNS].includes(state.phase) === false) {
    if (onComplete !== undefined) {
      onComplete();
    }
    return state;
  }
  const generator = executeCheckState(() => generator.next(), store, state, onComplete);
  return generator.next().value;
}

export function checkStateReducer(store: StoreLike, state: State, effect: Effect): State {

  if (effect instanceof CheckProvidedEnergyEffect) {
    // Check regular energy cards in main cards array
    effect.source.cards.forEach(c => {
      if (c instanceof EnergyCard && !effect.energyMap.some(e => e.card === c)) {
        effect.energyMap.push({ card: c, provides: c.provides });
      }
    });
    // Check Pokemon-as-energy cards in energies CardList
    if (effect.source instanceof PokemonCardList) {
      effect.source.energies.cards.forEach(c => {
        if (!effect.energyMap.some(e => e.card === c)) {
          // For Pokemon-as-energy, the provides property is set by the card itself
          const provides = (c as any).provides || [];
          if (provides.length > 0) {
            effect.energyMap.push({ card: c, provides });
          }
        }
      });
    }
    return state;
  }
  return state;
}
