import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage } from './ge-attack-effects';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Clamperl extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 40;
  public cardType: CardType = W;
  public weakness = [{ type: L, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Clamp',
    cost: [C],
    damage: 10,
    text: 'Flip a coin. If tails, this attack does nothing. If heads, the Defending Pokémon is now Paralyzed.'
  },
  {
    name: 'Sparkling Pearl',
    cost: [W, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';
  public name: string = 'Clamperl';
  public fullName: string = 'Clamperl GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-mysterious-treasures/magikarp.ts (attack does nothing on tails).
    if (WAS_ATTACK_USED(effect, 0, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => {
      if (!heads) effect.damage = 0;
      else conditionAfterDamage(state, effect, SpecialCondition.PARALYZED);
    });
    return state;
  }
}
