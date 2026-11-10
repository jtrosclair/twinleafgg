import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../game/store/prefabs/attack-effects';

import { SpecialCondition } from '../../game/store/card/card-types';
import { coinConditionAfterDamage, healAttackerAfterDamage } from './ge-attack-effects';

export class Ekans extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = P;
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Shed Skin',
    cost: [C],
    damage: 0,
    text: 'Remove 2 damage counters from Ekans.'
  },
  {
    name: 'Poison Fang',
    cost: [P],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';
  public name: string = 'Ekans';
  public fullName: string = 'Ekans GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-mysterious-treasures/teddiursa.ts (heal the actual attacker).
    if (WAS_ATTACK_USED(effect, 0, this)) healAttackerAfterDamage(state, effect, 20);
    // Ref: set-mysterious-treasures/status-after-damage.ts (coin-gated condition).
    if (WAS_ATTACK_USED(effect, 1, this)) coinConditionAfterDamage(state, effect, SpecialCondition.POISONED);
    return state;
  }
}
