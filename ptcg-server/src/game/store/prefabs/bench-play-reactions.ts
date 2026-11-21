import { GameError } from '../../game-error';
import { GameLog, GameMessage } from '../../game-message';
import type { Card } from '../card/card';
import { Stage } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { EndTurnEffect } from '../effects/game-phase-effects';
import { AfterPlayBasicFromHandEffect } from '../effects/play-card-effects';
import { SelectPrompt } from '../prompts/select-prompt';
import { StateUtils } from '../state-utils';
import type { Player } from '../state/player';
import type { PokemonCardList } from '../state/pokemon-card-list';
import { GamePhase, State } from '../state/state';
import type { StoreLike } from '../store-like';
import { IS_ABILITY_BLOCKED } from './prefabs';
import { IS_STADIUM_EFFECT_BLOCKED } from './stadium-effect';

/** Resolve triggers after the physical card and its continuous effects are in play. */
export function resolveBenchPlayReactions(store: StoreLike, state: State, effect: AfterPlayBasicFromHandEffect): State {
  const turn = state.turn;
  state = store.reduceEffect(state, effect);
  const next = () => {
    const available = effect.reactions.filter(reaction => reaction.canResolve());
    if (available.length === 0) {
      if (effect.endTurn && state.turn === turn && state.phase === GamePhase.PLAYER_TURN
        && state.players[state.activePlayer] === effect.player) store.reduceEffect(state, new EndTurnEffect(effect.player));
      return;
    }

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
  resolve: () => void, eligible: () => boolean = () => true): void {
  const { player, pokemonCard, target } = effect;
  if (!effect.playedByOwner || state.phase !== GamePhase.PLAYER_TURN || state.players[state.activePlayer] !== player) return;

  const canResolve = () => player.getPokemonInPlay().includes(target)
    && target.getPokemonCard() === pokemonCard
    && eligible() && !IS_ABILITY_BLOCKED(store, state, player, pokemonCard);
  if (canResolve()) effect.reactions.push({ label: pokemonCard.powers[0].name, canResolve, resolve });
}

export function queueBenchStadiumCounters(store: StoreLike, state: State, effect: AfterPlayBasicFromHandEffect,
  stadium: Card): void {
  if (StateUtils.getStadiumCard(state) !== stadium) return;
  const { player, target, pokemonCard } = effect;
  const canResolve = () => StateUtils.getStadiumCard(state) === stadium
    && player.getPokemonInPlay().includes(target) && target.getPokemonCard() === pokemonCard
    && !IS_STADIUM_EFFECT_BLOCKED(store, state, player, target, stadium);
  if (canResolve()) effect.reactions.push({
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
export function benchPokemonFromHand(store: StoreLike, state: State, player: Player,
  cards: readonly Card[], targets: readonly PokemonCardList[],
  finishPlacementEffect?: (target: PokemonCardList) => void): void {
  const placed: PokemonCardList[] = [];
  const completions: AfterPlayBasicFromHandEffect[] = [];
  cards.forEach((card, index) => {
    const target = targets[index];
    if (!(card instanceof PokemonCard) || !player.hand.cards.includes(card)
      || !target || !player.bench.includes(target) || target.cards.length > 0) return;

    player.hand.moveCardTo(card, target);
    target.pokemonPlayedTurn = state.turn;
    placed.push(target);
    if (card.stage === Stage.BASIC) completions.push(new AfterPlayBasicFromHandEffect(player, card, target, false));
  });
  if (finishPlacementEffect) placed.forEach(finishPlacementEffect);
  for (const completion of completions) resolveBenchPlayReactions(store, state, completion);
}
