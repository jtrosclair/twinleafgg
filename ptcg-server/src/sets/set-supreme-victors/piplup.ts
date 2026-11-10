import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

export class Piplup extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp = 60;
  public weakness = [{ type: CardType.LIGHTNING, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Pound", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Surf", cost: [CardType.WATER, CardType.COLORLESS], damage: 20, text: "" }
  ];
  public set = 'SV';
  public setNumber = "121";
  public cardImage = 'assets/cardback.png';
  public name = "Piplup";
  public fullName = "Piplup SV";
}
