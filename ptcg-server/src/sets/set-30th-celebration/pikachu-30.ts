import { PokemonCard, Stage, CardType, StoreLike, State } from "../../game";
import { Effect } from "../../game/store/effects/effect";

/** #30 — Mach Bolt */
export class Pikachu30 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = CardType.LIGHTNING;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];
  public attacks = [{
    name: 'Mach Bolt',
    cost: [CardType.LIGHTNING],
    damage: 30,
    text: ''
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '30';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 30';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }
}
