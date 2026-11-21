import { RESTRICT_SPECIAL_ENERGY_ATTACHMENT } from '../../game/store/prefabs/special-energy-attachment';
import { StoreLike, State, StateUtils, GameMessage } from '../../game';
import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';


export class ScrambleEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;

  public set: string = 'DX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '95';
  public name = 'Scramble Energy';
  public fullName = 'Scramble Energy DX';

  public text: string = 'Scramble Energy can be attached only to an Evolved Pokémon (excluding Pokémon-ex). Scramble Energy provides [C] Energy. While in play, if you have more Prize cards left than your opponent, Scramble Energy provides every type of Energy but provides only 3 in any combination at a time. If the Pokémon Scramble Energy is attached to isn\'t an Evolved Pokémon (or evolves into Pokémon-ex), discard Scramble Energy.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    RESTRICT_SPECIAL_ENERGY_ATTACHMENT(store, state, effect, this,
      target => target.isEvolved() && !target.getPokemonCard()?.tags.includes(CardTag.POKEMON_ex),
      GameMessage.INVALID_TARGET);


    // Provide energy 
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const provides = player.getPrizeLeft() > opponent.getPrizeLeft()
        ? [CardType.ANY, CardType.ANY, CardType.ANY]
        : [CardType.COLORLESS];

      effect.energyMap.push({ card: this, provides });
      return state;
    }

    return state;
  }
}