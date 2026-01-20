import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Mamoswine extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Piloswine';
  public cardType: CardType = W;
  public hp: number = 180;
  public weakness = [{ type: M }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Wreck',
      cost: [C, C, C],
      damage: 120,
      damageCalculation: '+',
      text: 'If a Stadium is in play, this attack does 120 more damage. Then, discard that Stadium.'
    },
    {
      name: 'Blizzard Edge',
      cost: [W, C, C, C],
      damage: 200,
      text: 'Discard 2 Energy from this Pokémon.'
    }
  ];

  public regulationMark: string = 'I';
  public set: string = 'PFL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '25';
  public name: string = 'Mamoswine';
  public fullName: string = 'Mamoswine PFL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Wreck
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard) {
        effect.damage += 120;

        // Discard the Stadium
        const cardList = StateUtils.findCardList(state, stadiumCard);
        const owner = StateUtils.findOwner(state, cardList);
        cardList.moveTo(owner.discard);
      }
    }

    // Blizzard Edge
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);
    }

    return state;
  }
}
