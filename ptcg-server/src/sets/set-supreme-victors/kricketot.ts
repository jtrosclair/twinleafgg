import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

export class Kricketot extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp = 50;
  public weakness = [{ type: CardType.FIRE, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Headbutt", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Beat", cost: [CardType.GRASS, CardType.COLORLESS], damage: 20, text: "" }
  ];
  public set = 'SV';
  public setNumber = "109";
  public cardImage = 'assets/cardback.png';
  public name = "Kricketot";
  public fullName = "Kricketot SV";
}
