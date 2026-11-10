import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { flipForStatusAfterDamage } from './status-after-damage';

export class Zubat extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType = P;
  public weakness = [{ type: P, value: +10 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Supersonic',
    cost: [P],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
  },
{
    name: 'Bite',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '108';
  public name: string = 'Zubat';
  public fullName: string = 'Zubat MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-diamond-and-pearl/hoothoot.ts (coin-gated Special Condition).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      flipForStatusAfterDamage(state, effect, SpecialCondition.CONFUSED);
    }

    return state;
  }
}
