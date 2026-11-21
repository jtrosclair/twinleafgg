import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { ATTACH_ENERGY_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Joltik extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public hp: number = 30;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Jolting Charge',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Search your deck for up to 2 Basic [G] Energy cards and up to 2 Basic [L] Energy cards and attach them to your Pokémon in any way you like. Then, shuffle your deck.'
  }];

  public set: string = 'SCR';
  public regulationMark: string = 'H';
  public setNumber: string = '50';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Joltik';
  public fullName: string = 'Joltik SCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return ATTACH_ENERGY_PROMPT(store, state, effect.player, PlayerType.BOTTOM_PLAYER, SlotType.DECK,
        [SlotType.BENCH, SlotType.ACTIVE], { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: true, min: 0, max: 4, validCardTypes: [CardType.GRASS, CardType.LIGHTNING], maxPerType: 2 });
    }
    return state;
  }
}
