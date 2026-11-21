import { GameError } from '../../game-error';
import { GameLog, GameMessage } from '../../game-message';
import type { Card } from '../card/card';
import { Stage } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { PowerType } from '../card/pokemon-types';
import { CheckPokemonPlacementEffect } from '../effects/check-effects';
import { EndTurnEffect } from '../effects/game-phase-effects';
import { AfterBenchBasicPokemonEffect, AfterPlayBasicFromHandEffect, PlayPokemonFromDeckEffect } from '../effects/play-card-effects';
import { SelectPrompt } from '../prompts/select-prompt';
import { StateUtils } from '../state-utils';
import type { Player } from '../state/player';
import type { CardList } from '../state/card-list';
import type { PokemonCardList } from '../state/pokemon-card-list';
import { GamePhase, State } from '../state/state';
import type { StoreLike } from '../store-like';
import { IS_ABILITY_BLOCKED, IS_POKEPOWER_BLOCKED } from './prefabs';
import { IS_STADIUM_EFFECT_BLOCKED } from './stadium-effect';

export function canPlacePokemon(store: StoreLike, state: State, player: Player, card: PokemonCard): boolean {
  return !getBlockedPokemonPlacements(store, state, player, [card]).has(card);
}

export function getBlockedPokemonPlacements(store: StoreLike, state: State, player: Player,
  cards: readonly Card[]): ReadonlySet<PokemonCard> {
  const candidates = cards.filter((card): card is PokemonCard => card instanceof PokemonCard);
  const check = new CheckPokemonPlacementEffect(player, candidates);
  if (candidates.length) store.reduceEffect(state, check);
  return check.blocked;
}

export function getBlockedPokemonPlacementIndices(store: StoreLike, state: State, player: Player,
  source: CardList, alreadyBlocked: readonly number[] = []): number[] {
  const blocked = getBlockedPokemonPlacements(store, state, player, source.cards);
  return blocked.size === 0 ? [...alreadyBlocked] : source.cards.flatMap((card, index) =>
    alreadyBlocked.includes(index) || (card instanceof PokemonCard && blocked.has(card)) ? [index] : []);
}

/** Resolve triggers after the physical card and its continuous effects are in play. */
export function resolveBenchPlayReactions(store: StoreLike, state: State, effect: AfterBenchBasicPokemonEffect): State {
  const turn = state.turn;
  state = store.reduceEffect(state, effect);
  const next = () => {
    const eligible = effect.reactions.filter(reaction => reaction.canResolve());
    if (eligible.length === 0) {
      if (effect.endTurn && state.turn === turn && state.phase === GamePhase.PLAYER_TURN
        && state.players[state.activePlayer] === effect.player) store.reduceEffect(state, new EndTurnEffect(effect.player));
      return;
    }
    const priority = Math.min(...eligible.map(reaction => reaction.priority ?? 0));
    const available = eligible.filter(reaction => (reaction.priority ?? 0) === priority);

    const resolve = (index: number) => {
      const chosen = available[index];
      if (!Number.isInteger(index) || !chosen) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
      effect.reactions.splice(effect.reactions.indexOf(chosen), 1);
      if (chosen.canResolve()) chosen.resolve();
      if (state.prompts.some(prompt => prompt.result === undefined)) store.waitPrompt(state, next);
      else next();
    };

    if (available.length === 1) resolve(0);
    else store.prompt(state, new SelectPrompt(effect.player.id, GameMessage.CHOOSE_BENCH_EFFECT_ORDER,
      available.map(reaction => reaction.label), { allowCancel: false }), resolve);
  };
  next();
  return state;
}

