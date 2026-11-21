import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {
  FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN,
  preserveLegacyNextTurnAttackProtection,
} from '../../game/store/prefabs/effect-of-attack-prefabs';
import { CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { MarkerConstants } from '../../game/store/markers/marker-constants';

export class Joltik extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 40;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Splashing Dodge',
    cost: [CardType.GRASS],
    damage: 10,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
  }];

  public set = 'SFA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name = 'Joltik';
  public fullName = 'Joltik SFA';
  public regulationMark = 'H';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ref: set-surging-sparks/flittle.ts (Splashing Dodge).
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
