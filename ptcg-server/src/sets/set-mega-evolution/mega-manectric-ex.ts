import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PREVENT_DAMAGE, preserveLegacyNextTurnAttackProtection } from '../../game/store/prefabs/effect-of-attack-prefabs';
import { GameMessage, PokemonCard } from '../../game';
import { CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN, CONFIRMATION_PROMPT, DISCARD_ALL_ENERGY_FROM_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MegaManectricEx extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Electrike';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public hp: number = 330;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [{
    name: 'Flash Ray',
    cost: [L, L],
    damage: 120,
    text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Basic Pokémon.'
  },
  {
    name: 'Riotous Blasting',
    cost: [L, L, L],
    damage: 200,
    damageCalculation: '+',
    text: 'You may discard all Energy from this Pokémon and have this attack do 130 more damage.'
  }];

  public set: string = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '50';
  public name: string = 'Mega Manectric ex';
  public fullName: string = 'Mega Manectric ex M1S';
  public regulationMark: string = 'I';

  public readonly PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
  public readonly CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ref: set-arceus/arceus-metal.ts (Metal Barrier), with a Basic-only damage filter.
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return PREVENT_DAMAGE(store, state, effect, this, { sourceStage: Stage.BASIC });
    }

    preserveLegacyNextTurnAttackProtection(
      state, effect, this, this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, { sourceStage: Stage.BASIC },
    );
    CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(
      state, effect, this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this,
    );

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          effect.damage += 130;
          DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
        }
      }, GameMessage.WANT_TO_DISCARD_ENERGY);
    }

    return state;
  }


}
