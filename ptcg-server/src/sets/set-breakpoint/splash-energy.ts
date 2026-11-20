import { Card, GameError, GameMessage, PlayerType } from '../../game';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { IS_SPECIAL_ENERGY_BLOCKED, MOVE_CARDS, WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { registerKnockOutRescue } from '../../game/store/prefabs/knock-out-effects';
import { StoreLike } from '../../game/store/store-like';

export class SplashEnergy extends EnergyCard {

  public provides: CardType[] = [];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'BKP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '113';

  public name = 'Splash Energy';

  public fullName = 'Splash Energy BKP';

  public text =
    'This card can only be attached to [W] Pokémon. This card provides [W] Energy only while this card is attached to a [W] Pokémon.' +
    '\n\n' +
    'If the [W] Pokémon this card is attached to is Knocked Out by damage from an opponent\'s attack, put that Pokémon into your hand. (Discard all cards attached to it.)' +
    '\n\n' +
    '(If this card is attached to anything other than a [W] Pokémon, discard this card.)';

  public SPLASH_ENERGY_MARKER = 'SPLASH_ENERGY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Provide energy when attached to Water Pokemon
    if (effect instanceof CheckProvidedEnergyEffect
      && (effect.source.cards.includes(this) || effect.source.energies.cards.includes(this))) {
      const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkPokemonType);

      if (checkPokemonType.cardTypes.includes(CardType.WATER)) {
        effect.energyMap.push({ card: this, provides: [CardType.WATER] });
      }
    }

    // Prevent attaching to non Water Pokemon
    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      const checkPokemonType = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkPokemonType);

      if (!checkPokemonType.cardTypes.includes(CardType.WATER)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    }

    // Discard card when not attached to Water Pokemon
    if (effect instanceof CheckTableStateEffect) {
      state.players.forEach(player => {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (!(cardList.cards.includes(this) || cardList.energies.cards.includes(this)) || IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, cardList)) {
            return;
          }

          const checkPokemonType = new CheckPokemonTypeEffect(cardList);
          store.reduceEffect(state, checkPokemonType);
          if (!checkPokemonType.cardTypes.includes(CardType.WATER)) {
            MOVE_CARDS(store, state, cardList, player.discard, { cards: [this], sourceCard: this, sourceEffect: effect });
          }
        });
      });
    }

    // Ref: set-triumphant/rescue-energy.ts (return an evolution stack before Prizes).
    if (WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE(state, effect) && effect.resolveBeforeDiscard) {
      const { target, player } = effect;
      const isAttached = () => target.cards.includes(this) || target.energies.cards.includes(this);
      if (isAttached() && !IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, target)) {
        const type = new CheckPokemonTypeEffect(target);
        store.reduceEffect(state, type);
        if (type.cardTypes.includes(CardType.WATER)) registerKnockOutRescue(store, state, effect, this, isAttached);
      }
    }

    if (effect instanceof BetweenTurnsEffect) {
      state.players.forEach(player => {

        if (!player.marker.hasMarker(this.SPLASH_ENERGY_MARKER)) {
          return;
        }
        const rescued: Card[] = player.marker.markers
          .filter(m => m.name === this.SPLASH_ENERGY_MARKER)
          .map(m => m.source)
          .filter((card): card is Card => !!card);

        MOVE_CARDS(store, state, player.discard, player.hand, { cards: rescued, sourceCard: this, sourceEffect: this });
        player.marker.removeMarker(this.SPLASH_ENERGY_MARKER);
      });
    }

    return state;
  }

}
