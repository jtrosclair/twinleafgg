import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

// Upstream: ptcg-server/src/sets/11-mega-evolution/set-ascended-heroes/rolycoly.ts
export class Round32RolycolyASC extends PokemonCard {
  public stage = Stage.BASIC;
  public hp = 80;
  public cardType = CardType.FIGHTING;
  public weakness = [{ type: CardType.GRASS }];
  public resistance = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Mud-Slap", cost: [CardType.FIGHTING], damage: 20, text: '' }
  ];
  public regulationMark = "I";
  public set = "ASC";
  public setNumber = "118";
  public cardImage = 'assets/cardback.png';
  public name = "Rolycoly";
  public fullName = "Rolycoly ASC";
}
