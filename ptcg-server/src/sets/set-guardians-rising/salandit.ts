import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Salandit extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 70;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Scratch',
      cost: [CardType.FIRE],
      damage: 10,
      text: '',
    },
    {
      name: 'Venoshock',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 20,
      damageCalculation: '+',
      text: 'If your opponent\'s Active Pokémon is Poisoned, this attack does 40 more damage.',
    }
  ];

  public set: string = 'GRI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '15';

  public name: string = 'Salandit';

  public fullName: string = 'Salandit GRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      let damage = 20;
      if (effect.opponent.active.specialConditions.includes(SpecialCondition.POISONED)) {
        damage += 40;
      }
      effect.damage = damage;
    }

    return state;
  }
}
