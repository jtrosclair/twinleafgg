import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';

export class Gliscor2 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Gligar";
  public cardType: CardType = CardType.FIGHTING;
  public hp = 90;
  public weakness = [{ type: CardType.WATER, value: 20 }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Poison Jab", cost: [CardType.FIGHTING], damage: 20, text: "The Defending Pokémon is now Poisoned." },
    { name: "Sharp Tail", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 30, damageCalculation: "+", text: "Flip a coin. If heads, this attack does 30 damage plus 40 more damage." }
  ];
  public set = "LA";
  public setNumber = "55";
  public cardImage = 'assets/cardback.png';
  public name = "Gliscor";
  public fullName = "Gliscor LA2";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Gliscor2.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) conditionAfterDamage(state, effect, SpecialCondition.POISONED);
    if (WAS_ATTACK_USED(effect, 1, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => { if (heads) effect.damage += 40; });
    return state;
  }
}
