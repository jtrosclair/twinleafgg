import {
  AttachPokemonToolEffect, TrainerEffect, PlaySupporterEffect,
  PlayItemEffect, PlayStadiumEffect
} from '../effects/play-card-effects';
import { GameError } from '../../game-error';
import { GameMessage, GameLog } from '../../game-message';
import { Effect } from '../effects/effect';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { StateUtils } from '../state-utils';
import { CardTag, TrainerType } from '../card/card-types';
import { Player } from '../state/player';
import { TrainerCard } from '../card/trainer-card';
import { CoinFlipEffect } from '../effects/play-card-effects';

function getTrainerCleanupTarget(player: Player, trainerCard: TrainerCard) {
  return trainerCard.tags.includes(CardTag.PRISM_STAR) ? player.lostzone : player.discard;
}

function restorePlayedTrainerToPlayZoneIfNeeded(store: StoreLike, player: Player, trainerCard: TrainerCard) {
  // Legacy card implementations may discard immediately even though prompts are pending.
  // If prompts exist, keep the played trainer visible in the play zone until completion.
  if (!store.hasPrompts()) {
    return;
  }

  if (player.discard.cards.includes(trainerCard)) {
    player.discard.moveCardTo(trainerCard, player.supporter);
  }
}

function finalizeTrainerCleanup(
  store: StoreLike,
  state: State,
  player: Player,
  trainerCard: TrainerCard,
  keepSupporterUntilEndTurn: boolean
): State {
  if (keepSupporterUntilEndTurn) {
    return state;
  }

  const cleanup = () => {
    if (!player.supporter.cards.includes(trainerCard)) {
      return;
    }
    const target = getTrainerCleanupTarget(player, trainerCard);
    player.supporter.moveCardTo(trainerCard, target);
  };

  if (store.hasPrompts()) {
    return store.waitPrompt(state, cleanup);
  }

  cleanup();
  return state;
}


/**
 * A Legendary Stadium is attempted as one card, so resolve the Trainer
 * cancellation coin before in-play Stadiums observe the attempted play.
 * Returns undefined when this is not the guarded case.
 */
export function preflightDualStadiumCancellation(store: StoreLike, state: State, effect: Effect): State | undefined {
  if (!(effect instanceof PlayStadiumEffect) || effect.dualCancellationChecked
    || !effect.trainerCard.tags.includes(CardTag.DUAL_STADIUM)
    || effect.player.coinFlipCancelTrainerPlayTurnsRemaining <= 0
    || !effect.player.hand.cards.includes(effect.trainerCard)) return undefined;

  const player = effect.player;
  const partner = player.hand.cards.find(card => card !== effect.trainerCard
    && card.name === effect.trainerCard.name && card.set === effect.trainerCard.set
    && card.tags.includes(CardTag.DUAL_STADIUM) && card.setNumber !== effect.trainerCard.setNumber);
  if (!partner) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  if (player.marker.hasMarker(player.ATTACK_EFFECT_STADIUM_LOCK)) throw new GameError(GameMessage.BLOCKED_BY_EFFECT);

  effect.dualCancellationChecked = true;
  return store.reduceEffect(state, new CoinFlipEffect(player, result => {
    if (!result) {
      const destination = getTrainerCleanupTarget(player, effect.trainerCard);
      player.hand.moveCardTo(partner, destination);
      player.hand.moveCardTo(effect.trainerCard, destination);
    } else {
      // Re-enter the normal pipeline only after heads so an in-play Stadium
      // can observe the successful play, without a second cancellation coin.
      store.reduceEffect(state, effect);
    }
  }));
}

