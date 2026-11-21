import { EnergyCard } from '../../game';
import { CardType } from '../../game';
import { EnergyType } from '../../game';
import { State } from '../../game';
import { StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { queueSpecialEnergyReaction } from '../../game/store/prefabs/hand-energy-reactions';

export class HealthEnergy extends EnergyCard {
  public provides: CardType[] = [C];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '94';
  public name: string = 'Health Energy';
  public fullName: string = 'Health Energy MD';
  public text: string = 'Health Energy provides Colorless Energy. When you attach this card from your hand to 1 of your Pokémon, remove 1 damage counter from that Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterAttachEnergyFromHandEffect && effect.energyCard === this) {
      queueSpecialEnergyReaction(store, state, effect, this, () => {
        store.reduceEffect(state, new HealEffect(effect.player, effect.target, 10));
      });
    }

    return state;
  }
}
