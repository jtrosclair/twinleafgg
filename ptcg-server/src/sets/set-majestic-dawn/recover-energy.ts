import { EnergyCard } from '../../game';
import { CardType } from '../../game';
import { EnergyType } from '../../game';
import { State } from '../../game';
import { StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { queueSpecialEnergyReaction } from '../../game/store/prefabs/hand-energy-reactions';

export class RecoverEnergy extends EnergyCard {
  public provides: CardType[] = [C];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';
  public name: string = 'Recover Energy';
  public fullName: string = 'Recover Energy MD';
  public text: string = 'Recover Energy provides Colorless Energy. When you attach this card from your hand to 1 of your Pokémon, remove all Special Conditions from that Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterAttachEnergyFromHandEffect && effect.energyCard === this) {
      queueSpecialEnergyReaction(store, state, effect, this, () => effect.target.clearAllSpecialConditions());
    }

    return state;
  }
}
