import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

export class Buizel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp = 50;
  public weakness = [{ type: CardType.LIGHTNING, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Tackle", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Wave Splash", cost: [CardType.WATER, CardType.COLORLESS], damage: 20, text: "" }
  ];
  public set = 'SV';
  public setNumber = "92";
  public cardImage = 'assets/cardback.png';
  public name = "Buizel";
  public fullName = "Buizel SV";
}
