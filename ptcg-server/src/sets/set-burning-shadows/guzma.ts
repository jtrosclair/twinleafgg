import { GameError, GameMessage, GameLog, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CopiedSupporterEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { SWITCH_ACTIVE_WITH_BENCHED, SWITCH_IN_OPPONENT_BENCHED_POKEMON } from '../../game/store/prefabs/prefabs';

export class Guzma extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '115';

  public set: string = 'BUS';

  public name: string = 'Guzma';

  public fullName: string = 'Guzma BUS';

  public text: string =
    'Switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon. If you do, switch your Active Pokémon with 1 of your Benched Pokémon.';

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

    // Ref: the official Guzma ruling on Unnerve. Only a completed first switch enables the second.
    return SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, player, {
      sourceEffect: effect,
      onSwitched: target => {
        store.log(state, GameLog.LOG_PLAYER_SWITCHES_POKEMON_TO_ACTIVE, {
          name: player.name, card: target.getPokemonCard()!.name,
        });
        SWITCH_ACTIVE_WITH_BENCHED(store, state, player, () => {
          store.log(state, GameLog.LOG_PLAYER_SWITCHES_POKEMON_TO_ACTIVE, {
            name: player.name, card: player.active.getPokemonCard()!.name,
          });
        });
      },
    });
  }
}
