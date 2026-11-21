import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { GameError, GameMessage, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { AfterEvolveEffect, MovedFromActiveToBenchEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import {
  WAS_ATTACK_USED,
  WAS_POWER_USED,
  COIN_FLIP_PROMPT,
  IS_ABILITY_BLOCKED,
  ABILITY_USED,
  USE_ABILITY_ONCE_PER_TURN,
  REMOVE_MARKER_AT_END_OF_TURN,
  REPLACE_MARKER_AT_END_OF_TURN,
} from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { DISCARD_ENERGY_FROM_ABILITY } from '../../game/store/prefabs/effect-of-ability-prefabs';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class Rampardosex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Cranidos';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = F;
  public hp: number = 330;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public powers = [{
    name: 'Destructive Headbutt',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, if this Pokémon is in the Active Spot, you may flip a coin. If heads, discard 1 Energy from your opponent\'s Active Pokémon.',
  }];

  public attacks = [{
    name: 'Rampaging Hammer',
    cost: [F, F],
    damage: 150,
    text: 'During your next turn, attacks used by this Pokémon deal 150 more damage to your opponent\'s Active Pokémon.',
  }];

  public set: string = "PBL";
  public setNumber: string = "45";
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Rampardos ex';
  public fullName: string = 'Rampardos ex M5';

  public readonly DESTRUCTIVE_HEADBUTT_MARKER = 'RAMPARDOS_EX_DESTRUCTIVE_HEADBUTT_MARKER';
  public readonly RAMPAGING_HAMMER_MARKER = 'RAMPARDOS_EX_RAMPAGING_HAMMER_MARKER';
  public readonly CLEAR_RAMPAGING_HAMMER_MARKER = 'RAMPARDOS_EX_CLEAR_RAMPAGING_HAMMER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      USE_ABILITY_ONCE_PER_TURN(player, this.DESTRUCTIVE_HEADBUTT_MARKER, this);
      ABILITY_USED(player, this);
      return COIN_FLIP_PROMPT(store, state, player, heads => {
        if (heads) DISCARD_ENERGY_FROM_ABILITY(store, state, player, this.powers[0], this, opponent.active);
      });
    }
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.DESTRUCTIVE_HEADBUTT_MARKER, this);

    // Ref: set-unbroken-bonds/sandile-2.ts (an Active-only bonus on the next turn).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const source = effect.source;
      const attacker = source.getPokemonCard();
      afterAttackDamage(state, effect, (_store, state) => {
        if (attacker && source === effect.player.active && source.getPokemonCard() === attacker) {
          source.activeDamageBonusNextTurn = { amount: 150, pending: true };
        }
        return state;
      });
    }

    // Saved boards can still contain a pending or armed player marker.
    if (effect instanceof DealDamageEffect && effect.damage > 0
      && !effect.source.activeDamageBonusNextTurn && effect.source.getPokemonCard() === this
      && effect.target === effect.opponent.active && effect.player.marker.hasMarker(this.CLEAR_RAMPAGING_HAMMER_MARKER, this)) {
      effect.damage += 150;
    }
    if (effect instanceof EndTurnEffect) {
      REMOVE_MARKER_AT_END_OF_TURN(effect, this.CLEAR_RAMPAGING_HAMMER_MARKER, this);
      REPLACE_MARKER_AT_END_OF_TURN(effect, this.RAMPAGING_HAMMER_MARKER, this.CLEAR_RAMPAGING_HAMMER_MARKER, this);
    }
    if ((effect instanceof MovedFromActiveToBenchEffect && effect.pokemonCard === this)
      || (effect instanceof AfterEvolveEffect && effect.previousPokemonCard === this)) {
      effect.player.marker.removeMarker(this.RAMPAGING_HAMMER_MARKER, this);
      effect.player.marker.removeMarker(this.CLEAR_RAMPAGING_HAMMER_MARKER, this);
    }

    return state;
  }
}
