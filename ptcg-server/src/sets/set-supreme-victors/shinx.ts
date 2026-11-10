import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

export class Shinx extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public hp = 60;
  public weakness = [{ type: CardType.FIGHTING, value: 10 }];
  public resistance = [{ type: CardType.METAL, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Bite", cost: [CardType.LIGHTNING, CardType.COLORLESS], damage: 20, text: "" }
  ];
  public set = 'SV';
  public setNumber = "126";
  public cardImage = 'assets/cardback.png';
  public name = "Shinx";
  public fullName = "Shinx SV";
}
