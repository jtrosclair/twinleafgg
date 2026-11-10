import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

export class Cherubi extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp = 50;
  public weakness = [{ type: CardType.FIRE, value: 10 }];
  public resistance = [{ type: CardType.WATER, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Ram", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Solarbeam", cost: [CardType.GRASS, CardType.COLORLESS], damage: 20, text: "" }
  ];
  public set = 'AR';
  public setNumber = "60";
  public cardImage = 'assets/cardback.png';
  public name = "Cherubi";
  public fullName = "Cherubi AR";
}
