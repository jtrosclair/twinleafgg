import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

// Upstream: ptcg-server/src/sets/11-mega-evolution/set-ascended-heroes/swirlix.ts
export class Round32SwirlixASC extends PokemonCard {
  public stage = Stage.BASIC;
  public hp = 60;
  public cardType = CardType.PSYCHIC;
  public weakness = [{ type: CardType.METAL }];
  public resistance = [];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    { name: "Ram", cost: [CardType.PSYCHIC], damage: 20, text: '' }
  ];
  public regulationMark = "J";
  public set = "ASC";
  public setNumber = "93";
  public cardImage = 'assets/cardback.png';
  public name = "Swirlix";
  public fullName = "Swirlix ASC";
}