// Upstream coin-flip gate: run before any play-zone changes, attachment or replacement.
export function playTrainerReducer(store: StoreLike, state: State, effect: Effect): State {
  if ((effect instanceof PlayItemEffect || effect instanceof PlaySupporterEffect
    || effect instanceof PlayStadiumEffect || effect instanceof AttachPokemonToolEffect)
    && effect.player.trainerCardsBlockedNextTurn) {
    throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
  }
  // A dual Stadium is legal only when both different halves are present.
  // Check before the coin-flip gate or any other play-zone mutation.
  if (effect instanceof PlayStadiumEffect && effect.trainerCard.tags.includes(CardTag.DUAL_STADIUM)
    && effect.player.hand.cards.includes(effect.trainerCard)) {
    const halves = effect.player.hand.cards.filter(card => card.name === effect.trainerCard.name
      && card.tags.includes(CardTag.DUAL_STADIUM) && card.set === effect.trainerCard.set);
    if (!effect.player.hand.cards.includes(effect.trainerCard)
      || !halves.some(card => card.setNumber !== effect.trainerCard.setNumber)) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }
  }
  if ((effect instanceof PlayItemEffect || effect instanceof PlaySupporterEffect
    || effect instanceof PlayStadiumEffect || effect instanceof AttachPokemonToolEffect)
    && effect.player.coinFlipCancelTrainerPlayTurnsRemaining > 0
    && !(effect instanceof PlayStadiumEffect && effect.dualCancellationChecked)
    && effect.player.hand.cards.includes(effect.trainerCard)) {
    const player = effect.player;
    return store.reduceEffect(state, new CoinFlipEffect(player, result => {
      if (!result) {
        if (effect instanceof PlayStadiumEffect && effect.trainerCard.tags.includes(CardTag.DUAL_STADIUM)) {
          const partner = player.hand.cards.find(card => card !== effect.trainerCard
            && card.name === effect.trainerCard.name && card.set === effect.trainerCard.set
            && card.tags.includes(CardTag.DUAL_STADIUM) && card.setNumber !== effect.trainerCard.setNumber);
          if (partner) player.hand.moveCardTo(partner, getTrainerCleanupTarget(player, effect.trainerCard));
        }
        player.hand.moveCardTo(effect.trainerCard, getTrainerCleanupTarget(player, effect.trainerCard));
        return;
      }
      playTrainerWithoutCoinFlip(store, state, effect);
    }));
  }
  return playTrainerWithoutCoinFlip(store, state, effect);
}

