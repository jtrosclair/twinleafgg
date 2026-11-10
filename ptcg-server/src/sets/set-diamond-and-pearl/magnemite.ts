import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { coinConditionAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { SpecialCondition } from '../../game/store/card/card-types';

export class Magnemite extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp = 50;
  public weakness = [{ type: R, value: 10 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];
  public attacks = [{
    name: "Metal Sound", cost: [M], damage: 0,
    text: "Flip a coin. If heads, the Defending Pokémon is now Confused."
  }, {
    name: "Resonance", cost: [M, C], damage: 20, damageCalculation: "+",
    text: "If the Defending Pokémon is Confused, this attack does 20 damage plus 20 more damage."
  } ];
  public set = "DP";
  public setNumber = "87";
  public cardImage = 'assets/cardback.png';
  public name = "Magnemite";
  public fullName = "Magnemite DP";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-great-encounters/ge-attack-effects.ts (coin-gated confusion).
    if (WAS_ATTACK_USED(effect, 0, this)) coinConditionAfterDamage(state, effect, SpecialCondition.CONFUSED);
    // Ref: set-secret-wonders/sableye.ts (additive attack bonus).
    if (WAS_ATTACK_USED(effect, 1, this) && effect.opponent.active.specialConditions.includes(SpecialCondition.CONFUSED)) effect.damage += 20;
    return state;
  }
}
