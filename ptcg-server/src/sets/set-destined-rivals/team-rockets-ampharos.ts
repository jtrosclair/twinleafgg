import { PokemonCard, Stage, CardType, CardTag, StoreLike, State, PowerType, StateUtils, GameLog } from '../../game';
import { Effect, AfterEvolveEffect, PowerEffect, PutDamageCountersEffect } from '../../game/store/effects/game-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class TeamRocketsAmpharos extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Team Rocket\'s Flaaffy';
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = L;
  public hp: number = 140;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Darkest Impulse',
    powerType: PowerType.ABILITY,
    text: 'When your opponent plays a Pokémon from their hand to evolve 1 of their Pokémon during their turn, put 4 damage counters on that Pokémon. The effect of Darkest Impulse doesn\'t stack.'
  }];

  public attacks = [{
    name: 'Head Bolt',
    cost: [L, C, C],
    damage: 140,
    text: ''
  }];

  public set: string = 'DRI';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public name: string = 'Team Rocket\'s Ampharos';
  public fullName: string = 'Team Rocket\'s Ampharos DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Refs: upstream db4eebfcf (Darkest Impulse uses preventable counters),
    // set-pitch-black/ghost-veil.ts (ability-sourced counter prevention).
    // This fork signals completed evolutions through AfterEvolveEffect, so the
    // evolved Pokémon's own Ability is in play when protection is checked.
    if (effect instanceof AfterEvolveEffect && effect.playedFromHand
      && state.players[state.activePlayer] === effect.player) {
      const abilityOwner = StateUtils.getOpponent(state, effect.player);
      if (effect.darkestImpulseSV || !StateUtils.isPokemonInPlay(abilityOwner, this)
        || IS_ABILITY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      store.log(state, GameLog.LOG_PLAYER_USES_ABILITY, { name: abilityOwner.name, ability: this.powers[0].name });
      const power = new PowerEffect(abilityOwner, this.powers[0], this, effect.target);
      store.reduceEffect(state, new PutDamageCountersEffect(power, 40));
      effect.darkestImpulseSV = true;
    }

    return state;
  }
}
