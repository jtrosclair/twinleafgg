import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';

// Upstream: ptcg-server/src/sets/04-diamond-pearl-platinum/set-arceus/manectric2.ts
export class Round27ManectricAR44 extends PokemonCard {
  public stage = Stage.STAGE_1;
  public cardType = CardType.LIGHTNING;
  public hp = 90;
  public weakness = [{ type: CardType.FIGHTING, value: 20 }];
  public resistance = [{ type: CardType.METAL, value: -20 }];
  public retreat = [];
  public evolvesFrom = "Electrike";
  public attacks = [
    { name: "Tackle", cost: [CardType.COLORLESS], damage: 20, text: "" },
    { name: "Head Bolt", cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS], damage: 60, text: "" }
  ];
  public set: string = "AR";
  public setNumber = "44";
  public cardImage = 'assets/cardback.png';
  public name = "Manectric";
  public fullName = "Manectric AR2";
}
