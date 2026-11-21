import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { queueSpecialEnergyReaction } from '../../game/store/prefabs/hand-energy-reactions';
import { DRAW_CARDS } from '../../game/store/prefabs/prefabs';

export class RichEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public tags = [CardTag.ACE_SPEC];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'SSP';

  public regulationMark = 'H';

  public name = 'Enriching Energy';

  public fullName = 'Rich Energy SSP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '191';

  public text =
    'When this card is attached to a Pokémon, it provides 1 [C] Energy.' +
    '\n\n' +
    'When you attach this card from your hand to one of your Pokémon, draw 4 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AfterAttachEnergyFromHandEffect && effect.energyCard === this) {
      queueSpecialEnergyReaction(store, state, effect, this, () => DRAW_CARDS(effect.player, 4));
    }
    return state;
  }
}
