import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Kangaskhan extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp = 90;
  public weakness = [{ type: CardType.FIGHTING, value: 20 }];
  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Bite", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 30, text: "" },
    { name: "Comet Punch", cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS], damage: 20, damageCalculation: "x", text: "Flip 4 coins. This attack does 20 damage times the number of heads." }
  ];
  public set = "MD";
  public setNumber = "38";
  public cardImage = 'assets/cardback.png';
  public name = "Kangaskhan";
  public fullName = "Kangaskhan MD";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Kangaskhan.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 1, this)) return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 4, results => {
      const base = results.filter(Boolean).length * 20;
      effect.damage = base > 0 ? Math.max(0, effect.damage + base - effect.attack.damage) : 0;
    });
    return state;
  }
}
