import { GameError, GameMessage, Player, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CopiedSupporterEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { SWITCH_IN_OPPONENT_BENCHED_POKEMON } from '../../game/store/prefabs/prefabs';

export class BossOrders extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '172';

  public name: string = 'Boss\'s Orders';

  public fullName: string = 'Boss\'s Orders PAL';

  public text: string =
    'Switch 1 of your opponent\'s Benched Pokemon with his or her ' +
    'Active Pokemon.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }

    const opponent = StateUtils.getOpponent(state, player);
    const hasBench = opponent.bench.some(b => b.cards.length > 0);
    return hasBench;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;
    const { player } = effect;
    const opponent = StateUtils.getOpponent(state, player);
    if (!opponent.bench.some(slot => slot.cards.length > 0)) {
      if (effect instanceof CopiedSupporterEffect) return state;
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (player.supporterTurn > 0) {
      throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    return SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, player, { sourceEffect: effect });
  }
}
