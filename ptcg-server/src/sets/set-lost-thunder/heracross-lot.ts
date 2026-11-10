import { Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { Heracross } from './heracross';

// Keep the historical, mislabelled Heracross BRS definition for saved puzzles.
// This entry exposes the same printing under its correct Lost Thunder identity.
export class HeracrossLOT extends Heracross {
  public set = 'LOT';
  public setNumber = '18';
  public fullName = 'Heracross LOT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-lost-thunder/heracross.ts (Powerful Friends).
    // Only a Benched Stage 2 satisfies the printed condition.
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.player.bench.some(slot => slot.getPokemonCard()?.stage === Stage.STAGE_2)) {
        effect.damage += 90;
      }
      return state;
    }
    return super.reduceEffect(store, state, effect);
  }
}
