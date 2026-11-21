import { StoreLike, State } from '../../game';
import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { queueSpecialEnergyReaction } from '../../game/store/prefabs/hand-energy-reactions';

export class HealEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'DX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '94';
  public name = 'Heal Energy';
  public fullName = 'Heal Energy DX';

  public text = 'Heal Energy provides [C] Energy. When you attach this card from your hand to 1 of your Pokémon, remove 1 damage counter and all Special Conditions from that Pokémon. If Heal Energy is attached to Pokémon-ex, Heal Energy has no effect other than providing Energy.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AfterAttachEnergyFromHandEffect && effect.energyCard === this) {
      queueSpecialEnergyReaction(store, state, effect, this, () => {
        store.reduceEffect(state, new HealEffect(effect.player, effect.target, 10));
        effect.target.clearAllSpecialConditions();
      }, () => !effect.target.getPokemonCard()?.tags.includes(CardTag.POKEMON_ex));
    }

    return state;
  }
}
