import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Zweilous extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Deino';
  public hp: number = 100;
  public cardType: CardType = CardType.DARK;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Clamp',
    cost: [CardType.DARK],
    damage: 20,
    text: ''
  },
  {
    name: 'Skull Bash',
    cost: [CardType.DARK, CardType.COLORLESS],
    damage: 50,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '98';
  public name: string = 'Zweilous';
  public fullName: string = 'Zweilous 30C';
}
