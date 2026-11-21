import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Player, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { MarkerItem } from '../../game/store/state/card-marker';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Mabosstiff extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Maschiff';
  public cardType: CardType = D;
  public hp: number = 140;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Bite',
    cost: [D, D],
    damage: 60,
    text: '',
  },
  {
    name: 'Diving Headbutt',
    cost: [D, D, D],
    damage: 210,
    text: 'During your opponent\'s next turn, this Pokémon takes 100 extra damage from attacks from your opponent\'s Pokémon.',
  }];

  public set: string = "PBL";
  public setNumber: string = "58";
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mabosstiff';
  public fullName: string = 'Mabosstiff M5';

  public readonly DIVING_DEBUFF_MARKER = MarkerConstants.MABOSSTIFF_HEADBUTT_DAMAGE;
  public readonly CLEAR_DIVING_MARKER = MarkerConstants.CLEAR_MABOSSTIFF_HEADBUTT_DAMAGE;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Diving Headbutt leaves the vulnerability on the attacker after damage.
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const { player, opponent, source } = effect;
      const attacker = source.getPokemonCard();
      afterAttackDamage(state, effect, (_store, next) => {
        if (attacker && player.active === source && source.getPokemonCard() === attacker) {
          source.marker.addMarker(this.DIVING_DEBUFF_MARKER, this, 'attack', 'pokemon');
          opponent.marker.addMarker(this.CLEAR_DIVING_MARKER, this, 'attack', 'player');
        }
        return next;
      });
    }

    return state;
  }

  public reducePlayerMarkerEffect(_store: StoreLike, state: State, effect: Effect, owner: Player, marker: MarkerItem): State {
    if (effect instanceof EndTurnEffect && effect.player === owner && marker.name === this.CLEAR_DIVING_MARKER) {
      CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(
        state, effect, this.CLEAR_DIVING_MARKER, this.DIVING_DEBUFF_MARKER, this,
      );
    }
    return state;
  }
}
