import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { coinConditionAfterDamage, conditionAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { SpecialCondition } from '../../game/store/card/card-types';

export class Rapidash2 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Ponyta";
  public cardType: CardType = CardType.FIRE;
  public hp = 90;
  public weakness = [{ type: CardType.WATER, value: 20 }];
  public retreat: CardType[] = [];
  public attacks = [
    { name: "Searing Flame", cost: [CardType.FIRE], damage: 10, text: "The Defending Pokémon is now Burned." },
    { name: "Flare", cost: [CardType.FIRE, CardType.COLORLESS], damage: 40, text: "" }
  ];
  public set = 'AR';
  public setNumber = "47";
  public cardImage = 'assets/cardback.png';
  public name = "Rapidash";
  public fullName = "Rapidash AR2";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Rapidash2.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-great-encounters/ge-attack-effects.ts (condition after damage).
    if (WAS_ATTACK_USED(effect, 0, this)) conditionAfterDamage(state, effect, SpecialCondition.BURNED);
    return state;
  }
}
