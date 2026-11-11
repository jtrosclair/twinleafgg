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

// Upstream: ptcg-server/src/sets/04-diamond-pearl-platinum/set-diamond-and-pearl/buneary.ts
export class Round28BunearyDP73 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.BASIC;
  public cardType = CardType.COLORLESS;
  public hp = 50;
  public weakness = [{ type: CardType.FIGHTING, value: 10 }];
  public resistance = [];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    { name: "Splash", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Jump Kick", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 10, text: "Does 10 damage to 1 of your opponent's Benched Pokémon. (Don't apply Weakness and Resistance for Benched Pokémon.)" }
  ];
  public set: string = "DP";
  public setNumber = "73";
  public cardImage = 'assets/cardback.png';
  public name = "Buneary";
  public fullName = "Buneary DP";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round28BunearyDP73.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 1, this)) targetedDamageAfterAttack(state, effect, 10, true);
    return state;
  }
}
