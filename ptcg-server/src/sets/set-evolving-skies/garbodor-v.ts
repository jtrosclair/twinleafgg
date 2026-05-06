import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../game/store/prefabs/attack-effects';
import { MarkerConstants } from '../../game/store/markers/marker-constants';

export class GarbodorV extends PokemonCard {
  public tags = [CardTag.POKEMON_V];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 210;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Trash Stench',
    cost: [D, C],
    damage: 40,
    text: 'Your opponent\'s Active Pokémon is now Poisoned. During your opponent\'s next turn, that Pokémon can\'t retreat.'
  },
  {
    name: 'Sludge Bomb',
    cost: [D, D, C],
    damage: 130,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'EVS';
  public setNumber: string = '100';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Garbodor V';
  public fullName: string = 'Garbodor V EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
      return BLOCK_RETREAT(store, state, effect, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    return state;
  }
}
