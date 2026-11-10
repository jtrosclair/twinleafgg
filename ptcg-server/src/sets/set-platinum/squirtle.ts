import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

export class Squirtle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp = 60;
  public weakness = [{ type: CardType.LIGHTNING, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Skull Bash", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Bite", cost: [CardType.WATER, CardType.COLORLESS], damage: 20, text: "" }
  ];
  public set = 'PL';
  public setNumber = "96";
  public cardImage = 'assets/cardback.png';
  public name = "Squirtle";
  public fullName = "Squirtle PL";
}
