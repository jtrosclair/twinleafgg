import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

// Upstream: ptcg-server/src/sets/11-mega-evolution/set-ascended-heroes/helioptile.ts
export class Round32HelioptileASC extends PokemonCard {
  public stage = Stage.BASIC;
  public hp = 70;
  public cardType = CardType.LIGHTNING;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    { name: "Zap Kick", cost: [CardType.LIGHTNING, CardType.COLORLESS], damage: 30, text: '' }
  ];
  public regulationMark = "I";
  public set = "ASC";
  public setNumber = "63";
  public cardImage = 'assets/cardback.png';
  public name = "Helioptile";
  public fullName = "Helioptile ASC";
}
