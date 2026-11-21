import { StoreLike, State } from '../../game';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class JetEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'PAL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '190';
  public regulationMark = 'G';
  public name = 'Jet Energy';
  public fullName = 'Jet Energy PAL';

  public text = `As long as this card is attached to a Pokémon, it provides [C] Energy.

When you attach this card from your hand to 1 of your Benched Pokémon, switch that Pokémon with your Active Pokémon.`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AfterAttachEnergyFromHandEffect && effect.energyCard === this) {
      const player = effect.player;
      const target = effect.target;

      const canResolve = () => player.bench.includes(target) && target.cards.includes(this)
        && !IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, target);
      if (canResolve()) {
        effect.reactions.set(this.name, {
          label: this.name,
          canResolve,
          resolve: () => { player.switchPokemon(target, store, state); },
        });
      }
    }

    return state;
  }
}
