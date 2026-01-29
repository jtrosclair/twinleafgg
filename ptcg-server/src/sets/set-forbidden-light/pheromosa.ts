import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

// FLI Pheromosa 11 (https://limitlesstcg.com/cards/FLI/11)
export class Pheromosa extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.ULTRA_BEAST];

  public cardType: CardType = CardType.GRASS;

  public hp: number = 110;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [];

  public attacks = [
    { name: 'High Jump Kick', cost: [CardType.COLORLESS], damage: 20, text: '' },
    { name: 'White Ray', cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS], damage: 90, text: 'If you have only 1 Prize card remaining, this attack does 90 more damage.' }
  ];

  public set: string = 'FLI';

  public name: string = 'Pheromosa';

  public fullName: string = 'Pheromosa FLI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '11';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      if (player.getPrizeLeft() === 1) {
        effect.damage += 90;
      }
    }

    return state;
  }

}
