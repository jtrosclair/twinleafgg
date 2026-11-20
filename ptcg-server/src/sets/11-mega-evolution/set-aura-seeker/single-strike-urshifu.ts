import { PokemonCard, Stage, CardType, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { OPTIONALLY_DISCARD_ONE_ENERGY_FROM_ATTACKER } from '../../../game/store/prefabs/costs';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class SingleStrikeUrshifu extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Kubfu';
  public hp: number = 140;
  public cardType: CardType = F;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Wicked Blow',
    cost: [F, F, C],
    damage: 120,
    damageCalculation: '+',
    text: 'You may discard a [D] Energy from this Pokémon. If you do, this attack does 140 more damage.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'M7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public name: string = 'Single Strike Urshifu';
  public fullName: string = 'Single Strike Urshifu FLO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: costs.ts (effective Energy typing and completed discard).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPTIONALLY_DISCARD_ONE_ENERGY_FROM_ATTACKER(store, state, effect, CardType.DARK, () => {
        effect.damage += 140;
      });
    }

    return state;
  }
}
