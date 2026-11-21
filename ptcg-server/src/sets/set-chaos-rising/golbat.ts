import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PREVENT_DAMAGE, preserveLegacyNextTurnAttackProtection } from '../../game/store/prefabs/effect-of-attack-prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { StoreLike, State, StateUtils, PlayerType } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Golbat extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Zubat';
  public hp: number = 80;
  public cardType: CardType = D;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Covert Flight',
    cost: [D],
    damage: 30,
    text: 'During your opponent\'s next turn, this Pokemon does not take damage from attacks by Basic Pokemon.'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public usSetNumber = 'CRI 50';
  public name: string = 'Golbat';
  public fullName: string = 'Golbat M4';

  public readonly PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER = 'PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER';
  public readonly CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER = 'CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-arceus/arceus-metal.ts (Metal Barrier), with a Basic-only damage filter.
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return PREVENT_DAMAGE(store, state, effect, this, { sourceStage: Stage.BASIC });
    }

    preserveLegacyNextTurnAttackProtection(
      state, effect, this, this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, { sourceStage: Stage.BASIC },
    );

    if (effect instanceof EndTurnEffect) {
      if (effect.player.marker.hasMarker(this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this)) {
        effect.player.marker.removeMarker(this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this);
        const opponent = StateUtils.getOpponent(state, effect.player);
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          cardList.marker.removeMarker(this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this);
        });
      }
    }
    return state;
  }
}
