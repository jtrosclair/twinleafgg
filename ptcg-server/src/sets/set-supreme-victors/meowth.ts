import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Meowth extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp = 60;
  public weakness = [{ type: CardType.FIGHTING, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Scratch", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Double Kick", cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS], damage: 20, damageCalculation: "x", text: "Flip 2 coins. This attack does 20 damage times the number of heads." }
  ];
  public set = 'SV';
  public setNumber = "114";
  public cardImage = 'assets/cardback.png';
  public name = "Meowth";
  public fullName = "Meowth SV";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Meowth.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 1, this)) return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
      const base = results.filter(Boolean).length * 20;
      effect.damage = base > 0 ? Math.max(0, effect.damage + base - effect.attack.damage) : 0;
    });
    return state;
  }
}
