import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PREVENT_DAMAGE } from '../../game/store/prefabs/effect-of-attack-prefabs';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Chansey extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = C;

  public hp: number = 120;

  public weakness = [{ type: F }];

  public resistance = [{ type: P, value: -30 }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Scrunch',
      cost: [C, C],
      damage: 0,
      text: 'Flip a coin. If heads, prevent all damage done to Chansey during your opponent\'s next turn. (Any other effects of attacks still happen.)'
    },
    {
      name: 'Double-edge',
      cost: [C, C, C, C],
      damage: 80,
      text: 'Chansey does 80 damage to itself.'
    }
  ];

  public set: string = 'BS';

  public fullName = 'Chansey BS';

  public name = 'Chansey';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '3';

  public readonly PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
  public readonly CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ref: set-evolutions/chansey.ts (Scrunch uses one coin for damage protection).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, heads => {
        if (heads) PREVENT_DAMAGE(store, state, effect, this);
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 80);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    // Preserve protection in snapshots made before Scrunch used the typed effect.
    if ((effect instanceof DealDamageEffect || effect instanceof PutDamageEffect)
      && effect.target.marker.hasMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this)) {
      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this)) {

      effect.player.marker.removeMarker(this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
      });
    }
    return state;
  }
}