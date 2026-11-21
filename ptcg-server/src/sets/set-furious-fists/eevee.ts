import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { queueBasicEnergyEvolution } from '../../game/store/prefabs/energy-evolution';

export class Eevee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 50;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Energy Evolution',
    powerType: PowerType.ABILITY,
    text: 'When you attach a basic Energy card from your hand to this Pokémon, you may search your deck for a card that evolves from this Pokémon that is the same type as that Energy card and put it onto this Pokémon. (This counts as evolving this Pokémon.) Shuffle your deck afterward.'
  }];

  public attacks = [
    {
      name: 'Gnaw',
      cost: [C, C],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'FFI';
  public setNumber: string = '80';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Eevee';
  public fullName: string = 'Eevee FFI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterAttachEnergyFromHandEffect) {
      queueBasicEnergyEvolution(store, state, effect, this);
    }
    return state;
  }
}
