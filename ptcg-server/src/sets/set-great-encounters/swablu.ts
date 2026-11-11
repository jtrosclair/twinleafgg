import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage, coinConditionAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { recoilAfterAttack } from '../../game/store/prefabs/recoil-after-attack';
import { retreatLockAfterDamage } from '../../game/store/prefabs/retreat-lock-until-target-end-turn';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { targetedDamageAfterAttack } from '../set-upstream-round28/targeted-damage';
import { coinSelfProtectionAfterDamage } from '../set-upstream-round28/self-protection';

// Upstream: ptcg-server/src/sets/04-diamond-pearl-platinum/set-great-encounters/swablu.ts
export class Round28SwabluGE86 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.BASIC;
  public cardType = CardType.COLORLESS;
  public hp = 40;
  public weakness = [{ type: CardType.LIGHTNING, value: 10 }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    { name: "Super Speed", cost: [CardType.COLORLESS], damage: 0, text: "Flip a coin. If heads, prevent all effects of an attack, including damage, done to Swablu during your opponent's next turn." },
    { name: "Shoot Through", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 10, text: "Does 10 damage to 1 of your opponent's Benched Pokémon. (Don't apply Weakness and Resistance for Benched Pokémon.)" }
  ];
  public set: string = "GE";
  public setNumber = "86";
  public cardImage = 'assets/cardback.png';
  public name = "Swablu";
  public fullName = "Swablu GE";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round28SwabluGE86.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) coinSelfProtectionAfterDamage(state, effect, true);
    if (WAS_ATTACK_USED(effect, 1, this)) targetedDamageAfterAttack(state, effect, 10, true);
    return state;
  }
}
