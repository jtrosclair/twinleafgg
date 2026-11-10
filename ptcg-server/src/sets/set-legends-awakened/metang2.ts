import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';

export class Metang2 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Beldum";
  public cardType: CardType = CardType.METAL;
  public hp = 80;
  public weakness = [{ type: CardType.FIRE, value: 20 }];
  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Psyshock", cost: [CardType.METAL, CardType.COLORLESS], damage: 20, text: "Flip a coin. If heads, the Defending Pokémon is now Paralyzed." },
    { name: "Bullet Punch", cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS], damage: 40, damageCalculation: "+", text: "Flip 2 coins. This attack does 40 damage plus 20 more damage for each heads." }
  ];
  public set = "LA";
  public setNumber = "65";
  public cardImage = 'assets/cardback.png';
  public name = "Metang";
  public fullName = "Metang LA2";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Metang2.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) coinConditionAfterDamage(state, effect, SpecialCondition.PARALYZED);
    if (WAS_ATTACK_USED(effect, 1, this)) return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => { effect.damage += 20 * results.filter(Boolean).length; });
    return state;
  }
}
