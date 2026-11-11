import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';

// Upstream: ptcg-server/src/sets/set-pop-series-5/charmander.ts
export class Round27CharmanderDeltaP510 extends PokemonCard {
  public stage = Stage.BASIC;
  public cardType = CardType.LIGHTNING;
  public hp = 50;
  public weakness = [{ type: CardType.WATER }];
  public resistance = [];
  public retreat = [CardType.COLORLESS];
  public tags = [CardTag.DELTA_SPECIES];
  public attacks = [
    { name: "Scratch", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Bite", cost: [CardType.LIGHTNING, CardType.COLORLESS], damage: 20, text: "" }
  ];
  public set: string = "P5";
  public setNumber = "10";
  public cardImage = 'assets/cardback.png';
  public name = "Charmander";
  public fullName = "Charmander δ P5";
}
