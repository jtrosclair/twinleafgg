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

// Upstream: ptcg-server/src/sets/set-pop-series-3/eevee.ts
export class Round28EeveeP313 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.BASIC;
  public cardType = CardType.COLORLESS;
  public hp = 50;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    { name: "Tackle", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Take Down", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 30, text: "Eevee does 10 damage to itself." }
  ];
  public set: string = "P3";
  public setNumber = "13";
  public cardImage = 'assets/cardback.png';
  public name = "Eevee";
  public fullName = "Eevee P3";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round28EeveeP313.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 1, this)) recoilAfterAttack(state, effect, 10);
    return state;
  }
}
