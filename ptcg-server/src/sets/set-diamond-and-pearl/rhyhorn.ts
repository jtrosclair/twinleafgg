import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { recoilAfterAttack } from '../../game/store/prefabs/recoil-after-attack';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Rhyhorn extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = F;
  public weakness = [{ type: W, value: 10 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Horn Attack',
    cost: [C],
    damage: 10,
    text: ''
  },
{
    name: 'Take Down',
    cost: [F, C],
    damage: 30,
    text: 'Rhyhorn does 10 damage to itself.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '95';
  public name: string = 'Rhyhorn';
  public fullName: string = 'Rhyhorn DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-diamond-and-pearl/goldeen.ts (post-damage recoil).
    // Take Down
    if (WAS_ATTACK_USED(effect, 1, this)) {
      recoilAfterAttack(state, effect, 10);
    }

    return state;
  }
}
