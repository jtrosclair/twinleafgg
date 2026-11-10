import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Cacturne extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Cacnea";
  public cardType: CardType = D;
  public hp = 80;
  public weakness = [{ type: R, value: 20 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];
  public attacks = [{
    name: "Pin Missile", cost: [C, C], damage: 20, damageCalculation: "x",
    text: "Flip 3 coins. This attack does 20 damage times the number of heads."
  }, {
    name: "Needle Arm", cost: [D, C, C], damage: 50, damageCalculation: "+",
    text: "If the Defending Pokémon already has any damage counters on it, this attack does 50 damage plus 20 more damage."
  } ];
  public set = "GE";
  public setNumber = "34";
  public cardImage = 'assets/cardback.png';
  public name = "Cacturne";
  public fullName = "Cacturne GE";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-diamond-and-pearl/skorupi.ts (multicoin damage while preserving bonuses).
    if (WAS_ATTACK_USED(effect, 0, this)) return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 3, results => {
      const base = results.filter(Boolean).length * 20;
      effect.damage = base > 0 ? Math.max(0, effect.damage + base - effect.attack.damage) : 0;
    });
    // Ref: set-stellar-crown/drednaw.ts (pre-existing damage on defender).
    if (WAS_ATTACK_USED(effect, 1, this) && effect.opponent.active.damage > 0) effect.damage += 20;
    return state;
  }
}
