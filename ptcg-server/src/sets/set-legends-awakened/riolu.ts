import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

export class Riolu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIGHTING;
  public hp = 60;
  public weakness = [{ type: CardType.PSYCHIC, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Punch", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Low Kick", cost: [CardType.FIGHTING, CardType.COLORLESS], damage: 30, text: "" }
  ];
  public set = "LA";
  public setNumber = "117";
  public cardImage = 'assets/cardback.png';
  public name = "Riolu";
  public fullName = "Riolu LA";
}
