import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { coinConditionAfterDamage, conditionAfterDamage } from './ge-attack-effects';
import { SpecialCondition } from '../../game/store/card/card-types';

export class Arbok extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Ekans";
  public cardType: CardType = P;
  public hp = 80;
  public weakness = [{ type: P, value: 20 }];
  public retreat = [C, C];
  public attacks = [{
    name: "Deadly Poison", cost: [P], damage: 10, damageCalculation: "+",
    text: "If the Defending Pokémon is Poisoned, this attack does 10 damage plus 40 more damage. If the Defending Pokémon is not Poisoned, that Pokémon is now Poisoned."
  }, {
    name: "Wrap", cost: [C, C, C], damage: 50,
    text: "Flip a coin. If heads, the Defending Pokémon is now Paralyzed."
  } ];
  public set = "GE";
  public setNumber = "33";
  public cardImage = 'assets/cardback.png';
  public name = "Arbok";
  public fullName = "Arbok GE";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-great-encounters/ge-attack-effects.ts (status after damage).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.opponent.active.specialConditions.includes(SpecialCondition.POISONED)) effect.damage += 40;
      else conditionAfterDamage(state, effect, SpecialCondition.POISONED);
    }
    if (WAS_ATTACK_USED(effect, 1, this)) coinConditionAfterDamage(state, effect, SpecialCondition.PARALYZED);
    return state;
  }
}
