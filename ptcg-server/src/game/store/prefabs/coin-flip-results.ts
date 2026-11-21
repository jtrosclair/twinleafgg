import { CheckCoinFlipResultEffect } from '../effects/check-effects';
import { AttackEffect } from '../effects/game-effects';
import { Player } from '../state/player';
import { GamePhase, State } from '../state/state';
import { MarkerConstants } from '../markers/marker-constants';
import { MarkerItem } from '../state/card-marker';
import { StoreLike } from '../store-like';
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

export function isLegacySmokescreenMarker(marker: MarkerItem): boolean {
  return marker.name === MarkerConstants.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER
    && (marker.source?.fullName === 'Weezing DX' || marker.source?.fullName === 'Seadra DF');
}

export function isCoinForcedTails(store: StoreLike, state: State, player: Player): boolean {
  if (state.players[state.activePlayer] !== player
    || (state.phase !== GamePhase.PLAYER_TURN && state.phase !== GamePhase.ATTACK)) return false;
  if (player.marker.hasMarker(COIN_FLIPS_TREATED_AS_TAILS)) return true;

  const check = new CheckCoinFlipResultEffect(player);
  store.reduceEffect(state, check);
  return check.forcedTails;
}

export function rollCoin(store: StoreLike, state: State, player: Player, forcedResult?: boolean): boolean {
  return forcedResult !== false && !isCoinForcedTails(store, state, player)
    && (forcedResult ?? Math.random() < 0.5);
}
