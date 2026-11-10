import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Charmeleon extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Charmander";
  public cardType: CardType = CardType.FIRE;
  public hp = 80;
  public weakness = [{ type: CardType.WATER, value: 20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Slam", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 30, damageCalculation: "x", text: "Flip 2 coins. This attack does 30 damage times the number of heads." },
    { name: "Fire Punch", cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS], damage: 50, text: "" }
  ];
  public set = 'AR';
  public setNumber = "35";
  public cardImage = 'assets/cardback.png';
  public name = "Charmeleon";
  public fullName = "Charmeleon AR";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Charmeleon.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-diamond-and-pearl/steelix.ts (coin-dependent base damage).
    if (WAS_ATTACK_USED(effect, 0, this)) return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
      const base = results.filter(Boolean).length * 30;
      effect.damage = base > 0 ? Math.max(0, effect.damage + base - effect.attack.damage) : 0;
    });
    return state;
  }
}