export function queueBenchPlayAbility(store: StoreLike, state: State, effect: AfterPlayBasicFromHandEffect,
  resolve: () => void, eligible: () => boolean = () => true, timing?: 'after-stadium'): void {
  const { player, pokemonCard, target } = effect;
  if (!effect.playedByOwner || state.phase !== GamePhase.PLAYER_TURN || state.players[state.activePlayer] !== player) return;

  const power = pokemonCard.powers[0];
  const isBlocked = power.powerType === PowerType.POKEPOWER ? IS_POKEPOWER_BLOCKED : IS_ABILITY_BLOCKED;
  const canResolve = () => player.getPokemonInPlay().includes(target)
    && target.getPokemonCard() === pokemonCard
    && eligible() && !isBlocked(store, state, player, pokemonCard);
  if (canResolve()) effect.reactions.push({
    source: pokemonCard, label: power.name, priority: timing === 'after-stadium' ? 1 : 0, canResolve, resolve,
  });
}

export function queueBenchStadiumCounters(store: StoreLike, state: State, effect: AfterBenchBasicPokemonEffect,
  stadium: Card, eligible: () => boolean = () => true): void {
  if (StateUtils.getStadiumCard(state) !== stadium) return;
  const { player, target, pokemonCard } = effect;
  const canResolve = () => StateUtils.getStadiumCard(state) === stadium
    && player.getPokemonInPlay().includes(target) && target.getPokemonCard() === pokemonCard
    && eligible()
    && !IS_STADIUM_EFFECT_BLOCKED(store, state, player, target, stadium);
  if (canResolve()) effect.reactions.push({
    source: stadium,
    label: stadium.name,
    canResolve,
    resolve: () => {
      store.log(state, GameLog.LOG_PLAYER_PLACES_DAMAGE_COUNTERS, {
        name: player.name, damage: 20, target: pokemonCard.name, effect: stadium.name,
      });
      target.damage += 20;
    },
  });
}

/** Effects may put several cards into play together without their owner playing them. */
export function benchPokemonFromZone(store: StoreLike, state: State, player: Player, source: CardList,
  cards: readonly Card[], targets: readonly PokemonCardList[],
  finishPlacementEffect?: (target: PokemonCardList) => void): void {
  const blocked = getBlockedPokemonPlacements(store, state, player, cards);
  const placed: PokemonCardList[] = [];
  const completions: AfterBenchBasicPokemonEffect[] = [];
  cards.forEach((card, index) => {
    const target = targets[index];
    if ((source === player.hand && !(card instanceof PokemonCard)) || !source.cards.includes(card)
      || (card instanceof PokemonCard && blocked.has(card))
      || !target || !player.bench.includes(target) || target.cards.length > 0) return;

    source.moveCardTo(card, target);
    target.pokemonPlayedTurn = state.turn;
    placed.push(target);
    const pokemon = target.getPokemonCard();
    if (pokemon === card && pokemon.stage === Stage.BASIC) {
      completions.push(source === player.hand
        ? new AfterPlayBasicFromHandEffect(player, pokemon, target, false)
        : new AfterBenchBasicPokemonEffect(player, pokemon, target));
    }
  });
  if (finishPlacementEffect) placed.forEach(finishPlacementEffect);
  for (const completion of completions) resolveBenchPlayReactions(store, state, completion);
}

export function benchPokemonFromHand(store: StoreLike, state: State, player: Player, cards: readonly Card[],
  targets: readonly PokemonCardList[], finishPlacementEffect?: (target: PokemonCardList) => void): void {
  benchPokemonFromZone(store, state, player, player.hand, cards, targets, finishPlacementEffect);
}

/** Preserve normal deck placement events while settling simultaneous entries together. */
export function playBenchPokemonBatchFromDeck(store: StoreLike, state: State, player: Player, cards: readonly Card[],
  targets: readonly PokemonCardList[]): void {
  const completions: AfterBenchBasicPokemonEffect[] = [];
  cards.forEach((card, index) => {
    const placement = new PlayPokemonFromDeckEffect(player, card as PokemonCard, targets[index]);
    placement.completionBatch = completions;
    store.reduceEffect(state, placement);
  });
  for (const completion of completions) resolveBenchPlayReactions(store, state, completion);
}
