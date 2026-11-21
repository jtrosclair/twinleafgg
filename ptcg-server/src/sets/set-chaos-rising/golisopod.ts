import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State, StateUtils } from '../../game';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { GamePhase } from '../../game/store/state/state';

export class Golisopod extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Wimpod';
  public hp: number = 140;
  public cardType: CardType = W;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Critical Cut',
    cost: [W],
    damage: 30,
    text: 'If this attack\'s damage Knocks Out your opponent\'s Active Pokemon, during your opponent\'s next turn, this Pokemon can\'t be affected by damage or effects of attacks.'
  },
  {
    name: 'Boundless Power',
    cost: [C, C, C],
    damage: 150,
    text: 'During your next turn, this Pokemon can\'t attack.'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '26';
  public usSetNumber = 'CRI 26';
  public name: string = 'Golisopod';
  public fullName: string = 'Golisopod M4';

  public readonly INVULN_MARKER = 'GOLISOPOD_M4_INVULN_MARKER';
  public readonly CLEAR_MARKER = 'GOLISOPOD_M4_CLEAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-lost-thunder/beautifly.ts (protection after a confirmed Knock Out).
    if (WAS_ATTACK_USED(effect, 0, this)) effect.protectAttackerOnDamageKnockOut = true;
    if (WAS_ATTACK_USED(effect, 1, this)) effect.source.cannotAttackNextTurnPending = true;

    // Older board states can still contain the previous protection marker.
    if (effect instanceof DealDamageEffect && !effect.ignoresDefendingDamageEffects && effect.target.getPokemonCard() === this) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (owner.active.marker.hasMarker(this.INVULN_MARKER, this) && state.phase === GamePhase.ATTACK) {
        effect.damage = 0;
        effect.preventDefault = true;
      }
    }
    if (effect instanceof PutDamageEffect && !effect.ignoresDefendingDamageEffects && effect.target.getPokemonCard() === this) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (owner.active.marker.hasMarker(this.INVULN_MARKER, this) && state.phase === GamePhase.ATTACK) {
        effect.preventDefault = true;
      }
    }
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_MARKER, this);
      const golisopodOwner = StateUtils.getOpponent(state, effect.player);
      golisopodOwner.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        cardList.marker.removeMarker(this.INVULN_MARKER, this);
      });
    }
    return state;
  }
}
