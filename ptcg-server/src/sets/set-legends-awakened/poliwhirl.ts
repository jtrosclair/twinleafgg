import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';

export class Poliwhirl extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Poliwag";
  public cardType: CardType = CardType.WATER;
  public hp = 80;
  public weakness = [{ type: CardType.LIGHTNING, value: 20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Light Punch", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 20, text: "" },
    { name: "Bubblebeam", cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS], damage: 40, text: "Flip a coin. If heads, the Defending Pokémon is now Paralyzed." }
  ];
  public set = "LA";
  public setNumber = "115";
  public cardImage = 'assets/cardback.png';
  public name = "Poliwhirl";
  public fullName = "Poliwhirl LA";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Poliwhirl.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 1, this)) coinConditionAfterDamage(state, effect, SpecialCondition.PARALYZED);
    return state;
  }
}
