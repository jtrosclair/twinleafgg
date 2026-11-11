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

// Upstream: ptcg-server/src/sets/05-heartgold-and-soulsilver/set-heartgold-and-soulsilver/sandshrew.ts
export class Round28SandshrewHS79 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.BASIC;
  public cardType = CardType.FIGHTING;
  public hp = 60;
  public weakness = [{ type: CardType.WATER }];
  public resistance = [{ type: CardType.LIGHTNING, value: -20 }];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    { name: "Defense Curl", cost: [CardType.COLORLESS], damage: 0, text: "Flip a coin. If heads, prevent all damage done to Sandshrew by attacks during your opponent's next turn." },
    { name: "Rollout", cost: [CardType.FIGHTING], damage: 10, text: "" }
  ];
  public set: string = "HS";
  public setNumber = "79";
  public cardImage = 'assets/cardback.png';
  public name = "Sandshrew";
  public fullName = "Sandshrew HS";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round28SandshrewHS79.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) coinSelfProtectionAfterDamage(state, effect, false);
    return state;
  }
}
