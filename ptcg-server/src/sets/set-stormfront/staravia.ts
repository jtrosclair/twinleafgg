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

// Upstream: ptcg-server/src/sets/04-diamond-pearl-platinum/set-stormfront/staravia.ts
export class Round28StaraviaSF52 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.STAGE_1;
  public cardType = CardType.COLORLESS;
  public hp = 70;
  public weakness = [{ type: CardType.LIGHTNING, value: 20 }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public retreat = [];
  public evolvesFrom = "Starly";
  public attacks = [
    { name: "Wing Attack", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 30, text: "" },
    { name: "Shot Air", cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS], damage: 20, text: "Does 30 damage to 1 of your opponent's Benched Pokémon. (Don't apply Weakness and Resistance for Benched Pokémon.)" }
  ];
  public set: string = "SF";
  public setNumber = "52";
  public cardImage = 'assets/cardback.png';
  public name = "Staravia";
  public fullName = "Staravia SF";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round28StaraviaSF52.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 1, this)) targetedDamageAfterAttack(state, effect, 30, true);
    return state;
  }
}
