import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

export class Croagunk extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp = 60;
  public weakness = [{ type: CardType.PSYCHIC, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Hook", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Corkscrew Punch", cost: [CardType.PSYCHIC, CardType.COLORLESS], damage: 20, text: "" }
  ];
  public set = 'SV';
  public setNumber = "101";
  public cardImage = 'assets/cardback.png';
  public name = "Croagunk";
  public fullName = "Croagunk SV";
}
