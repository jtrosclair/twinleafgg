import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class HakamoO extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Jangmo-o';
  public hp: number = 90;
  public cardType: CardType = CardType.DRAGON;
  public weakness = [];
  public resistance = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Sharp Fang',
    cost: [CardType.COLORLESS],
    damage: 20,
    text: ''
  },
  {
    name: 'Dragon Claw',
    cost: [CardType.LIGHTNING, CardType.FIGHTING],
    damage: 70,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '111';
  public name: string = 'Hakamo-o';
  public fullName: string = 'Hakamo-o 30C';
}
