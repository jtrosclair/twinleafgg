import { RESTRICT_SPECIAL_ENERGY_ATTACHMENT } from '../../game/store/prefabs/special-energy-attachment';
import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class TeamRocketsEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS, CardType.COLORLESS];

  public blendedEnergies: CardType[] = [CardType.PSYCHIC, CardType.DARK];

  public blendedEnergyCount: number = 2;

  public tags: CardTag[] = [CardTag.TEAM_ROCKET];

  public energyType = EnergyType.SPECIAL;

  public regulationMark = 'I';

  public set: string = 'DRI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '182';

  public name = 'Team Rocket\'s Energy';

  public fullName = 'Team Rocket\'s Energy DRI';

  public text = `This card can only be attached to a Team Rocket's Pokémon. If this card is attached to anything other than a Team Rocket's Pokémon, discard this card.

  While this card is attached to a Pokémon, this card provides 2 in any combination of [P] and [D] Energy`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    RESTRICT_SPECIAL_ENERGY_ATTACHMENT(store, state, effect, this,
      target => target.getPokemonCard()?.tags.includes(CardTag.TEAM_ROCKET) === true);


    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      try {
        const energyEffect = new EnergyEffect(effect.player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      effect.energyMap.push({
        card: this,
        provides: [CardType.COLORLESS, CardType.COLORLESS]
      });
    }
    return state;
  }
}
