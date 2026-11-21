import { ChoosePokemonPrompt, PlayerType, SlotType, GameError, GameMessage, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { SWITCH_IN_OPPONENT_BENCHED_POKEMON } from '../../game/store/prefabs/prefabs';

export class DoubleGust extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'N1';
  public name: string = 'Double Gust';
  public fullName: string = 'Double Gust N1';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '100';
  public text = 'If you have any Benched Pokémon, your opponent chooses 1 of them and switches it with your Active Pokémon. Then, if your opponent has any Benched Pokémon, choose 1 of them and switch it with his or her Active Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;
    const { player } = effect;
    const opponent = StateUtils.getOpponent(state, player);
    const ownBench = player.bench.some(slot => slot.cards.length > 0);
    const opposingBench = opponent.bench.some(slot => slot.cards.length > 0);
    if (!ownBench && !opposingBench) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);

    const switchOpponent = () => SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, player, { sourceEffect: effect });
    if (!ownBench) return switchOpponent();

    return store.prompt(state, new ChoosePokemonPrompt(
      opponent.id, GameMessage.CHOOSE_POKEMON_TO_SWITCH, PlayerType.TOP_PLAYER, [SlotType.BENCH],
      { min: 1, max: 1, allowCancel: false }
    ), selected => {
      const target = selected?.[0];
      if (!target) return;
      player.switchPokemon(target, store, state);
      switchOpponent();
    });
  }
}
