import { CardType, PokemonCard, PowerType, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { registerKnockOutRetaliation } from '../../game/store/prefabs/knock-out-effects';

export class Maractus extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 110;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [{
    name: 'Explosive Needle',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is in the Active Spot and is Knocked Out by damage from an attack from your opponent\'s Pokémon, put 6 damage counters on the Attacking Pokémon.',
  }];

  public attacks = [{
    name: 'Corner',
    cost: [C],
    damage: 20,
    text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
  }];

  public set: string = 'JTG';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '8';
  public name: string = 'Maractus';
  public fullName: string = 'Maractus JTG';

  public readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER: string = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ref: knock-out-effects.ts (queue damage counters for the original attacker).
    registerKnockOutRetaliation(store, state, effect, this, 60);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    return state;
  }

}