import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { recoilAfterAttack } from '../../game/store/prefabs/recoil-after-attack';

export class Graveler extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Geodude";
  public cardType: CardType = CardType.FIGHTING;
  public hp = 90;
  public weakness = [{ type: CardType.GRASS, value: 20 }];
  public resistance = [{ type: CardType.LIGHTNING, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Tackle", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 30, text: "" },
    { name: "Double-edge", cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS], damage: 70, text: "Graveler does 10 damage to itself." }
  ];
  public set = 'AR';
  public setNumber = "37";
  public cardImage = 'assets/cardback.png';
  public name = "Graveler";
  public fullName = "Graveler AR";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Graveler.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/recoil-after-attack.ts (damage to original attacker after damage).
    if (WAS_ATTACK_USED(effect, 1, this)) recoilAfterAttack(state, effect, 10);
    return state;
  }
}
