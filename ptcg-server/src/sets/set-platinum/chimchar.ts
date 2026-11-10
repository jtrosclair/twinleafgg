import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

export class Chimchar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp = 50;
  public weakness = [{ type: CardType.WATER, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Bite", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Fire Punch", cost: [CardType.FIRE, CardType.COLORLESS], damage: 20, text: "" }
  ];
  public set = 'PL';
  public setNumber = "70";
  public cardImage = 'assets/cardback.png';
  public name = "Chimchar";
  public fullName = "Chimchar PL";
}
