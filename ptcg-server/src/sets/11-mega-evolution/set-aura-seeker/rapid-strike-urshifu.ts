import { PokemonCard, Stage, CardType, StoreLike, State } from '../../../game';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { OPTIONALLY_DISCARD_ONE_ENERGY_FROM_ATTACKER } from '../../../game/store/prefabs/costs';
import { afterAttackDamage } from '../../../game/store/prefabs/attack-after-damage';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class RapidStrikeUrshifu extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Kubfu';
  public hp: number = 140;
  public cardType: CardType = F;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Torrential Strike',
    cost: [F, F, C],
    damage: 120,
    text: 'You may discard a [W] Energy from this Pokémon. If you do, this attack also does 40 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public regulationMark: string = 'J';
  public set: string = 'M7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '50';
  public name: string = 'Rapid Strike Urshifu';
  public fullName: string = 'Rapid Strike Urshifu FLO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: attack-after-damage.ts and the official M7 050 discard requirement.
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPTIONALLY_DISCARD_ONE_ENERGY_FROM_ATTACKER(store, state, effect, CardType.WATER, paidState => {
        afterAttackDamage(paidState, effect, (currentStore, currentState) => {
          for (const target of effect.opponent.bench) {
            if (target.getPokemonCard()) {
              const damage = new PutDamageEffect(effect, 40);
              damage.target = target;
              currentState = currentStore.reduceEffect(currentState, damage);
            }
          }
          return currentState;
        });
      });
    }

    return state;
  }
}
