import { ChoosePokemonPrompt, PlayerType, SlotType, GameError, GameMessage, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { SWITCH_OUT_OPPONENT_ACTIVE_POKEMON, TRAINER_TARGET_BLOCKED } from '../../game/store/prefabs/prefabs';

export class EscapeRope extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'PLS';

  public name: string = 'Escape Rope';

  public fullName: string = 'Escape Rope PLS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '120';

  public text: string =
    'Each player switches his or her Active Pokemon with 1 of his or her ' +
    'Benched Pokemon. (Your opponent switches first. If a player does not ' +
    'have a Benched Pokemon, he or she doesn\'t switch Pokemon.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!WAS_TRAINER_USED(effect, this)) return state;
    const { player } = effect;
    const opponent = StateUtils.getOpponent(state, player);
    const ownBench = player.bench.some(slot => !!slot.getPokemonCard());
    const opposingBench = opponent.bench.some(slot => !!slot.getPokemonCard());
    if (!ownBench && !opposingBench) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);

    const switchOwn = () => {
      if (!ownBench) return state;
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id, GameMessage.CHOOSE_POKEMON_TO_SWITCH, PlayerType.BOTTOM_PLAYER, [SlotType.BENCH],
        { allowCancel: false }
      ), selected => {
        if (selected?.[0]) player.switchPokemon(selected[0], store, state);
      });
    };

    // Escape Rope affects each old Active independently, in this order.
    if (!opposingBench || TRAINER_TARGET_BLOCKED(store, state, effect, opponent.active)) return switchOwn();
    return SWITCH_OUT_OPPONENT_ACTIVE_POKEMON(store, state, player, { onSwitched: switchOwn });
  }
}
