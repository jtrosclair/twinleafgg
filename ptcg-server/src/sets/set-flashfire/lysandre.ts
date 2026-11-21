import { GameError, GameMessage, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CopiedSupporterEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { SWITCH_IN_OPPONENT_BENCHED_POKEMON } from '../../game/store/prefabs/prefabs';

export class Lysandre extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'FLF';

  public name: string = 'Lysandre';

  public fullName: string = 'Lysandre FLF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '90';

  public text: string =
    'Switch 1 of your opponent\'s Benched Pokemon with his or her ' +
    'Active Pokemon.';

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
