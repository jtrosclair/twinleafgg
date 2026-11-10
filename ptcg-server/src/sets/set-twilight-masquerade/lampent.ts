import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_ALL_ENERGY_FROM_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Lampent extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Litwick';
  public cardType: CardType = CardType.FIRE;
  public hp: number = 80;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Live Coal',
    cost: [CardType.FIRE],
    damage: 20,
    text: ''
  }, {
    name: 'Burn It All Up',
    cost: [CardType.FIRE, CardType.COLORLESS],
    damage: 60,
    text: 'Discard all Energy from this Pokémon.'
  }];

  public regulationMark = 'H';
  public set: string = 'TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '37';
  public name: string = 'Lampent';
  public fullName: string = 'Lampent TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Burn It All Up
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
    }

    return state;
  }
}
