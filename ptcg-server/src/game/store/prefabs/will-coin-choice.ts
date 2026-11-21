import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { SelectPrompt } from '../prompts/select-prompt';
import { Player } from '../state/player';
import { GamePhase, State } from '../state/state';

export const WILL_FIRST_COIN = 'WILL_FIRST_COIN';

const legacyPowerFlips = new WeakSet<State>();

export function withoutWillCoinChoice<T>(state: State, callback: () => T): T {
  if (legacyPowerFlips.has(state)) return callback();
  legacyPowerFlips.add(state);
  try {
    return callback();
  } finally {
    legacyPowerFlips.delete(state);
  }
}

export function suppressesWillCoinChoice(state: State): boolean {
  return legacyPowerFlips.has(state);
}

export function getWillCoinChoicePlayer(state: State): Player | undefined {
  if (suppressesWillCoinChoice(state)
    || (state.phase !== GamePhase.PLAYER_TURN && state.phase !== GamePhase.ATTACK)) return;
  const player = state.players[state.activePlayer];
  if (player?.marker.hasMarker(WILL_FIRST_COIN)) return player;
}

/** Reserve the choice as soon as the first eligible coin is queued. */
export function takeWillCoinChoice(player: Player): SelectPrompt {
  player.marker.removeMarker(WILL_FIRST_COIN);
  return new SelectPrompt(player.id, GameMessage.CHOOSE_HEADS_OR_TAILS,
    ['GAME_MESSAGES.HEADS', 'GAME_MESSAGES.TAILS'], { allowCancel: false });
}

export function readChosenCoinSide(selection: unknown): boolean {
  if (selection !== 0 && selection !== 1) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
  return selection === 0;
}
