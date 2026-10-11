import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Deino extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = CardType.DARK;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Gnaw',
    cost: [CardType.DARK],
    damage: 10,
    text: ''
  },
  {
    name: 'Headbutt',
    cost: [CardType.DARK, CardType.COLORLESS],
    damage: 20,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '97';
  public name: string = 'Deino';
  public fullName: string = 'Deino 30C';
}
