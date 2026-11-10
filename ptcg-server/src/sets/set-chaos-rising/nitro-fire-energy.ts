import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { StateUtils, StoreLike, State } from '../../game';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class NitroFireEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.FIRE];
  public energyType = EnergyType.SPECIAL;
  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '81';
  public usSetNumber = 'CRI 86';
  public name: string = 'Nitro Fire Energy';
  public fullName: string = 'Nitro Fire Energy M4';
  public text: string = 'As long as this card is attached to a Pokemon, it provides [R] Energy. If an attack used by the [R] Pokemon this card is attached to would discard this card, put it into your hand instead.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DiscardCardsEffect && effect.cards?.includes(this)) {
      try {
        const pokemon = effect.source;
        if (!pokemon?.energies?.cards?.includes(this)) return state;
        const owner = StateUtils.findOwner(state, pokemon);
        if (IS_SPECIAL_ENERGY_BLOCKED(store, state, owner, this, pokemon)) return state;
        const checkType = new CheckPokemonTypeEffect(pokemon);
        store.reduceEffect(state, checkType);
        if (checkType.cardTypes.includes(CardType.FIRE)) {
          effect.cards = effect.cards.filter(c => c !== this);
          // Move the physical attachment so its Energy mirror is cleared too.
          // Older snapshots can already contain the same card in the hand.
          if (owner.hand.cards.includes(this)) {
            pokemon.cards = pokemon.cards.filter(card => card !== this);
            pokemon.energies.cards = pokemon.energies.cards.filter(card => card !== this);
          } else if (pokemon.cards.includes(this)) {
            pokemon.moveCardTo(this, owner.hand);
          } else {
            pokemon.energies.moveCardTo(this, owner.hand);
          }
        }
      } catch {
        return state;
      }
    }
    return state;
  }
}
