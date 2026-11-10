import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';

export class Oddish2 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp = 40;
  public weakness = [{ type: CardType.FIRE, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Stun Spore", cost: [CardType.COLORLESS], damage: 0, text: "Flip a coin. If heads, the Defending Pokémon is now Paralyzed." },
    { name: "Blot", cost: [CardType.GRASS], damage: 10, text: "Remove 1 damage counter from Oddish." }
  ];
  public set = "LA";
  public setNumber = "111";
  public cardImage = 'assets/cardback.png';
  public name = "Oddish";
  public fullName = "Oddish LA2";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Oddish2.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) coinConditionAfterDamage(state, effect, SpecialCondition.PARALYZED);
    if (WAS_ATTACK_USED(effect, 1, this)) healAttackerAfterDamage(state, effect, 10);
    return state;
  }
}
