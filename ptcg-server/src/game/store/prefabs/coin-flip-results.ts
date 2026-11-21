import { AttackEffect } from '../effects/game-effects';
import { Player } from '../state/player';
import { GamePhase, State } from '../state/state';
import { afterAttackDamage } from './attack-after-damage';

export const COIN_FLIPS_TREATED_AS_TAILS = 'COIN_FLIPS_TREATED_AS_TAILS';

/** Attacks with this wording affect the opposing player for their next turn. */
export function opponentFlipsTailsNextTurn(state: State, effect: AttackEffect): void {
  const source = effect.source.getPokemonCard();
  if (!source) return;
  afterAttackDamage(state, effect, (_store, afterState) => {
    effect.opponent.marker.addMarker(COIN_FLIPS_TREATED_AS_TAILS, source, 'attack', 'player');
    return afterState;
  });
}

export function isCoinForcedTails(state: State, player: Player | undefined): boolean {
  return player !== undefined && state.players[state.activePlayer] === player
    && (state.phase === GamePhase.PLAYER_TURN || state.phase === GamePhase.ATTACK)
    && player.marker.hasMarker(COIN_FLIPS_TREATED_AS_TAILS);
}

export function rollCoin(state: State, player: Player, forcedResult?: boolean): boolean {
  return !isCoinForcedTails(state, player) && (forcedResult ?? Math.random() < 0.5);
}
