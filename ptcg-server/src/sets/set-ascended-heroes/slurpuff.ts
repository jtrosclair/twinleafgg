import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

// Upstream: ptcg-server/src/sets/11-mega-evolution/set-ascended-heroes/slurpuff.ts
export class Round32SlurpuffASC extends PokemonCard {
  public stage = Stage.STAGE_1;
  public evolvesFrom = "Swirlix";
  public hp = 120;
  public cardType = CardType.PSYCHIC;
  public weakness = [{ type: CardType.METAL }];
  public resistance = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Tackle", cost: [CardType.PSYCHIC], damage: 40, text: '' },
    { name: "Magical Shot", cost: [CardType.PSYCHIC, CardType.COLORLESS], damage: 70, text: '' }
  ];
  public regulationMark = "J";
  public set = "ASC";
  public setNumber = "94";
  public cardImage = 'assets/cardback.png';
  public name = "Slurpuff";
  public fullName = "Slurpuff ASC";
}
