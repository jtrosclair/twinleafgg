import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { coinConditionAfterDamage, conditionAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { SpecialCondition } from '../../game/store/card/card-types';

export class Bronzor2 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.METAL;
  public hp = 60;
  public weakness = [{ type: CardType.FIRE, value: 10 }];
  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Hypnosis", cost: [CardType.METAL], damage: 10, text: "Flip a coin. If heads, the Defending Pokémon is now Asleep." },
    { name: "Spinning Attack", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 20, text: "" }
  ];
  public set = 'AR';
  public setNumber = "54";
  public cardImage = 'assets/cardback.png';
  public name = "Bronzor";
  public fullName = "Bronzor AR2";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Bronzor2.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-great-encounters/ge-attack-effects.ts (condition after damage).
    if (WAS_ATTACK_USED(effect, 0, this)) coinConditionAfterDamage(state, effect, SpecialCondition.ASLEEP);
    return state;
  }
}
