import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';

export class Dragonair extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Dratini";
  public cardType: CardType = CardType.COLORLESS;
  public hp = 70;
  public weakness = [{ type: CardType.COLORLESS, value: 20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Wrap", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 20, text: "Flip a coin. If heads, the Defending Pokémon is now Paralyzed." },
    { name: "Rising Lunge", cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS], damage: 30, damageCalculation: "+", text: "Flip a coin. If heads, this attack does 30 damage plus 20 more damage." }
  ];
  public set = "LA";
  public setNumber = "52";
  public cardImage = 'assets/cardback.png';
  public name = "Dragonair";
  public fullName = "Dragonair LA";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Dragonair.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) coinConditionAfterDamage(state, effect, SpecialCondition.PARALYZED);
    if (WAS_ATTACK_USED(effect, 1, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => { if (heads) effect.damage += 20; });
    return state;
  }
}
