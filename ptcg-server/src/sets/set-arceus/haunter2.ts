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

// Upstream: ptcg-server/src/sets/04-diamond-pearl-platinum/set-arceus/haunter2.ts
export class Round28HaunterAR42 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.STAGE_1;
  public cardType = CardType.PSYCHIC;
  public hp = 80;
  public weakness = [{ type: CardType.DARK, value: 20 }];
  public resistance = [{ type: CardType.COLORLESS, value: -20 }];
  public retreat = [CardType.COLORLESS];
  public evolvesFrom = "Gastly";
  public attacks = [
    { name: "Psyshot", cost: [CardType.PSYCHIC], damage: 20, text: "" },
    { name: "Shadow Bind", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 30, text: "The Defending Pokémon can't retreat during your opponent's next turn." }
  ];
  public set: string = "AR";
  public setNumber = "42";
  public cardImage = 'assets/cardback.png';
  public name = "Haunter";
  public fullName = "Haunter AR2";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round28HaunterAR42.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 1, this)) retreatLockAfterDamage(state, effect);
    return state;
  }
}
