import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import type { PokemonCard } from '../card/pokemon-card';
import { Power, PowerType } from '../card/pokemon-types';
import { CheckPokemonPowersEffect } from '../effects/check-effects';
import type { Effect } from '../effects/effect';
import { PowerEffect } from '../effects/game-effects';
import { StateUtils } from '../state-utils';
import { recordActiveAbilityLockOrder } from '../state/active-ability-lock-order';
import type { Player } from '../state/player';
import { PokemonCardList } from '../state/pokemon-card-list';
import { GamePhase, State } from '../state/state';
import type { StoreLike } from '../store-like';
import { CAN_APPLY_ABILITY_TO_TARGET } from './effect-of-ability-prefabs';

interface AbilityRecipient {
  player: Player;
  card: PokemonCard;
  slot?: PokemonCardList;
}

export interface ActiveAbilityLock {
  power: Power;
  affects(store: StoreLike, state: State, owner: Player, target: AbilityRecipient): boolean;
  exemptAbility?: string;
  checkTargetProtection?: boolean;
}

const probingActiveLocks = new WeakSet<State>();

function suppressesPower(lock: ActiveAbilityLock, power: Power): boolean {
  return power.powerType === PowerType.ABILITY && !power.exemptFromAbilityLock && power.name !== lock.exemptAbility;
}

function canUseLock(store: StoreLike, state: State, owner: Player, source: PokemonCard, lock: ActiveAbilityLock): boolean {
  try {
    const probe = new PowerEffect(owner, lock.power, source, owner.active);
    store.reduceEffect(state, probe);
    return !probe.preventDefault;
  } catch {
    // Power-effect probes signal suppression by throwing.
    return false;
  }
}

function reachesTarget(
  store: StoreLike, state: State, owner: Player, source: PokemonCard, lock: ActiveAbilityLock, target: AbilityRecipient
): boolean {
  return !lock.checkTargetProtection || !target.slot
    || CAN_APPLY_ABILITY_TO_TARGET(store, state, owner, lock.power, source, target.slot);
}

function suppresses(
  store: StoreLike, state: State, owner: Player, source: PokemonCard, lock: ActiveAbilityLock, recipient: AbilityRecipient
): boolean {
  probingActiveLocks.add(state);
  try {
    if (!lock.affects(store, state, owner, recipient)
      || !canUseLock(store, state, owner, source, lock)) {
      return false;
    }

    const otherPlayer = StateUtils.getOpponent(state, owner);
    const other = otherPlayer.active.getPokemonCard();
    const otherLock = other?.activeAbilityLock?.();
    if (other && otherLock && suppressesPower(otherLock, lock.power)
      && otherLock.affects(store, state, otherPlayer, { player: owner, card: source, slot: owner.active })
      && canUseLock(store, state, otherPlayer, other, otherLock)
      && reachesTarget(store, state, otherPlayer, other, otherLock, { player: owner, card: source, slot: owner.active })) {
      const order = recordActiveAbilityLockOrder(state);
      // The order matters only when both Abilities can reach each other.
      if (order[0]?.playerId !== owner.id || !suppressesPower(lock, otherLock.power)
        || !lock.affects(store, state, owner, { player: otherPlayer, card: other, slot: otherPlayer.active })
        || !reachesTarget(store, state, owner, source, lock, { player: otherPlayer, card: other, slot: otherPlayer.active })) {
        return false;
      }
    }

    return reachesTarget(store, state, owner, source, lock, recipient);
  } finally {
    probingActiveLocks.delete(state);
  }
}

export function applyActiveAbilityLock(store: StoreLike, state: State, effect: Effect, source: PokemonCard): void {
  if ((!(effect instanceof PowerEffect) && !(effect instanceof CheckPokemonPowersEffect))
    || state.phase < GamePhase.PLAYER_TURN || probingActiveLocks.has(state)) {
    return;
  }
  const owner = state.players.find(player => player.active.getPokemonCard() === source);
  if (!owner) {
    return;
  }
  const lock = source.activeAbilityLock?.();
  const powers = effect instanceof PowerEffect ? [effect.power] : effect.powers;
  if (!lock || !powers.some(power => suppressesPower(lock, power))) {
    return;
  }
  const card = effect instanceof PowerEffect ? effect.card : effect.target;
  const slot = StateUtils.findPokemonSlot(state, card);
  const inPlay = slot?.getPokemonCard() === card ? slot : undefined;
  const recipient = { player: inPlay ? StateUtils.findOwner(state, inPlay) : effect.player, card, slot: inPlay };
  if (!suppresses(store, state, owner, source, lock, recipient)) {
    return;
  }
  if (effect instanceof PowerEffect) {
    throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
  }
  effect.powers = effect.powers.filter(power => !suppressesPower(lock, power));
}
