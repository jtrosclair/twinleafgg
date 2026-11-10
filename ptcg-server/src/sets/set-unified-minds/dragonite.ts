import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, EnergyCard, GameError, GameMessage, PlayerType, AttachEnergyPrompt, SlotType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

import { WAS_ATTACK_USED, WAS_POWER_USED, USE_ABILITY_ONCE_PER_TURN, ABILITY_USED, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Dragonite extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Dragonair';
  public cardType: CardType = N;
  public hp: number = 160;
  public weakness = [{ type: Y }];
  public retreat = [C, C];

  public powers = [{
    name: 'Hurricane Charge',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may attach a [W] Energy card, a [L] Energy card, or 1 of each from your hand to your Pokémon in any way you like.'
  }];

  public attacks = [{
    name: 'Dragon Impact',
    cost: [W, L, C, C],
    damage: 170,
    text: 'Discard 3 Energy from this Pokémon.'
  }];

  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '151';
  public name: string = 'Dragonite';
  public fullName: string = 'Dragonite UNM';

  public readonly HURRICANE_CHARGE_MARKER = 'HURRICANE_CHARGE_MARKER';

  private isUsableEnergy(card: unknown): card is EnergyCard {
    return card instanceof EnergyCard && card.energyType === EnergyType.BASIC
      && card.provides.some(type => type === CardType.WATER || type === CardType.LIGHTNING);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // A returned and replayed card is a new in-play instance for once-per-turn
    // purposes. Preserve the fork's existing marker reset on re-entry.
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      effect.player.marker.removeMarker(this.HURRICANE_CHARGE_MARKER, this);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 3);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      const blocked = player.hand.cards.map((card, index) => this.isUsableEnergy(card) ? -1 : index)
        .filter(index => index >= 0);
      if (blocked.length === player.hand.cards.length) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.HURRICANE_CHARGE_MARKER, this);
      ABILITY_USED(player, this);

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        {
          allowCancel: true,
          min: 0,
          max: 2,
          blocked,
          maxPerType: 1,
          validCardTypes: [CardType.WATER, CardType.LIGHTNING]
        },
      ), transfers => {
        for (const transfer of transfers || []) {
          if (!this.isUsableEnergy(transfer.card)) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARDS(store, state, player.hand, target, { cards: [transfer.card], sourceCard: this });
        }
      });
    }
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.HURRICANE_CHARGE_MARKER, this);
    return state;
  }
}
