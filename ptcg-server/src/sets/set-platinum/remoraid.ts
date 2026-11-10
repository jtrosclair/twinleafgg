import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Remoraid extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp = 60;
  public weakness = [{ type: CardType.LIGHTNING, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Splash", cost: [CardType.WATER], damage: 10, text: "" },
    { name: "Trickle", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 20, damageCalculation: "x", text: "Flip 2 coins. This attack does 20 damage times the number of heads." }
  ];
  public set = 'PL';
  public setNumber = "90";
  public cardImage = 'assets/cardback.png';
  public name = "Remoraid";
  public fullName = "Remoraid PL";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Remoraid.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 1, this)) return MULTIPLE_COIN_FLIPS_PROMPT(store,state,effect.player,2,flips=>{const base=20*flips.filter(Boolean).length;effect.damage=base?Math.max(0,effect.damage+base-effect.attack.damage):0;});
    return state;
  }
}
