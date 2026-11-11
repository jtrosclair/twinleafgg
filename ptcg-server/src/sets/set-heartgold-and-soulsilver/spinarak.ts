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

// Upstream: ptcg-server/src/sets/05-heartgold-and-soulsilver/set-heartgold-and-soulsilver/spinarak.ts
export class Round28SpinarakHS83 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.BASIC;
  public cardType = CardType.GRASS;
  public hp = 50;
  public weakness = [{ type: CardType.FIRE }];
  public resistance = [];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    { name: "Hang Down", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Spider Web", cost: [CardType.GRASS], damage: 0, text: "The Defending Pokémon can't retreat during your opponent's next turn." }
  ];
  public set: string = "HS";
  public setNumber = "83";
  public cardImage = 'assets/cardback.png';
  public name = "Spinarak";
  public fullName = "Spinarak HS";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round28SpinarakHS83.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 1, this)) retreatLockAfterDamage(state, effect);
    return state;
  }
}
