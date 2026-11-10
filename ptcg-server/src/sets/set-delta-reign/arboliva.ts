import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { GameError, GameMessage, PowerType, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAbilityEffect } from '../../game/store/effects/game-effects';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import {
  ABILITY_USED,
  SWITCH_OUT_OPPONENT_ACTIVE_POKEMON,
  HEAL_X_DAMAGE_FROM_THIS_POKEMON,
  IS_ABILITY_BLOCKED,
  REMOVE_MARKER_AT_END_OF_TURN,
  USE_ABILITY_ONCE_PER_TURN,
  WAS_ATTACK_USED,
  WAS_POWER_USED,
} from '../../game/store/prefabs/prefabs';

export class Arboliva extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Dolliv';
  public cardType: CardType = G;
  public hp: number = 150;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [{
    name: 'Slippery Oil',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may use this Ability. Switch out your opponent\'s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)'
  }];

  public attacks = [{
    name: 'Mega Drain',
    cost: [G, C],
    damage: 100,
    text: 'Heal 30 damage from this Pokémon.'
  }];

  public regulationMark = 'J';
  public set: string = 'DLR';
  public setNumber: string = '17';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Arboliva';
  public fullName: string = 'Arboliva MEM';

  public readonly OIL_SLIP_MARKER = 'ARBOLIVA_MEM_OIL_SLIP_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Oil Slip
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      if (!opponent.bench.some(b => b.cards.length > 0)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.OIL_SLIP_MARKER, this);
      ABILITY_USED(player, this);

      const abilityEffect = new EffectOfAbilityEffect(player, this.powers[0], this, opponent.active);
      store.reduceEffect(state, abilityEffect);
      if (!abilityEffect.preventDefault && abilityEffect.target) {
        SWITCH_OUT_OPPONENT_ACTIVE_POKEMON(store, state, player);
      }
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.OIL_SLIP_MARKER, this);

    return Arboliva.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  /** Mega Drain is attack-owned; Slippery Oil is not copied. */
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
    }

    return state;
  }
}
