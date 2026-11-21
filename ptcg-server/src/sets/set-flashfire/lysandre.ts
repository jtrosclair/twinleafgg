import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { CopiedSupporterEffect, TrainerEffect, TrainerTargetEffect } from '../../game/store/effects/play-card-effects';
import { SWITCH_IN_OPPONENT_BENCHED_POKEMON } from '../../game/store/prefabs/prefabs';
import { PlayerType, SlotType, StateUtils, GameError, GameMessage } from '../../game';

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

    const player = effect.player;
    if (effect instanceof CopiedSupporterEffect) {
      return SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, player, { sourceEffect: effect.attackSource });
    }

    const opponent = StateUtils.getOpponent(state, player);
    if (!opponent.bench.some(bench => bench.cards.length > 0)) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (player.supporterTurn > 0) {
      throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
    }

    player.hand.moveCardTo(this, player.supporter);
    effect.preventDefault = true;
    return store.prompt(state, new ChoosePokemonPrompt(
      player.id, GameMessage.CHOOSE_POKEMON_TO_SWITCH, PlayerType.TOP_PLAYER, [SlotType.BENCH],
      { allowCancel: false }
    ), selected => {
      const target = selected?.[0];
      if (!target) return;

      // Ω Barrier permits choosing the Pokémon. It prevents the switch on resolution.
      const targeting = new TrainerTargetEffect(player, this, target);
      store.reduceEffect(state, targeting);
      if (!targeting.preventDefault) opponent.switchPokemon(target, store, state);
    });
  }

}
