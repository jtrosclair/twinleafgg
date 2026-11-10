import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

export class Electrike2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public hp = 60;
  public weakness = [{ type: CardType.FIGHTING, value: 10 }];
  public resistance = [{ type: CardType.METAL, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: 'Bite', cost: [CardType.COLORLESS], damage: 10, text: '' }
  ];
  public set = 'AR';
  public setNumber = '63';
  public cardImage = 'assets/cardback.png';
  public name = 'Electrike';
  public fullName = 'Electrike AR2';
}
