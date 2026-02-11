import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Larvitar extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 60;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Second Strike',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 10,
      damageCalculation: '+',
      text: 'If your opponent\'s Active Pokémon already has 3 or more damage counters on it, this attack does 70 more damage.'
    }
  ];

  public set: string = 'LOT';

  public setNumber = '115';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Larvitar';

  public fullName: string = 'Larvitar LOT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.opponent.active.damage >= 30) {
        effect.damage += 70;
      }
    }

    return state;
  }
}
