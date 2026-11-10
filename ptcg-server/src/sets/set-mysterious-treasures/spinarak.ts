import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { retreatLockAfterDamage } from '../../game/store/prefabs/retreat-lock-until-target-end-turn';
import { MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Spinarak extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp = 50;
  public weakness = [{ type: R, value: 10 }];
  public retreat = [C];
  public attacks = [{
    name: "Impound", cost: [C], damage: 0,
    text: "The Defending Pokémon can't retreat during your opponent's next turn."
  }, {
    name: "Double Scratch", cost: [G, C], damage: 20, damageCalculation: "x",
    text: "Flip 2 coins. This attack does 20 damage times the number of heads."
  } ];
  public set = "MT";
  public setNumber = "103";
  public cardImage = 'assets/cardback.png';
  public name = "Spinarak";
  public fullName = "Spinarak MT";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-diamond-and-pearl/staravia.ts (defender-owned retreat lock).
    if (WAS_ATTACK_USED(effect, 0, this)) retreatLockAfterDamage(state, effect);
    // Ref: set-diamond-and-pearl/skorupi.ts (multicoin damage while preserving bonuses).
    if (WAS_ATTACK_USED(effect, 1, this)) return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
      const base = results.filter(Boolean).length * 20;
      effect.damage = base > 0 ? Math.max(0, effect.damage + base - effect.attack.damage) : 0;
    });
    return state;
  }
}
