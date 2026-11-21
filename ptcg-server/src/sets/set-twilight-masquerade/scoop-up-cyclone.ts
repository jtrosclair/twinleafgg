import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { choosePokemonToReturn } from '../../game/store/prefabs/choose-pokemon-to-return';

export class ScoopUpCyclone extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public tags = [CardTag.ACE_SPEC];
  public regulationMark = 'H';
  public set: string = 'TWM';
  public name: string = 'Scoop Up Cyclone';
  public fullName: string = 'Scoop Up Cyclone TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '162';
  public text: string = 'Put 1 of your Pokémon and all cards attached to it into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      return choosePokemonToReturn(store, state, effect.player, true);
    }
    return state;
  }
}
