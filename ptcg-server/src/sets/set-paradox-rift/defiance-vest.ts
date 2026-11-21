import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { IS_TOOL_BLOCKED } from '../../game/store/prefabs/prefabs';


export class DefianceVest extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '162';

  public set: string = 'PAR';

  public name: string = 'Defiance Vest';

  public fullName: string = 'Defiance Vest PAR';

  public text: string =
    'If you have more Prize cards remaining than your opponent, the Pokémon this card is attached to takes 40 less damage from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PutDamageEffect && state.phase === GamePhase.ATTACK && effect.target.tools.includes(this)) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (owner !== effect.player && effect.source.getPokemonCard() && owner.getPrizeLeft() > effect.player.getPrizeLeft()
        && !IS_TOOL_BLOCKED(store, state, owner, this)) {
        effect.reduceDamageAfterWeakness(40, this.fullName + ':' + this.id);
      }
    }
    return state;
  }
}
