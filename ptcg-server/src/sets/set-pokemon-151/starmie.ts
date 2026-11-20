import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { ABILITY_USED, MOVE_POKEMON_OFF_BOARD, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Starmie extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Staryu';
  public cardType: CardType = CardType.WATER;
  public hp: number = 90;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Mysterious Comet',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: ' Once during your turn, you may put 2 damage counters on 1 of your opponent\'s Pokémon. If you placed any damage counters in this way, discard this Pokémon and all attached cards.'
  }];

  public attacks = [{
    name: 'Speed Attack',
    cost: [CardType.WATER, CardType.COLORLESS],
    damage: 50,
    text: ''
  }];

  public set: string = 'MEW';
  public regulationMark = 'G';
  public setNumber: string = '121';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Starmie';
  public fullName: string = 'Starmie MEW';

  private readonly MYSTERIOUS_COMET_MARKER = 'MYSTERIOUS_COMET_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.MYSTERIOUS_COMET_MARKER, this);

    // Ref: upstream db4eebfcf (Mysterious Comet discards only after placing counters).
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.marker.hasMarker(this.MYSTERIOUS_COMET_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: true }
      ), selected => {
        const target = selected?.[0];
        if (!target) return;

        USE_ABILITY_ONCE_PER_TURN(player, this.MYSTERIOUS_COMET_MARKER, this);
        ABILITY_USED(player, this);
        const placement = new PlaceDamageCountersEffect(player, target, 20, this, this.powers[0]);
        store.reduceEffect(state, placement);

        const source = StateUtils.findPokemonSlot(state, this);
        if (!placement.preventDefault && placement.damage > 0 && source) {
          MOVE_POKEMON_OFF_BOARD(store, state, source, { pokemonDestination: player.discard, sourceCard: this });
          player.marker.removeMarker(this.MYSTERIOUS_COMET_MARKER, this);
        }
      });
    }

    return state;
  }
}
