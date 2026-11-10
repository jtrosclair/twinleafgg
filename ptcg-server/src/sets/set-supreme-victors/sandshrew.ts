import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

export class Sandshrew extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIGHTING;
  public hp = 50;
  public weakness = [{ type: CardType.WATER, value: 10 }];
  public resistance = [{ type: CardType.LIGHTNING, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Scratch", cost: [CardType.FIGHTING], damage: 20, text: "" }
  ];
  public set = 'SV';
  public setNumber = "124";
  public cardImage = 'assets/cardback.png';
  public name = "Sandshrew";
  public fullName = "Sandshrew SV";
}
