import { AfterAttachEnergyFromHandEffect, AttachEnergyEffect } from '../effects/play-card-effects';
import { AttackEffect, MoveCardsEffect } from '../effects/game-effects';
import { PutCountersEffect } from '../effects/attack-effects';
import { GameError } from '../../game-error';
import { GameMessage, GameLog } from '../../game-message';
import { Effect } from '../effects/effect';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { EnergyType } from '../card/card-types';
import { SlotType } from '../actions/play-card-action';
import { PlayerType } from '../actions/play-card-action';
import { SelectPrompt } from '../prompts/select-prompt';

/**
 * Helper function to emit animation events
 */
function emitAnimationEvent(store: StoreLike, eventName: string, data: {
  playerId: number;
  cardId: number | string;
  slot?: string;
  index?: number;
}): void {
  const game = (store as any).handler;
  if (game && game.core && typeof game.core.emit === 'function') {
    game.core.emit((c: any) => {
      if (typeof c.socket !== 'undefined') {
        c.socket.emit(`game[${game.id}]:${eventName}`, data);
      }
    });
  }
}

export function playEnergyReducer(store: StoreLike, state: State, effect: Effect): State {

  if (effect instanceof AfterAttachEnergyFromHandEffect) {
    const { reactions } = effect;
    const waitIfNeeded = (next: () => void): void => {
      if (state.prompts.some(prompt => prompt.result === undefined)) store.waitPrompt(state, next);
      else next();
    };
    const applyReactions = (): void => {
      const available = [...reactions].filter(([, reaction]) => reaction.canResolve());
      if (available.length === 0) {
        effect.onSettled?.();
        return;
      }

      const resolve = (index: number): void => {
        const chosen = available[index];
        if (!Number.isInteger(index) || !chosen) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
        const [key, reaction] = chosen;
        reactions.delete(key);
        if (reaction.canResolve()) reaction.resolve();
        waitIfNeeded(applyReactions);
      };

      if (available.length === 1) {
        resolve(0);
      } else {
        const player = state.players[state.activePlayer] ?? effect.player;
        store.prompt(state, new SelectPrompt(player.id, GameMessage.CHOOSE_ENERGY_ATTACHMENT_EFFECT,
          available.map(([, reaction]) => reaction.label), { allowCancel: false }), resolve);
      }
    };

    const pending = effect.target.pendingEnergyAttachDamageCounters;
    const attacker = pending && state.players.find(player => player.id === pending.attackerPlayerId);
    if (pending && attacker) {
      let source = attacker.active;
      attacker.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, card) => {
        if (card === pending.sourceCard) source = slot;
      });
      const attack = new AttackEffect(attacker, effect.player, pending.attack);
      attack.source = source;
      const counters = new PutCountersEffect(attack, pending.damage);
      counters.target = effect.target;
      state = store.reduceEffect(state, counters);
    }
    if (reactions.size > 0 || effect.onSettled) waitIfNeeded(applyReactions);
    return state;
  }

  /* Play energy card */
  if (effect instanceof AttachEnergyEffect) {
    if (effect.target.energyAttachBlockedFromHandNextTurn
      && effect.sourceZone === undefined
      && effect.player.hand.cards.includes(effect.energyCard)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }
    if (effect.player.energyCardsBlockedNextTurn && effect.sourceZone === undefined) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }
    const pokemonCard = effect.target.getPokemonCard();
    if (pokemonCard === undefined) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }
    if (effect.energyCard.energyType === EnergyType.SPECIAL
      && effect.sourceZone === undefined
      && effect.player.marker.hasMarker(effect.player.ATTACK_EFFECT_SPECIAL_ENERGY_LOCK)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    const fromHand = effect.sourceZone === undefined && effect.player.hand.cards.includes(effect.energyCard);

    if (effect.sourceZone) {
      if (!effect.target.cards.includes(effect.energyCard)) {
        const source = effect.sourceList ?? effect.player[effect.sourceZone];
        if (!source.cards.includes(effect.energyCard)) return state;
        state = store.reduceEffect(state, new MoveCardsEffect(source, effect.target, { cards: [effect.energyCard] }));
      }
      if (!effect.target.cards.includes(effect.energyCard)) return state;
    } else {
      effect.player.hand.moveCardTo(effect.energyCard, effect.target);
    }

    store.log(state, GameLog.LOG_PLAYER_ATTACHES_CARD, {
      name: effect.player.name,
      card: effect.energyCard.name,
      pokemon: pokemonCard.name
    });
    // Keep the legacy attached-Energy list in sync with the physical card.
    if (!effect.target.energies.cards.includes(effect.energyCard)) {
      effect.target.energies.cards.push(effect.energyCard);
    }

    // Derive slot and index for animation/sound event
    const slot = effect.target === effect.player.active ? SlotType.ACTIVE : SlotType.BENCH;
    const index = slot === SlotType.BENCH ? effect.player.bench.indexOf(effect.target) : undefined;
    emitAnimationEvent(store, 'attachEnergy', {
      playerId: effect.player.id,
      cardId: effect.energyCard.id,
      slot: String(slot),
      index
    });

    if (fromHand && effect.target.cards.includes(effect.energyCard)) {
      const completion = new AfterAttachEnergyFromHandEffect(effect.player, effect.energyCard, effect.target);
      if (effect.completionBatch) effect.completionBatch.push(completion);
      else state = store.reduceEffect(state, completion);
    }
    return state;
  }

  return state;
}

