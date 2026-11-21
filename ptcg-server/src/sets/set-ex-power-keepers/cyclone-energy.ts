import { StoreLike, State, StateUtils } from '../../game';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { queueSpecialEnergyReaction } from '../../game/store/prefabs/hand-energy-reactions';
import { SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';

export class CycloneEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'PK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '90';
  public name = 'Cyclone Energy';
  public fullName = 'Cyclone Energy PK';

  public text = 'Cyclone Energy provides [C] Energy. When you attach this card from your hand to your Active Pokémon, switch 1 of the Defending Pokémon with 1 of your opponent\'s Benched Pokémon. Your opponent chooses the Benched Pokémon to switch.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AfterAttachEnergyFromHandEffect && effect.energyCard === this) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (effect.activePokemonAtAttachment === effect.target.getPokemonCard()) {
        queueSpecialEnergyReaction(store, state, effect, this, () => {
          SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
        }, () => opponent.bench.some(slot => !!slot.getPokemonCard()));
      }
    }

    return state;
  }
}
