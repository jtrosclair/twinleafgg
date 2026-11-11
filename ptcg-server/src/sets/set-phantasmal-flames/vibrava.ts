import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

// Upstream: ptcg-server/src/sets/11-mega-evolution/set-phantasmal-flames/vibrava.ts
export class Round32VibravaPFL extends PokemonCard {
  public stage = Stage.STAGE_1;
  public evolvesFrom = "Trapinch";
  public hp = 90;
  public cardType = CardType.FIGHTING;
  public weakness = [{ type: CardType.GRASS }];
  public resistance = [];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    { name: "Super Vibration", cost: [CardType.FIGHTING, CardType.FIGHTING], damage: 60, text: '' }
  ];
  public regulationMark = "I";
  public set = "PFL";
  public setNumber = "52";
  public cardImage = 'assets/cardback.png';
  public name = "Vibrava";
  public fullName = "Vibrava PFL";
}
