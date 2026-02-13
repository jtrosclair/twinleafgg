import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardTag } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { EnergyCard, GameError, GameMessage, PowerType, StateUtils } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class SandyShocksex extends PokemonCard {

  public stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex, CardTag.ANCIENT];
  public cardType = F;
  public hp = 220;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public powers = [{
    name: 'Magnetic Absorption',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if your opponent has 4 or fewer Prize cards remaining, you may attach a Basic [F] Energy card from your discard pile to this Pokémon.'
  }];

  public attacks = [
    {
      name: 'Earthen Spike',
      cost: [F, F, C],
      damage: 200,
      text: 'During your next turn, this Pokémon can\'t attack.'
    }
  ];

  public regulationMark = 'G';
  public set: string = 'PAR';
  public setNumber: string = '108';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sandy Shocks ex';
  public fullName: string = 'Sandy Shocks ex PAR';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
  public readonly MAGNETIC_ABSORPTION_MARKER = 'MAGNETIC_ABSORPTION_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.MAGNETIC_ABSORPTION_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.MAGNETIC_ABSORPTION_MARKER, this)) {
      effect.player.marker.removeMarker(this.MAGNETIC_ABSORPTION_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      // Check marker
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
      console.log('marker added');
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const prizes = opponent.getPrizeLeft();

      if (player.marker.hasMarker(this.MAGNETIC_ABSORPTION_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (prizes > 4) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const fightingEnergy = player.discard.cards.find(c => {
        return c instanceof EnergyCard && c.name == 'Fighting Energy';
      });
      if (!fightingEnergy) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const cardList = StateUtils.findCardList(state, this);
      player.discard.moveCardTo(fightingEnergy, cardList);
      player.marker.addMarker(this.MAGNETIC_ABSORPTION_MARKER, this);
      return state;
    }
    return state;
  }
}