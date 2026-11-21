import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { CardType } from '../card/card-types';
import type { EnergyCard } from '../card/energy-card';
import type { PokemonCard } from '../card/pokemon-card';
import { PowerType } from '../card/pokemon-types';
import { CheckProvidedEnergyEffect } from '../effects/check-effects';
import type { AfterAttachEnergyEffect, AfterAttachEnergyFromHandEffect, QueuedHandEnergyReaction } from '../effects/play-card-effects';
import { SelectPrompt } from '../prompts/select-prompt';
import type { Player } from '../state/player';
import { GamePhase, State } from '../state/state';
import type { StoreLike } from '../store-like';
import { IS_ABILITY_BLOCKED, IS_POKEBODY_BLOCKED, IS_POKEMON_POWER_BLOCKED, IS_POKEPOWER_BLOCKED, IS_SPECIAL_ENERGY_BLOCKED } from './prefabs';

export function waitForHandEnergyPrompts(store: StoreLike, state: State, next: () => void): void {
  // The prompt callback may be running after its result was set but before
  // Store removes its bookkeeping item.
  if (state.prompts.some(prompt => prompt.result === undefined)) store.waitPrompt(state, next);
  else next();
}

export function resolveHandEnergyReactions(
  store: StoreLike, state: State, chooser: Player, reactions: QueuedHandEnergyReaction[],
): void {
  const next = (): void => {
    const available = reactions.filter(reaction => reaction.canResolve());
    if (available.length === 0) return;

    const resolve = (index: number): void => {
      const chosen = available[index];
      if (!Number.isInteger(index) || !chosen) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
      reactions.splice(reactions.indexOf(chosen), 1);
      if (chosen.canResolve()) chosen.resolve();
      if (reactions.length > 0) waitForHandEnergyPrompts(store, state, next);
    };

    const first = available[0];
    if (available.every(reaction => reaction.label === first.label && reaction.target === first.target
      && reaction.attachmentLabel === first.attachmentLabel)) {
      resolve(0);
      return;
    }

    const multipleTargets = available.some(reaction => reaction.target !== first.target);
    const labels = available.map(({ label, target }) =>
      multipleTargets ? `${label} (${target.getPokemonCard()?.name ?? ''})` : label);
    const locations = labels.map((label, index) => {
      if (!multipleTargets || labels.indexOf(label) === labels.lastIndexOf(label)) return label;
      const { target } = available[index];
      const owner = state.players.find(player => player.active === target || player.bench.includes(target));
      if (!owner) return label;
      const slot = owner.active === target ? 'Active' : `Bench ${owner.bench.indexOf(target) + 1}`;
      return `${label} · ${owner === chooser ? slot : `Opponent's ${slot}`}`;
    });
    const choices = locations.map((label, index) => {
      const { attachmentLabel } = available[index];
      return attachmentLabel && locations.indexOf(label) !== locations.lastIndexOf(label)
        ? `${label} · ${attachmentLabel}` : label;
    });
    store.prompt(state, new SelectPrompt(chooser.id, GameMessage.CHOOSE_ENERGY_ATTACHMENT_EFFECT, choices,
      { allowCancel: false }), resolve);
  };
  waitForHandEnergyPrompts(store, state, next);
}

export function resolveEnergyAttachmentCompletions(
  store: StoreLike, state: State, player: Player, completions: AfterAttachEnergyEffect[],
): void {
  const reactions: QueuedHandEnergyReaction[] = [];
  const complete = (index: number): void => {
    const completion = completions[index];
    if (!completion) {
      const chooser = state.players[state.activePlayer] ?? player;
      resolveHandEnergyReactions(store, state, chooser, reactions);
      return;
    }
    completion.reactionBatch = reactions;
    state = store.reduceEffect(state, completion);
    waitForHandEnergyPrompts(store, state, () => complete(index + 1));
  };
  if (completions.length > 0) complete(0);
}

export function queueSpecialEnergyReaction(
  store: StoreLike, state: State, effect: AfterAttachEnergyEffect, energy: EnergyCard,
  resolve: () => void, eligible: () => boolean = () => true,
): void {
  if (effect.energyCard !== energy) return;
  const { player, target } = effect;
  const canResolve = () => target.cards.includes(energy) && player.getPokemonInPlay().includes(target)
    && eligible() && !IS_SPECIAL_ENERGY_BLOCKED(store, state, player, energy, target);
  if (canResolve()) effect.reactions.set(energy.name, { label: energy.name, canResolve, resolve });
}

export function getAttachedEnergyTypes(store: StoreLike, state: State, effect: AfterAttachEnergyEffect): CardType[] {
  const provided = new CheckProvidedEnergyEffect(effect.player, effect.target);
  store.reduceEffect(state, provided);
  return [...new Set(provided.energyMap.flatMap(entry => entry.card === effect.energyCard ? entry.provides : []))];
}

export function attachedEnergyProvides(
  store: StoreLike, state: State, effect: AfterAttachEnergyEffect, ...types: CardType[]
): boolean {
  return getAttachedEnergyTypes(store, state, effect).some(type => type === CardType.ANY || types.includes(type));
}

export function isHandAttachmentBeforeAttack(state: State, effect: AfterAttachEnergyFromHandEffect): boolean {
  return state.phase === GamePhase.PLAYER_TURN && state.players[state.activePlayer] === effect.player
    && effect.sourcePower !== PowerType.POKEPOWER;
}

export function queuePokemonEnergyReaction(
  store: StoreLike, state: State, effect: AfterAttachEnergyEffect, pokemon: PokemonCard,
  resolve: () => void, eligible: () => boolean = () => true, attachmentLabel?: string,
): void {
  const { player, target } = effect;
  const power = pokemon.powers[0];
  const blocked = power.powerType === PowerType.POKEBODY ? IS_POKEBODY_BLOCKED
    : power.powerType === PowerType.POKEPOWER ? IS_POKEPOWER_BLOCKED
    : power.powerType === PowerType.POKEMON_POWER ? IS_POKEMON_POWER_BLOCKED : IS_ABILITY_BLOCKED;
  const canResolve = () => player.getPokemonInPlay().some(slot => slot.getPokemonCard() === pokemon)
    && player.getPokemonInPlay().includes(target) && eligible() && !blocked(store, state, player, pokemon);
  if (canResolve()) effect.reactions.set(power.name, { label: power.name, attachmentLabel, canResolve, resolve });
}
