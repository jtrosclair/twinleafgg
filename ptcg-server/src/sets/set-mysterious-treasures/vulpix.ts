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

// Upstream: ptcg-server/src/sets/04-diamond-pearl-platinum/set-mysterious-treasures/vulpix.ts
export class Round28VulpixMT107 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.BASIC;
  public cardType = CardType.FIRE;
  public hp = 60;
  public weakness = [{ type: CardType.WATER, value: 10 }];
  public resistance = [];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    { name: "Fire Soul", cost: [CardType.FIRE, CardType.FIRE], damage: 20, text: "Does 10 damage to 1 of your opponent's Benched Pokémon. (Don't apply Weakness and Resistance for Benched Pokémon.)" }
  ];
  public set: string = "MT";
  public setNumber = "107";
  public cardImage = 'assets/cardback.png';
  public name = "Vulpix";
  public fullName = "Vulpix MT";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round28VulpixMT107.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) targetedDamageAfterAttack(state, effect, 10, true);
    return state;
  }
}
