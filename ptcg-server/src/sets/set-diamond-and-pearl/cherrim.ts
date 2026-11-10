import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { SpecialCondition } from '../../game/store/card/card-types';
import { COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Cherrim extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Cherubi";
  public cardType: CardType = G;
  public hp = 80;
  public weakness = [{ type: R, value: 20 }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C, C];
  public attacks = [{
    name: "Worry Seed", cost: [G], damage: 20,
    text: "Flip a coin. If heads, the Defending Pokémon is now Confused."
  }, {
    name: "Magical Leaf", cost: [G, G], damage: 20, damageCalculation: "+",
    text: "Flip a coin. If heads, this attack does 20 damage plus 20 more damage and remove 3 damage counters from Cherrim."
  } ];
  public set = "DP";
  public setNumber = "45";
  public cardImage = 'assets/cardback.png';
  public name = "Cherrim";
  public fullName = "Cherrim DP";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Refs: set-great-encounters/ge-attack-effects.ts (condition and post-damage heal).
    if (WAS_ATTACK_USED(effect, 0, this)) coinConditionAfterDamage(state, effect, SpecialCondition.CONFUSED);
    if (WAS_ATTACK_USED(effect, 1, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => {
      if (heads) { effect.damage += 20; healAttackerAfterDamage(state, effect, 30); }
    });
    return state;
  }
}
