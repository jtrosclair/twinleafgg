import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';

export class Numel extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp = 60;
  public weakness = [{ type: CardType.WATER, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Rollout", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Singe", cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS], damage: 30, text: "Flip a coin. If heads, the Defending Pokémon is now Burned." }
  ];
  public set = "LA";
  public setNumber = "110";
  public cardImage = 'assets/cardback.png';
  public name = "Numel";
  public fullName = "Numel LA";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Numel.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 1, this)) coinConditionAfterDamage(state, effect, SpecialCondition.BURNED);
    return state;
  }
}
