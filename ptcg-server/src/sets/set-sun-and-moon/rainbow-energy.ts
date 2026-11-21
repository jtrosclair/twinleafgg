import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class RainbowEnergy extends EnergyCard {

  public provides: CardType[] = [C];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'SUM';

  public name = 'Rainbow Energy';

  public fullName = 'Rainbow Energy SUM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '137';

  public text =
    'This card provides [C] Energy. While in play, this card provides every ' +
    'type of Energy but provides only 1 Energy at a time. When you attach ' +
    'this card from your hand to 1 of your Pokemon, put 1 damage counter ' +
    'on that Pokemon.';

  /** Explicit opt-in for unambiguous mirror-only legacy puzzle attachments. */
  public reduceMirrorOnlyEnergyEffect(_store: StoreLike, state: State, effect: CheckProvidedEnergyEffect): State {
    effect.energyMap.push({ card: this, provides: [CardType.ANY] });
    return state;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      effect.energyMap.push({ card: this, provides: [CardType.ANY] });
    }

    if (effect instanceof AfterAttachEnergyFromHandEffect && effect.energyCard === this) {
      const { player, target } = effect;
      const canResolve = () => target.cards.includes(this)
        && target.getPokemonCard() === effect.recipientAtAttachment
        && !IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, target);
      if (canResolve()) {
        effect.reactions.set(this.name, {
          label: this.name,
          canResolve,
          resolve: () => { target.damage += 10; },
        });
      }
    }

    return state;
  }

}
