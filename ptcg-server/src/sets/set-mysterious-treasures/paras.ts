import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { flipForStatusAfterDamage } from './status-after-damage';

export class Paras extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = G;
  public weakness = [{ type: R, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Scratch',
    cost: [C],
    damage: 10,
    text: ''
  },
{
    name: 'Mushroom Tackle',
    cost: [G, G],
    damage: 20,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '92';
  public name: string = 'Paras';
  public fullName: string = 'Paras MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-diamond-and-pearl/hoothoot.ts (coin-gated Special Condition).
    if (WAS_ATTACK_USED(effect, 1, this)) {
      flipForStatusAfterDamage(state, effect, SpecialCondition.PARALYZED);
    }

    return state;
  }
}
