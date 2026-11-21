import { GameError, GameMessage, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { CardTag } from '../../game/store/card/card-types';
import { SWITCH_ACTIVE_WITH_BENCHED, SWITCH_IN_OPPONENT_BENCHED_POKEMON } from '../../game/store/prefabs/prefabs';

export class PrimeCatcher extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public tags = [CardTag.ACE_SPEC];

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '157';

  public set: string = 'TEF';

  public name: string = 'Prime Catcher';

  public fullName: string = 'Prime Catcher TEF';

  public text: string =
    'Switch in 1 of your opponent\'s Benched Pokémon to the Active Spot. If you do, switch your Active Pokémon with 1 of your Benched Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!WAS_TRAINER_USED(effect, this)) return state;
    const { player } = effect;
    const opponent = StateUtils.getOpponent(state, player);
    if (!opponent.bench.some(slot => !!slot.getPokemonCard())) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }

    return SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, player, {
      sourceEffect: effect,
      onSwitched: () => { SWITCH_ACTIVE_WITH_BENCHED(store, state, player); },
    });
  }
}
