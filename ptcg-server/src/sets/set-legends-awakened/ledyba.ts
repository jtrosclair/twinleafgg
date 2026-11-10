import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { recoilAfterAttack } from '../../game/store/prefabs/recoil-after-attack';

export class Ledyba extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp = 50;
  public weakness = [{ type: CardType.FIRE, value: 10 }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Supersonic", cost: [CardType.COLORLESS], damage: 0, text: "Flip a coin. If heads, the Defending Pokémon is now Confused." },
    { name: "Double-edge", cost: [CardType.GRASS, CardType.COLORLESS], damage: 30, text: "Ledyba does 10 damage to itself." }
  ];
  public set = "LA";
  public setNumber = "104";
  public cardImage = 'assets/cardback.png';
  public name = "Ledyba";
  public fullName = "Ledyba LA";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Ledyba.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) coinConditionAfterDamage(state, effect, SpecialCondition.CONFUSED);
    if (WAS_ATTACK_USED(effect, 1, this)) recoilAfterAttack(state, effect, 10);
    return state;
  }
}
