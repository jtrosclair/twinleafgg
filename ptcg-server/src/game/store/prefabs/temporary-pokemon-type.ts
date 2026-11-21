import { CardType } from '../card/card-types';
import type { PokemonCardList } from '../state/pokemon-card-list';
import { GamePhase, State } from '../state/state';

export const DARK_ENGAGE_MARKER = 'DARK_ENGAGE_MARKER';
const TEMPORARY_TYPE = 'TEMPORARY_POKEMON_TYPE:';
const WHILE_IN_PLAY = TEMPORARY_TYPE + 'IN_PLAY:';
const WHILE_ACTIVE = TEMPORARY_TYPE + 'ACTIVE:';

export function setPokemonTypeForTurn(state: State, target: PokemonCardList, type: CardType, activeOnly: boolean): void {
  const prefix = activeOnly ? WHILE_ACTIVE : WHILE_IN_PLAY;
  target.marker.markers = target.marker.markers.filter(marker => !marker.name.startsWith(prefix));
  target.marker.addMarkerToState(prefix + state.turn + ':' + type);
}

export function keepsPokemonTypeOnBench(marker: { name: string }): boolean {
  return marker.name.startsWith(WHILE_IN_PLAY);
}

export function getPokemonTypeForTurn(state: State, target: PokemonCardList): CardType | undefined {
  if (state.phase !== GamePhase.PLAYER_TURN && state.phase !== GamePhase.ATTACK) return;

  for (let index = target.marker.markers.length - 1; index >= 0; index--) {
    const name = target.marker.markers[index].name;
    const prefix = name.startsWith(WHILE_ACTIVE) ? WHILE_ACTIVE : WHILE_IN_PLAY;
    const turn = prefix + state.turn + ':';
    if (!name.startsWith(turn) || (prefix === WHILE_ACTIVE && state.players[state.activePlayer]?.active !== target)) continue;
    const type = Number(name.slice(turn.length));
    if (Number.isInteger(type) && type > CardType.ANY && type < CardType.NONE) return type;
  }

  // Older snapshots put Dark Engage on the player who used it.
  const player = state.players[state.activePlayer];
  if (player?.active === target && player.marker.hasMarker(DARK_ENGAGE_MARKER)) return CardType.DARK;
}

export function clearPokemonTypeReplacements(target: PokemonCardList): void {
  target.marker.markers = target.marker.markers.filter(marker => !marker.name.startsWith(TEMPORARY_TYPE));
}
