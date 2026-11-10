import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

export class Gastly2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp = 50;
  public weakness = [{ type: CardType.DARK, value: 10 }];
  public resistance = [{ type: CardType.COLORLESS, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Gnaw", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Suffocating Gas", cost: [CardType.PSYCHIC, CardType.COLORLESS], damage: 20, text: "" }
  ];
  public set = 'AR';
  public setNumber = "64";
  public cardImage = 'assets/cardback.png';
  public name = "Gastly";
  public fullName = "Gastly AR2";
}
