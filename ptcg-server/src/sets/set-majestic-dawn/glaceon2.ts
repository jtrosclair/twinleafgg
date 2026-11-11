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

// Upstream: ptcg-server/src/sets/04-diamond-pearl-platinum/set-majestic-dawn/glaceon2.ts
export class Round28GlaceonMD20 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.STAGE_1;
  public cardType = CardType.WATER;
  public hp = 90;
  public weakness = [{ type: CardType.METAL, value: 20 }];
  public resistance = [];
  public retreat = [CardType.COLORLESS];
  public evolvesFrom = "Eevee";
  public attacks = [
    { name: "Ice Shot", cost: [CardType.WATER, CardType.COLORLESS], damage: 30, text: "Does 10 damage to 1 of your opponent's Benched Pokémon. (Don't apply Weakness and Resistance for Benched Pokémon.)" },
    { name: "Icy Wind", cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS], damage: 60, text: "Flip a coin. If heads, the Defending Pokémon is now Asleep." }
  ];
  public set: string = "MD";
  public setNumber = "20";
  public cardImage = 'assets/cardback.png';
  public name = "Glaceon";
  public fullName = "Glaceon MD2";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round28GlaceonMD20.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) targetedDamageAfterAttack(state, effect, 10, true);
    if (WAS_ATTACK_USED(effect, 1, this)) coinConditionAfterDamage(state, effect, SpecialCondition.ASLEEP);
    return state;
  }
}
