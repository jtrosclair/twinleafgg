import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';

// Upstream: ptcg-server/src/sets/set-pop-series-2/bulbasaur.ts
export class Round27BulbasaurP212 extends PokemonCard {
  public stage = Stage.BASIC;
  public cardType = CardType.GRASS;
  public hp = 40;
  public weakness = [{ type: CardType.PSYCHIC }];
  public resistance = [];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    { name: "Bite", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Razor Leaf", cost: [CardType.GRASS, CardType.COLORLESS], damage: 20, text: "" }
  ];
  public set: string = "P2";
  public setNumber = "12";
  public cardImage = 'assets/cardback.png';
  public name = "Bulbasaur";
  public fullName = "Bulbasaur P2";
}
