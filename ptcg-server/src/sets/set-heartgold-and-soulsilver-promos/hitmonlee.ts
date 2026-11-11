import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';

// Upstream: ptcg-server/src/sets/05-heartgold-and-soulsilver/set-heartgold-and-soulsilver-promos/hitmonlee.ts
export class Round27HitmonleeHSP25 extends PokemonCard {
  public stage = Stage.BASIC;
  public cardType = CardType.FIGHTING;
  public hp = 80;
  public weakness = [{ type: CardType.PSYCHIC }];
  public resistance = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Kick", cost: [CardType.FIGHTING], damage: 20, text: "" },
    { name: "High Jump Kick", cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS], damage: 60, text: "" }
  ];
  public set: string = "HSP";
  public setNumber = "25";
  public cardImage = 'assets/cardback.png';
  public name = "Hitmonlee";
  public fullName = "Hitmonlee HSP";
}
