import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { flipForStatusAfterDamage } from './status-after-damage';

export class Seel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = W;
  public weakness = [{ type: M, value: +10 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Freezing Headbutt',
    cost: [W, C],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '97';
  public name: string = 'Seel';
  public fullName: string = 'Seel MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-diamond-and-pearl/hoothoot.ts (coin-gated Special Condition).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      flipForStatusAfterDamage(state, effect, SpecialCondition.PARALYZED);
    }

    return state;
  }
}
