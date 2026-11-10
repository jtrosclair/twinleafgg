import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

export class Treecko2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp = 60;
  public weakness = [{ type: CardType.FIRE, value: 10 }];
  public resistance = [{ type: CardType.WATER, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Pound", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Slash", cost: [CardType.GRASS, CardType.COLORLESS], damage: 20, text: "" }
  ];
  public set = 'AR';
  public setNumber = "79";
  public cardImage = 'assets/cardback.png';
  public name = "Treecko";
  public fullName = "Treecko AR2";
}
