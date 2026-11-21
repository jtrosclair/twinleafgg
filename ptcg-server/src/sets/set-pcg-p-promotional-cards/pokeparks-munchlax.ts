import { HAS_MARKER, REMOVE_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_COIN_TO_APPLY_ATTACK_CONDITION } from '../../game/store/prefabs/attack-effects';
import { FLIP_COIN_TO_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN } from '../../game/store/prefabs/effect-of-attack-prefabs';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { GamePhase, State, StateUtils, StoreLike } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
export class PokeParksMunchlax extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Defense Curl',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all damage done to this Pokémon during your opponent\'s next turn.'
  },
  {
    name: 'Body Slam',
    cost: [C, C, C],
    damage: 30,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
  }];

  public set: string = 'PCGP';
  public name: string = 'PokéPark\'s Munchlax';
  public fullName: string = 'PokéPark\'s Munchlax PCGP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '40';

  public readonly DEFENSE_CURL_MARKER = 'DEFENSE_CURL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_COIN_TO_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this);
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && HAS_MARKER(this.DEFENSE_CURL_MARKER, effect.target, this)) {
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.findOwner(state, effect.source);
      if (player === opponent) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      effect.preventDefault = true;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_COIN_TO_APPLY_ATTACK_CONDITION(state, effect, SpecialCondition.PARALYZED);
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.DEFENSE_CURL_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.DEFENSE_CURL_MARKER, effect.player, this);
      this.marker.removeMarker(this.DEFENSE_CURL_MARKER, this);
    }

    return state;
  }

}
