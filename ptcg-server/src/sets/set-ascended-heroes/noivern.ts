import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN, COIN_FLIP_PROMPT, PREVENT_DAMAGE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Noivern extends PokemonCard {
  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Noibat';
  public hp = 120;
  public cardType: CardType = N;
  public weakness = [];
  public retreat = [];
  public attacks = [{
    name: 'Agility', cost: [C, C], damage: 40,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
  }, {
    name: 'Enhanced Blade', cost: [P, D], damage: 70, damageCalculation: '+',
    text: 'If this Pokémon has a Pokémon Tool attached, this attack does 70 more damage.'
  }];
  public regulationMark = 'I';
  public set = 'ASC';
  public cardImage = 'assets/cardback.png';
  public setNumber = '157';
  public name = 'Noivern';
  public fullName = 'Noivern ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Agility. Ref: set-ascended-heroes/hops-phantump.ts (Splashing Dodge).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
        }
      });
    }
    // Enhanced Blade. Ref: set-scarlet-and-violet/greedent.ts (Enhanced Fang).
    if (WAS_ATTACK_USED(effect, 1, this) && effect.source.tools.length > 0) {
      effect.damage += 70;
    }
    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {
      const defender = StateUtils.getOpponent(state, effect.player);
      if (effect.source.getPokemonCard() && defender.active.marker.hasMarker(MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this)) {
        effect.preventDefault = true;
      }
    }
    CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(state, effect,
      MarkerConstants.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER,
      MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
    return state;
  }
}