function playTrainerWithoutCoinFlip(store: StoreLike, state: State, effect: Effect): State {

  /* Play supporter card */
  if (effect instanceof PlaySupporterEffect) {
    const player = effect.player;

    if (player.marker.hasMarker(player.ATTACK_EFFECT_SUPPORTER_LOCK)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }
    if (player.supporterCardsBlockedNextTurn) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    const playTrainer = new TrainerEffect(player, effect.trainerCard, effect.target);
    state = store.reduceEffect(state, playTrainer);
    restorePlayedTrainerToPlayZoneIfNeeded(store, player, effect.trainerCard);
    state = finalizeTrainerCleanup(
      store,
      state,
      player,
      effect.trainerCard,
      state.rules.supporterCleanupAtEndTurn
    );
    store.log(state, GameLog.LOG_PLAYER_PLAYS_SUPPORTER, {
      name: player.name,
      card: effect.trainerCard.name
    });

    player.supporterTurn += 1;

    return state;
  }

  /* Play stadium card */
  if (effect instanceof PlayStadiumEffect) {
    const player = effect.player;
    const opponent = StateUtils.getOpponent(state, player);
    const stadiumCard = StateUtils.getStadiumCard(state);

    if (player.marker.hasMarker(player.ATTACK_EFFECT_STADIUM_LOCK)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    // Successful play: commit the turn allowance before replacing the old Stadium.
    player.stadiumPlayedTurn = state.turn;
    // Handle player's existing stadium
    if (player.stadium.cards.length > 0) {
      if (stadiumCard && stadiumCard.tags.includes(CardTag.PRISM_STAR)) {
        player.stadium.moveTo(player.lostzone);
      } else {
        player.stadium.moveTo(player.discard);
      }
    }

    // Handle opponent's existing stadium
    if (opponent.stadium.cards.length > 0) {
      if (stadiumCard && stadiumCard.tags.includes(CardTag.PRISM_STAR)) {
        opponent.stadium.moveTo(opponent.lostzone);
      } else {
        opponent.stadium.moveTo(opponent.discard);
      }
    }

    store.log(state, GameLog.LOG_PLAYER_PLAYS_STADIUM, {
      name: effect.player.name,
      card: effect.trainerCard.name
    });
    player.stadiumUsedTurn = 0;
    if (effect.trainerCard.tags.includes(CardTag.DUAL_STADIUM) && player.hand.cards.includes(effect.trainerCard)) {
      const half = effect.player.hand.cards.find(card => card !== effect.trainerCard
        && card.name === effect.trainerCard.name && card.set === effect.trainerCard.set
        && card.tags.includes(CardTag.DUAL_STADIUM) && card.setNumber !== effect.trainerCard.setNumber)!;
      // Left half first, so the standard Stadium lookup works regardless of which was played.
      const pair = [effect.trainerCard, half].sort((a, b) => Number(a.setNumber) - Number(b.setNumber));
      pair.forEach(card => player.hand.moveCardTo(card, player.stadium));
    } else {
      player.hand.moveCardTo(effect.trainerCard, player.stadium);
    }
    return state;
  }

  // Play Pokemon Tool card
  if (effect instanceof AttachPokemonToolEffect) {
    const player = effect.player;
    const target = effect.target;
    const trainerCard = effect.trainerCard;
    const pokemonCard = target.getPokemonCard();

    if (pokemonCard === undefined) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }
    if (effect.target.tools.length >= pokemonCard.maxTools) {
      throw new GameError(GameMessage.POKEMON_TOOL_ALREADY_ATTACHED);
    }
    if (player.marker.hasMarker(effect.player.ATTACK_EFFECT_TOOL_LOCK)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    store.log(state, GameLog.LOG_PLAYER_PLAYS_TOOL, {
      name: player.name,
      card: trainerCard.name,
      pokemon: pokemonCard.name
    });
    player.hand.moveCardTo(trainerCard, target);
    // Remove from cards if present (should only be in tools)
    const idx = target.cards.indexOf(trainerCard);
    if (idx !== -1) {
      target.cards.splice(idx, 1);
    }
    target.tools.push(effect.trainerCard);

    const playTrainer = new TrainerEffect(player, trainerCard, target);
    state = store.reduceEffect(state, playTrainer);

    return state;
  }

  // Play item card
  if (effect instanceof PlayItemEffect) {
    const player = effect.player;
    if (player.marker.hasMarker(player.ATTACK_EFFECT_ITEM_LOCK)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    const playTrainer = new TrainerEffect(effect.player, effect.trainerCard, effect.target);
    effect.player.hand.moveCardTo(effect.trainerCard, effect.player.supporter);
    state = store.reduceEffect(state, playTrainer);
    restorePlayedTrainerToPlayZoneIfNeeded(store, effect.player, effect.trainerCard);
    state = finalizeTrainerCleanup(store, state, effect.player, effect.trainerCard, false);
    store.log(state, GameLog.LOG_PLAYER_PLAYS_ITEM, {
      name: effect.player.name,
      card: effect.trainerCard.name
    });

    return state;
  }

  // Process trainer effect
  if (effect instanceof TrainerEffect) {
    if (effect.player.hand.cards.includes(effect.trainerCard)) {
      // IF DIAMOND/PEARL FORMAT, SUPPORTER WILL STAY ON FIELD UNTIL THE END OF YOUR TURN
      const isSupporter = effect.trainerCard.trainerType === TrainerType.SUPPORTER;
      const target = isSupporter ? effect.player.supporter : effect.player.discard;
      effect.player.hand.moveCardTo(effect.trainerCard, target);
    }
    return state;
  }
  return state;
}
