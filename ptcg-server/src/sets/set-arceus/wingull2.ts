import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

export class Wingull2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp = 50;
  public weakness = [{ type: CardType.LIGHTNING, value: 10 }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Rain Splash", cost: [CardType.WATER], damage: 20, text: "" }
  ];
  public set = 'AR';
  public setNumber = "81";
  public cardImage = 'assets/cardback.png';
  public name = "Wingull";
  public fullName = "Wingull AR2";
}
