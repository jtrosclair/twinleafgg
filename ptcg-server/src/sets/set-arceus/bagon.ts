import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { coinConditionAfterDamage, conditionAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { SpecialCondition } from '../../game/store/card/card-types';

export class Bagon extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp = 60;
  public weakness = [{ type: CardType.COLORLESS, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Smash Kick", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Super Singe", cost: [CardType.FIRE, CardType.COLORLESS], damage: 20, text: "Flip a coin. If heads, the Defending Pokémon is now Burned." }
  ];
  public set = 'AR';
  public setNumber = "52";
  public cardImage = 'assets/cardback.png';
  public name = "Bagon";
  public fullName = "Bagon AR";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Bagon.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-great-encounters/ge-attack-effects.ts (condition after damage).
    if (WAS_ATTACK_USED(effect, 1, this)) coinConditionAfterDamage(state, effect, SpecialCondition.BURNED);
    return state;
  }
}
