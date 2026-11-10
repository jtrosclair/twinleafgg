import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Magikarp extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 30;
  public cardType: CardType = W;
  public weakness = [{ type: L, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Flail',
    cost: [C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Does 10 damage times the number of damage counters on Magikarp.'
  },
{
    name: 'Dragon Rage',
    cost: [W, W],
    damage: 60,
    text: 'Flip 2 coins. If either of them is tails, this attack does nothing.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '89';
  public name: string = 'Magikarp';
  public fullName: string = 'Magikarp MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-diamond-and-pearl/goldeen.ts (actual attacker slot).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const base = Math.floor(effect.source.damage / 10) * 10;
      // Preserve any AttackEffect bonus already applied to this attack.
      effect.damage = base > 0 ? Math.max(0, effect.damage + base - effect.attack.damage) : 0;
    }

    // Ref: set-mysterious-treasures/snorunt.ts (coin-gated damage).
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        if (results.includes(false)) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}
