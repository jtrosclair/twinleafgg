import { PokemonCard, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { COPY_OPPONENT_ACTIVE_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

import { flipToCopyAttack } from '../../game/store/prefabs/attack-coin-reflip';

export class Clefairy extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'D';

  public cardType: CardType = CardType.PSYCHIC;

  public weakness = [{ type: CardType.METAL }];

  public hp: number = 60;

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Pound',
      cost: [CardType.PSYCHIC],
      damage: 10,
      text: ''
    },
    {
      name: 'Mini-Metronome',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'Flip a coin. If heads, choose 1 of your opponent\'s Active Pokémon\'s attacks and use it as this attack.'
    }
  ];

  public set: string = 'VIV';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '63';

  public name: string = 'Clefairy';

  public fullName: string = 'Clefairy VIV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      return flipToCopyAttack(store, state, effect, () => COPY_OPPONENT_ACTIVE_ATTACK(store, state, effect, false), true);
    }

    return state;
  }

}