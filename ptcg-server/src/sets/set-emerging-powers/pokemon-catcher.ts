import { GameError, GameMessage, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { SWITCH_IN_OPPONENT_BENCHED_POKEMON } from '../../game/store/prefabs/prefabs';

export class PokemonCatcher extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '95';
  public name: string = 'Pokémon Catcher';
  public fullName: string = 'Pokemon Catcher EPO';
  public text: string = 'Switch your opponent\'s Active Pokémon with 1 of their Benched Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;
    const { player } = effect;
    const opponent = StateUtils.getOpponent(state, player);
    if (!opponent.bench.some(slot => slot.cards.length > 0)) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    return SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, player, { sourceEffect: effect });
  }
}
