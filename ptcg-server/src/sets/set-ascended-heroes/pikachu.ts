import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

// Upstream: ptcg-server/src/sets/11-mega-evolution/set-ascended-heroes/pikachu.ts
export class Round32PikachuASC extends PokemonCard {
  public stage = Stage.BASIC;
  public hp = 70;
  public cardType = CardType.LIGHTNING;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    { name: "Tail Smack", cost: [CardType.LIGHTNING], damage: 10, text: '' },
    { name: "Tiny Bolt", cost: [CardType.LIGHTNING, CardType.COLORLESS], damage: 30, text: '' }
  ];
  public regulationMark = "J";
  public set = "ASC";
  public setNumber = "55";
  public cardImage = 'assets/cardback.png';
  public name = "Pikachu";
  public fullName = "Pikachu ASC";
}
