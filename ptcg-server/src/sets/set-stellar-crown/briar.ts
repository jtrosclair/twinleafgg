import { TrainerCard, TrainerType, StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class Briar extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'H';
  public set: string = 'SCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '132';
  public name: string = 'Briar';
  public fullName: string = 'Briar SCR';

  public text: string =
    `You can use this card only if your opponent has exactly 2 Prize cards remaining.

During this turn, if your opponent's Active Pokémon is Knocked Out by damage from an attack used by your Tera Pokémon, take 1 more Prize card.`;

  public extraPrizes = false;
  
  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-crown-zenith/sky-seal-stone.ts (turn-scoped player Prize effect).
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      if (StateUtils.getOpponent(state, effect.player).getPrizeLeft() !== 2) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      const bonus = effect.player.briarPrizeBonus;
      effect.player.briarPrizeBonus = {
        turn: state.turn, count: (bonus?.turn === state.turn ? bonus.count : 0) + 1
      };
    }
    return state;
  }
}
