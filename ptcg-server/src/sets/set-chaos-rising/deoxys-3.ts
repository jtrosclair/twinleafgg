import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE, preserveLegacyAbilityDamageProtection } from '../../game/store/prefabs/effect-of-attack-prefabs';

export class Deoxys3 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 130;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C, C];

  public readonly PSY_PROTECT_MARKER = 'DEOXYS3_PSY_PROTECT_MARKER';
  public readonly CLEAR_PSY_PROTECT_MARKER = 'DEOXYS3_CLEAR_PSY_PROTECT_MARKER';

  public attacks = [
    {
      name: 'Psy Protect',
      cost: [P, P, C],
      damage: 80,
      text: 'During your opponent\'s next turn, prevent all damage done to this Pokemon from attacks from your opponent\'s Pokemon that have any Abilities.'
    }
  ];

  public regulationMark: string = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public usSetNumber = 'CRI 33';
  public name: string = 'Deoxys';
  public fullName: string = 'Deoxys M4 33';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-chaos-rising/deoxys-3-batch16.ts (damage protection from Pokémon with an Ability).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return PREVENT_DAMAGE(store, state, effect, this, { sourceHasAbility: true });
    }

    preserveLegacyAbilityDamageProtection(store, state, effect, this, this.PSY_PROTECT_MARKER);
    CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(
      state, effect, this.CLEAR_PSY_PROTECT_MARKER, this.PSY_PROTECT_MARKER, this
    );

    return state;
  }
}
