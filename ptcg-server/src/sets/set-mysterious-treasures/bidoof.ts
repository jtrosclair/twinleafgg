import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

// Upstream: ptcg-server/src/sets/04-diamond-pearl-platinum/set-mysterious-treasures/bidoof.ts
export class Round32BidoofMT extends PokemonCard {
  public stage = Stage.BASIC;
  public hp = 60;
  public cardType = CardType.COLORLESS;
  public weakness = [{ type: CardType.FIGHTING, value: 10 }];
  public resistance = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Tackle", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 30, text: '' }
  ];
  public set = "MT";
  public setNumber = "73";
  public cardImage = 'assets/cardback.png';
  public name = "Bidoof";
  public fullName = "Bidoof MT";
}
