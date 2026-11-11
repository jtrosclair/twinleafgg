import { AttachEnergyEffect } from '../effects/play-card-effects';
import { AttackEffect } from '../effects/game-effects';
import { PutCountersEffect } from '../effects/attack-effects';
import { GameError } from '../../game-error';
import { GameMessage, GameLog } from '../../game-message';
import { Effect } from '../effects/effect';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { EnergyType } from '../card/card-types';
import { SlotType } from '../actions/play-card-action';
import { PlayerType } from '../actions/play-card-action';

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

    const fromHand = effect.player.hand.cards.includes(effect.energyCard);
    const pendingAttachDamage = effect.target.pendingEnergyAttachDamageCounters;
    if (fromHand && pendingAttachDamage) {
      const attacker = state.players.find(player => player.id === pendingAttachDamage.attackerPlayerId);
      if (attacker) {
        let source = attacker.active;
        attacker.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, card) => {
          if (card === pendingAttachDamage.sourceCard) source = slot;
        });
        const attack = new AttackEffect(attacker, effect.player, pendingAttachDamage.attack);
        attack.source = source;
        const counters = new PutCountersEffect(attack, pendingAttachDamage.damage);
        counters.target = effect.target;
        state = store.reduceEffect(state, counters);
      }
    }

    store.log(state, GameLog.LOG_PLAYER_ATTACHES_CARD, {
      name: effect.player.name,
      card: effect.energyCard.name,
      pokemon: pokemonCard.name
    });
    // Move card to main PokemonCardList first (so it's in the cards array)
    effect.player.hand.moveCardTo(effect.energyCard, effect.target);
    // Then also add it to the energies CardList
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

    return state;
  }

  return state;
}

