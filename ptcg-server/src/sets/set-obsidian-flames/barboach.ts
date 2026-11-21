import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import {
  FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN,
  preserveLegacyNextTurnAttackProtection,
} from '../../game/store/prefabs/effect-of-attack-prefabs';
import { CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Barboach extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Hide',
    cost: [F],
    damage: 0,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
  },
  {
    name: 'Mud-Slap',
    cost: [F, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'OBF';
  public setNumber: string = '108';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Barboach';
  public fullName: string = 'Barboach OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ref: set-black-bolt-white-flare/tranquill.ts (Fly).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this);
    }

    const marker = MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER;
    preserveLegacyNextTurnAttackProtection(state, effect, this, marker, { preventEffects: true });
    CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(
      state, effect, MarkerConstants.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, marker, this,
    );

    return state;
  }
}
