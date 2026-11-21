import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

import { MarkerConstants } from '../../game/store/markers/marker-constants';

export class JasminesGaze extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'SSP';
  public setNumber = '178';
  public cardImage = 'assets/cardback.png';
  public regulationMark: string = 'H';
  public name: string = 'Jasmine\'s Gaze';
  public fullName: string = 'Jasmine\'s Gaze SSP';
  public text: string = 'During your opponent\'s next turn, all of your Pokémon take 30 less damage ' +
    'from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance). ' +
    '(This includes new Pokémon that come into play.)';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      effect.player.marker.addMarker(MarkerConstants.JASMINES_GAZE_MARKER, this);
    }
    return state;
  }
}
