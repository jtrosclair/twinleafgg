import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Magikarp extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp = 30;
  public weakness = [{ type: CardType.LIGHTNING, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Flail Around", cost: [CardType.COLORLESS], damage: 10, damageCalculation: "x", text: "Flip 3 coins. This attack does 10 damage times the number of heads." }
  ];
  public set = 'SV';
  public setNumber = "110";
  public cardImage = 'assets/cardback.png';
  public name = "Magikarp";
  public fullName = "Magikarp SV";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Magikarp.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 3, results => {
      const base = results.filter(Boolean).length * 10;
      effect.damage = base > 0 ? Math.max(0, effect.damage + base - effect.attack.damage) : 0;
    });
    return state;
  }
}
