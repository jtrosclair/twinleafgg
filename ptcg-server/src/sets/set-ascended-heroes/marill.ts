import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, preserveLegacyNextTurnAttackProtection } from '../../game/store/prefabs/effect-of-attack-prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Marill extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: M }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Hide',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
  },
  {
    name: 'Flop',
    cost: [P, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '83';
  public name: string = 'Marill';
  public fullName: string = 'Marill MC';

  public readonly PREVENT_DAMAGE_MARKER = 'PREVENT_DAMAGE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-black-bolt-white-flare/tranquill.ts (Fly).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this);
    }

    preserveLegacyNextTurnAttackProtection(state, effect, this, this.PREVENT_DAMAGE_MARKER, { preventEffects: true });
    // Clear marker at end of opponent's turn
    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.active.marker.hasMarker(this.PREVENT_DAMAGE_MARKER, this)) {
        opponent.active.marker.removeMarker(this.PREVENT_DAMAGE_MARKER, this);
      }
    }

    return state;
  }
}
