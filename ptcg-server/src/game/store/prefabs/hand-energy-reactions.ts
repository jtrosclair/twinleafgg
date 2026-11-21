import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import type { EnergyCard } from '../card/energy-card';
import type { AfterAttachEnergyFromHandEffect, QueuedHandEnergyReaction } from '../effects/play-card-effects';
import { SelectPrompt } from '../prompts/select-prompt';
import type { Player } from '../state/player';
import type { State } from '../state/state';
import type { StoreLike } from '../store-like';
import { IS_SPECIAL_ENERGY_BLOCKED } from './prefabs';

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
    if (available.every(reaction => reaction.label === first.label && reaction.target === first.target)) {
      resolve(0);
      return;
    }

    const multipleTargets = available.some(reaction => reaction.target !== first.target);
    const labels = available.map(({ label, target }) =>
      multipleTargets ? `${label} (${target.getPokemonCard()?.name ?? ''})` : label);
    store.prompt(state, new SelectPrompt(chooser.id, GameMessage.CHOOSE_ENERGY_ATTACHMENT_EFFECT, labels,
      { allowCancel: false }), resolve);
  };
  waitForHandEnergyPrompts(store, state, next);
}

export function queueSpecialEnergyReaction(
  store: StoreLike, state: State, effect: AfterAttachEnergyFromHandEffect, energy: EnergyCard,
  resolve: () => void, eligible: () => boolean = () => true,
): void {
  if (effect.energyCard !== energy) return;
  const { player, target } = effect;
  const canResolve = () => target.cards.includes(energy) && player.getPokemonInPlay().includes(target)
    && eligible() && !IS_SPECIAL_ENERGY_BLOCKED(store, state, player, energy, target);
  if (canResolve()) effect.reactions.set(energy.name, { label: energy.name, canResolve, resolve });
}
