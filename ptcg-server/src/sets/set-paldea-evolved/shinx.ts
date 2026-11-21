import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { GameError, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../game/store/prefabs/effect-of-ability-prefabs';
import { ABILITY_USED, IS_ABILITY_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, SWITCH_OUT_OPPONENT_ACTIVE_POKEMON, USE_ABILITY_ONCE_PER_TURN, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Shinx extends PokemonCard {
  public stage = Stage.BASIC;
  public cardType = L;
  public hp = 40;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Big Roar',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, if this Pokémon is in the Active Spot, you may switch out your opponent\'s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)'
  }];

  public attacks = [{
    name: 'Ram',
    cost: [L],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'PAL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '68';
  public name: string = 'Shinx';
  public fullName: string = 'Shinx PAL';

  public readonly BIG_ROAR_MARKER = 'BIG_ROAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.BIG_ROAR_MARKER, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.BIG_ROAR_MARKER, this);

    // Ref: set-paradox-rift/iron-bundle.ts (the opponent chooses; protection applies to their current Active).
    if (WAS_POWER_USED(effect, 0, this)) {
      const { player, power } = effect;
      const opponent = StateUtils.getOpponent(state, player);
      if (player.active.getPokemonCard() !== this || !opponent.bench.some(slot => slot.getPokemonCard())) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (IS_ABILITY_BLOCKED(store, state, player, this)) throw new GameError(GameMessage.BLOCKED_BY_EFFECT);

      USE_ABILITY_ONCE_PER_TURN(player, this.BIG_ROAR_MARKER, this);
      ABILITY_USED(player, this);
      if (CAN_APPLY_ABILITY_TO_TARGET(store, state, player, power, this, opponent.active)) {
        return SWITCH_OUT_OPPONENT_ACTIVE_POKEMON(store, state, player);
      }
    }
    return state;
  }
}
