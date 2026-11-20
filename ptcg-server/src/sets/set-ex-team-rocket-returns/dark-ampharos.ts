import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PokemonCard, Stage, CardType, CardTag, PowerType, StoreLike, State, StateUtils, GameLog } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterEvolveEffect, PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class DarkAmpharos extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType = L;
  public additionalCardTypes = [D];
  public tags = [CardTag.DARK];
  public hp: number = 120;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Darkest Impulse',
    powerType: PowerType.ABILITY,
    text: 'As long as Dark Ampharos is in play, whenever your opponent plays an Evolution card from his or her hand to evolve 1 of his or her Pokémon, put 2 damage counters on that Pokémon. You can\'t use more than 1 Darkest Impulse Poké-Body each turn.'
  }];

  public attacks = [{
    name: 'Ram',
    cost: [C, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Shock Bolt',
    cost: [L, C, C],
    damage: 70,
    text: 'Discard all [L] Energy attached to Dark Ampharos.'
  }];

  public set: string = 'TRR';
  public setNumber: string = '2';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dark Ampharos';
  public fullName: string = 'Dark Ampharos TRR';
  public evolvesFrom: string = 'Dark Flaaffy';

  private readonly DARKEST_IMPULSE_MARKER = 'TRR_DARKEST_IMPULSE_USED';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.DARKEST_IMPULSE_MARKER);
    }

    // Ref: upstream db4eebfcf (preventable counters), with this fork's completed evolution hook.
    if (effect instanceof AfterEvolveEffect && effect.playedFromHand) {
      const player = effect.player;
      const owner = StateUtils.getOpponent(state, player);
      if (!StateUtils.isPokemonInPlay(owner, this) || player.marker.hasMarker(this.DARKEST_IMPULSE_MARKER)
        || IS_ABILITY_BLOCKED(store, state, owner, this)) return state;

      player.marker.addMarkerToState(this.DARKEST_IMPULSE_MARKER);
      store.log(state, GameLog.LOG_PLAYER_USES_ABILITY, { name: owner.name, ability: this.powers[0].name });
      return store.reduceEffect(state, new PlaceDamageCountersEffect(owner, effect.target, 20, this, this.powers[0]));
    }

    return state;
  }
}
