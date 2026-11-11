import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

// Upstream: ptcg-server/src/sets/10-scarlet-and-violet/set-pokemon-151/gastly.ts
export class Round32GastlyMEW extends PokemonCard {
  public stage = Stage.BASIC;
  public hp = 50;
  public cardType = CardType.PSYCHIC;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    { name: "Suffocating Gas", cost: [CardType.PSYCHIC], damage: 20, text: '' }
  ];
  public regulationMark = "G";
  public set = "MEW";
  public setNumber = "92";
  public cardImage = 'assets/cardback.png';
  public name = "Gastly";
  public fullName = "Gastly MEW";
}
